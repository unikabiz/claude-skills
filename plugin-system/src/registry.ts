import * as fs from 'fs/promises';
import * as path from 'path';
import {
  PluginRegistry,
  RegistryEntry,
  Plugin,
  PluginStatus,
  Marketplace,
  PluginError
} from './types';

/**
 * Plugin Registry Manager
 * Handles persistent storage and retrieval of plugin metadata
 */
export class Registry {
  private registryPath: string;
  private registry: PluginRegistry | null = null;

  constructor(registryPath: string) {
    this.registryPath = registryPath;
  }

  /**
   * Initialize the registry (create if doesn't exist)
   */
  async initialize(): Promise<void> {
    try {
      await this.load();
    } catch (error) {
      // Registry doesn't exist, create new one
      this.registry = {
        version: '1.0.0',
        plugins: [],
        marketplaces: []
      };
      await this.save();
    }
  }

  /**
   * Load registry from disk
   */
  async load(): Promise<PluginRegistry> {
    try {
      const content = await fs.readFile(this.registryPath, 'utf-8');
      this.registry = JSON.parse(content);
      return this.registry!;
    } catch (error) {
      throw new PluginError('Failed to load registry', 'REGISTRY_LOAD_ERROR');
    }
  }

  /**
   * Save registry to disk
   */
  async save(): Promise<void> {
    if (!this.registry) {
      throw new PluginError('Registry not initialized', 'REGISTRY_NOT_INITIALIZED');
    }

    try {
      const dir = path.dirname(this.registryPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(this.registryPath, JSON.stringify(this.registry, null, 2));
    } catch (error) {
      throw new PluginError('Failed to save registry', 'REGISTRY_SAVE_ERROR');
    }
  }

  /**
   * Add a plugin to the registry
   */
  async addPlugin(plugin: Plugin): Promise<void> {
    await this.ensureLoaded();

    const entry: RegistryEntry = {
      name: plugin.name,
      version: plugin.version,
      status: plugin.status,
      installedAt: plugin.installedAt.toISOString(),
      updatedAt: plugin.updatedAt.toISOString(),
      source: plugin.source,
      checksum: plugin.checksum,
      dependencies: plugin.resolvedDependencies
    };

    // Remove existing entry if present
    this.registry!.plugins = this.registry!.plugins.filter(p => p.name !== plugin.name);
    this.registry!.plugins.push(entry);

    await this.save();
  }

  /**
   * Remove a plugin from the registry
   */
  async removePlugin(name: string): Promise<void> {
    await this.ensureLoaded();
    this.registry!.plugins = this.registry!.plugins.filter(p => p.name !== name);
    await this.save();
  }

  /**
   * Get a plugin from the registry
   */
  async getPlugin(name: string): Promise<RegistryEntry | null> {
    await this.ensureLoaded();
    return this.registry!.plugins.find(p => p.name === name) || null;
  }

  /**
   * Get all plugins from the registry
   */
  async getAllPlugins(): Promise<RegistryEntry[]> {
    await this.ensureLoaded();
    return [...this.registry!.plugins];
  }

  /**
   * Update plugin status
   */
  async updatePluginStatus(name: string, status: PluginStatus): Promise<void> {
    await this.ensureLoaded();

    const plugin = this.registry!.plugins.find(p => p.name === name);
    if (!plugin) {
      throw new PluginError(`Plugin not found: ${name}`, 'PLUGIN_NOT_FOUND', name);
    }

    plugin.status = status;
    plugin.updatedAt = new Date().toISOString();

    await this.save();
  }

  /**
   * Add a marketplace to the registry
   */
  async addMarketplace(marketplace: Marketplace): Promise<void> {
    await this.ensureLoaded();

    // Remove existing marketplace with same name
    this.registry!.marketplaces = this.registry!.marketplaces.filter(
      m => m.name !== marketplace.name
    );

    this.registry!.marketplaces.push(marketplace);
    await this.save();
  }

  /**
   * Remove a marketplace from the registry
   */
  async removeMarketplace(name: string): Promise<void> {
    await this.ensureLoaded();
    this.registry!.marketplaces = this.registry!.marketplaces.filter(m => m.name !== name);
    await this.save();
  }

  /**
   * Get all marketplaces
   */
  async getMarketplaces(): Promise<Marketplace[]> {
    await this.ensureLoaded();
    return [...this.registry!.marketplaces];
  }

  /**
   * Check if a plugin exists in the registry
   */
  async hasPlugin(name: string): Promise<boolean> {
    await this.ensureLoaded();
    return this.registry!.plugins.some(p => p.name === name);
  }

  /**
   * Get plugins by status
   */
  async getPluginsByStatus(status: PluginStatus): Promise<RegistryEntry[]> {
    await this.ensureLoaded();
    return this.registry!.plugins.filter(p => p.status === status);
  }

  /**
   * Ensure registry is loaded
   */
  private async ensureLoaded(): Promise<void> {
    if (!this.registry) {
      await this.initialize();
    }
  }

  /**
   * Clear all plugins (use with caution!)
   */
  async clear(): Promise<void> {
    await this.ensureLoaded();
    this.registry!.plugins = [];
    await this.save();
  }

  /**
   * Export registry as JSON
   */
  async export(): Promise<string> {
    await this.ensureLoaded();
    return JSON.stringify(this.registry, null, 2);
  }

  /**
   * Import registry from JSON
   */
  async import(json: string): Promise<void> {
    try {
      this.registry = JSON.parse(json);
      await this.save();
    } catch (error) {
      throw new PluginError('Failed to import registry', 'REGISTRY_IMPORT_ERROR');
    }
  }
}
