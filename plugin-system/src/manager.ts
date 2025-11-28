import * as path from 'path';
import {
  Plugin,
  PluginManifest,
  PluginStatus,
  InstallOptions,
  UninstallOptions,
  PluginFilter,
  PluginManagerConfig,
  PluginEvent,
  PluginEventHandler,
  PluginError,
  InstallError
} from './types';
import { Registry } from './registry';
import { Validator } from './validator';
import { DependencyResolver } from './resolver';
import { PluginLoader } from './loader';

/**
 * Plugin Manager
 * Main interface for managing Claude Skills plugins
 */
export class PluginManager {
  private config: PluginManagerConfig;
  private registry: Registry;
  private validator: Validator;
  private resolver: DependencyResolver;
  private loader: PluginLoader;
  private eventHandlers: Map<string, PluginEventHandler[]>;

  constructor(config: Partial<PluginManagerConfig> = {}) {
    const baseDir = config.pluginDir || path.join(process.cwd(), '.claude-plugin');

    this.config = {
      pluginDir: path.join(baseDir, 'plugins'),
      registryPath: path.join(baseDir, 'registry.json'),
      cacheDir: path.join(baseDir, 'cache'),
      logsDir: path.join(baseDir, 'logs'),
      validateChecksum: config.validateChecksum ?? true,
      autoUpdate: config.autoUpdate ?? false
    };

    this.registry = new Registry(this.config.registryPath);
    this.validator = new Validator();
    this.resolver = new DependencyResolver();
    this.loader = new PluginLoader(this.config.pluginDir);
    this.eventHandlers = new Map();
  }

  /**
   * Initialize the plugin manager
   */
  async initialize(): Promise<void> {
    await this.registry.initialize();
  }

  /**
   * Install a plugin from a source
   */
  async install(source: string, options: InstallOptions = {}): Promise<Plugin> {
    try {
      // Emit install event
      await this.emit({
        type: 'install',
        plugin: source,
        timestamp: new Date(),
        data: options
      });

      // Load manifest from source
      const manifest = await this.loader.loadManifest(source);

      // Check if already installed
      const existing = await this.registry.getPlugin(manifest.name);
      if (existing && !options.force) {
        throw new InstallError(
          `Plugin ${manifest.name} is already installed (version ${existing.version})`,
          manifest.name
        );
      }

      // Validate manifest
      const validation = await this.validator.validate(manifest, source);
      if (!validation.valid) {
        throw new InstallError(
          `Plugin validation failed: ${validation.errors.map(e => e.message).join(', ')}`,
          manifest.name
        );
      }

      // Resolve dependencies
      if (!options.skipDependencies && manifest.dependencies) {
        const installedPlugins = await this.getInstalledPluginsMap();
        const resolution = await this.resolver.resolve(manifest, installedPlugins);

        // Install dependencies first
        for (const depName of resolution.installOrder) {
          if (depName !== manifest.name) {
            const depManifest = installedPlugins.get(depName);
            if (!depManifest) {
              throw new InstallError(
                `Dependency ${depName} not available`,
                manifest.name
              );
            }
          }
        }
      }

      // Execute preInstall hook
      const tempPlugin: Plugin = {
        name: manifest.name,
        version: manifest.version,
        manifest,
        status: 'installing',
        installedAt: new Date(),
        updatedAt: new Date(),
        source,
        resolvedDependencies: {}
      };

      const preInstallResult = await this.loader.executeHook(tempPlugin, 'preInstall');
      if (!preInstallResult.success) {
        throw new InstallError(
          `preInstall hook failed: ${preInstallResult.error}`,
          manifest.name
        );
      }

      // Copy plugin to installation directory
      await this.loader.installPlugin(source, manifest.name, manifest.version);

      // Calculate checksum if enabled
      let checksum: string | undefined;
      if (this.config.validateChecksum) {
        checksum = await this.validator.calculateChecksum(
          this.loader.getPluginPath(manifest.name, manifest.version)
        );
      }

      // Create plugin record
      const plugin: Plugin = {
        name: manifest.name,
        version: manifest.version,
        manifest,
        status: options.activate === false ? 'inactive' : 'active',
        installedAt: new Date(),
        updatedAt: new Date(),
        source,
        checksum,
        resolvedDependencies: manifest.dependencies || {}
      };

      // Execute onInstall hook
      const installResult = await this.loader.executeHook(plugin, 'onInstall');
      if (!installResult.success) {
        // Rollback
        await this.loader.uninstallPlugin(manifest.name, manifest.version);
        throw new InstallError(
          `onInstall hook failed: ${installResult.error}`,
          manifest.name
        );
      }

      // Add to registry
      await this.registry.addPlugin(plugin);

      // Activate if requested
      if (options.activate !== false) {
        await this.activate(manifest.name);
      }

      return plugin;
    } catch (error) {
      await this.emit({
        type: 'error',
        plugin: source,
        timestamp: new Date(),
        data: error
      });
      throw error;
    }
  }

  /**
   * Uninstall a plugin
   */
  async uninstall(name: string, options: UninstallOptions = {}): Promise<void> {
    const entry = await this.registry.getPlugin(name);
    if (!entry) {
      throw new PluginError(`Plugin not found: ${name}`, 'PLUGIN_NOT_FOUND', name);
    }

    try {
      await this.emit({
        type: 'uninstall',
        plugin: name,
        timestamp: new Date(),
        data: options
      });

      // Load plugin
      const pluginPath = this.loader.getPluginPath(name, entry.version);
      const manifest = await this.loader.loadManifest(pluginPath);

      const plugin: Plugin = {
        name,
        version: entry.version,
        manifest,
        status: 'uninstalling',
        installedAt: new Date(entry.installedAt),
        updatedAt: new Date(),
        source: entry.source,
        checksum: entry.checksum,
        resolvedDependencies: entry.dependencies
      };

      // Execute onUninstall hook
      const uninstallResult = await this.loader.executeHook(plugin, 'onUninstall');
      if (!uninstallResult.success && !options.force) {
        throw new PluginError(
          `onUninstall hook failed: ${uninstallResult.error}`,
          'UNINSTALL_ERROR',
          name
        );
      }

      // Remove from filesystem
      await this.loader.uninstallPlugin(name, entry.version);

      // Remove from registry
      await this.registry.removePlugin(name);
    } catch (error) {
      await this.emit({
        type: 'error',
        plugin: name,
        timestamp: new Date(),
        data: error
      });
      throw error;
    }
  }

  /**
   * Activate a plugin
   */
  async activate(name: string): Promise<void> {
    const entry = await this.registry.getPlugin(name);
    if (!entry) {
      throw new PluginError(`Plugin not found: ${name}`, 'PLUGIN_NOT_FOUND', name);
    }

    if (entry.status === 'active') {
      return; // Already active
    }

    try {
      await this.emit({
        type: 'activate',
        plugin: name,
        timestamp: new Date()
      });

      // Load plugin
      const pluginPath = this.loader.getPluginPath(name, entry.version);
      const manifest = await this.loader.loadManifest(pluginPath);

      const plugin: Plugin = {
        name,
        version: entry.version,
        manifest,
        status: 'active',
        installedAt: new Date(entry.installedAt),
        updatedAt: new Date(),
        source: entry.source,
        checksum: entry.checksum,
        resolvedDependencies: entry.dependencies
      };

      // Execute onActivate hook
      const activateResult = await this.loader.executeHook(plugin, 'onActivate');
      if (!activateResult.success) {
        throw new PluginError(
          `onActivate hook failed: ${activateResult.error}`,
          'ACTIVATION_ERROR',
          name
        );
      }

      // Execute postActivate hook
      await this.loader.executeHook(plugin, 'postActivate');

      // Update status in registry
      await this.registry.updatePluginStatus(name, 'active');
    } catch (error) {
      await this.emit({
        type: 'error',
        plugin: name,
        timestamp: new Date(),
        data: error
      });
      throw error;
    }
  }

  /**
   * Deactivate a plugin
   */
  async deactivate(name: string): Promise<void> {
    const entry = await this.registry.getPlugin(name);
    if (!entry) {
      throw new PluginError(`Plugin not found: ${name}`, 'PLUGIN_NOT_FOUND', name);
    }

    if (entry.status === 'inactive') {
      return; // Already inactive
    }

    try {
      await this.emit({
        type: 'deactivate',
        plugin: name,
        timestamp: new Date()
      });

      // Load plugin
      const pluginPath = this.loader.getPluginPath(name, entry.version);
      const manifest = await this.loader.loadManifest(pluginPath);

      const plugin: Plugin = {
        name,
        version: entry.version,
        manifest,
        status: 'inactive',
        installedAt: new Date(entry.installedAt),
        updatedAt: new Date(),
        source: entry.source,
        checksum: entry.checksum,
        resolvedDependencies: entry.dependencies
      };

      // Execute onDeactivate hook
      const deactivateResult = await this.loader.executeHook(plugin, 'onDeactivate');
      if (!deactivateResult.success) {
        throw new PluginError(
          `onDeactivate hook failed: ${deactivateResult.error}`,
          'DEACTIVATION_ERROR',
          name
        );
      }

      // Update status in registry
      await this.registry.updatePluginStatus(name, 'inactive');
    } catch (error) {
      await this.emit({
        type: 'error',
        plugin: name,
        timestamp: new Date(),
        data: error
      });
      throw error;
    }
  }

  /**
   * List all plugins
   */
  async list(filter?: PluginFilter): Promise<Plugin[]> {
    const entries = await this.registry.getAllPlugins();
    const plugins: Plugin[] = [];

    for (const entry of entries) {
      // Apply filters
      if (filter?.status) {
        const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
        if (!statuses.includes(entry.status)) {
          continue;
        }
      }

      try {
        const pluginPath = this.loader.getPluginPath(entry.name, entry.version);
        const manifest = await this.loader.loadManifest(pluginPath);

        if (filter?.category && manifest.category !== filter.category) {
          continue;
        }

        if (filter?.keyword) {
          const searchText = `${manifest.name} ${manifest.description} ${manifest.keywords?.join(' ')}`.toLowerCase();
          if (!searchText.includes(filter.keyword.toLowerCase())) {
            continue;
          }
        }

        plugins.push({
          name: entry.name,
          version: entry.version,
          manifest,
          status: entry.status,
          installedAt: new Date(entry.installedAt),
          updatedAt: new Date(entry.updatedAt),
          source: entry.source,
          checksum: entry.checksum,
          resolvedDependencies: entry.dependencies
        });
      } catch {
        // Skip plugins that can't be loaded
        continue;
      }
    }

    return plugins;
  }

  /**
   * Get a specific plugin
   */
  async get(name: string): Promise<Plugin | null> {
    const entry = await this.registry.getPlugin(name);
    if (!entry) {
      return null;
    }

    try {
      const pluginPath = this.loader.getPluginPath(entry.name, entry.version);
      const manifest = await this.loader.loadManifest(pluginPath);

      return {
        name: entry.name,
        version: entry.version,
        manifest,
        status: entry.status,
        installedAt: new Date(entry.installedAt),
        updatedAt: new Date(entry.updatedAt),
        source: entry.source,
        checksum: entry.checksum,
        resolvedDependencies: entry.dependencies
      };
    } catch {
      return null;
    }
  }

  /**
   * Get installed plugins as a map (for dependency resolution)
   */
  private async getInstalledPluginsMap(): Promise<Map<string, PluginManifest>> {
    const plugins = await this.list();
    const map = new Map<string, PluginManifest>();

    for (const plugin of plugins) {
      map.set(plugin.name, plugin.manifest);
    }

    return map;
  }

  /**
   * Register an event handler
   */
  on(eventType: string, handler: PluginEventHandler): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }

  /**
   * Emit an event
   */
  private async emit(event: PluginEvent): Promise<void> {
    const handlers = this.eventHandlers.get(event.type);
    if (!handlers) return;

    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Event handler error for ${event.type}:`, error);
      }
    }
  }

  /**
   * Get plugin configuration
   */
  getConfig(): PluginManagerConfig {
    return { ...this.config };
  }
}
