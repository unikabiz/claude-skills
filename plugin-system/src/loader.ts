import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import {
  Plugin,
  PluginManifest,
  HookResult,
  SkillInfo,
  PluginError
} from './types';

const execAsync = promisify(exec);

/**
 * Plugin Loader
 * Handles loading plugins, executing hooks, and managing skills
 */
export class PluginLoader {
  private pluginDir: string;

  constructor(pluginDir: string) {
    this.pluginDir = pluginDir;
  }

  /**
   * Load plugin manifest from directory
   */
  async loadManifest(pluginPath: string): Promise<PluginManifest> {
    const manifestPath = path.join(pluginPath, 'plugin.json');

    try {
      const content = await fs.readFile(manifestPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new PluginError(
        `Failed to load plugin manifest: ${manifestPath}`,
        'MANIFEST_LOAD_ERROR'
      );
    }
  }

  /**
   * Execute a lifecycle hook
   */
  async executeHook(
    plugin: Plugin,
    hookName: string,
    env?: Record<string, string>
  ): Promise<HookResult> {
    const hooks = plugin.manifest.hooks;
    if (!hooks || !hooks[hookName as keyof typeof hooks]) {
      return { success: true }; // No hook defined
    }

    const scriptPath = hooks[hookName as keyof typeof hooks];
    if (!scriptPath) {
      return { success: true };
    }

    const pluginPath = this.getPluginPath(plugin.name, plugin.version);
    const fullScriptPath = path.resolve(pluginPath, scriptPath);

    try {
      // Check if script exists
      await fs.access(fullScriptPath);

      // Make script executable (Unix-like systems)
      if (process.platform !== 'win32') {
        try {
          await execAsync(`chmod +x "${fullScriptPath}"`);
        } catch {
          // Ignore chmod errors
        }
      }

      // Execute script with timeout
      const { stdout, stderr } = await execAsync(fullScriptPath, {
        cwd: pluginPath,
        timeout: 60000, // 60 second timeout
        env: {
          ...process.env,
          PLUGIN_NAME: plugin.name,
          PLUGIN_VERSION: plugin.version,
          PLUGIN_PATH: pluginPath,
          ...env
        }
      });

      return {
        success: true,
        output: stdout,
        error: stderr || undefined,
        exitCode: 0
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.stdout || '',
        error: error.stderr || error.message,
        exitCode: error.code || 1
      };
    }
  }

  /**
   * Load all skills from a plugin
   */
  async loadSkills(plugin: Plugin): Promise<SkillInfo[]> {
    const skills: SkillInfo[] = [];
    const pluginPath = this.getPluginPath(plugin.name, plugin.version);

    for (const skillDef of plugin.manifest.skills) {
      const skillPath =
        typeof skillDef === 'string' ? skillDef : skillDef.path;
      const enabled =
        typeof skillDef === 'string' ? true : (skillDef.enabled ?? true);

      const fullSkillPath = path.resolve(pluginPath, skillPath);
      const skillMdPath = path.join(fullSkillPath, 'SKILL.md');

      try {
        // Read SKILL.md to extract name and description
        const content = await fs.readFile(skillMdPath, 'utf-8');
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

        if (!frontmatterMatch) {
          throw new Error('No frontmatter found in SKILL.md');
        }

        // Parse YAML frontmatter (simple parsing)
        const frontmatter = this.parseYamlFrontmatter(frontmatterMatch[1]);

        skills.push({
          name: frontmatter.name || path.basename(skillPath),
          description: frontmatter.description || 'No description',
          path: fullSkillPath,
          enabled,
          plugin: plugin.name
        });
      } catch (error) {
        throw new PluginError(
          `Failed to load skill from ${skillPath}: ${error}`,
          'SKILL_LOAD_ERROR',
          plugin.name
        );
      }
    }

    return skills;
  }

  /**
   * Get plugin installation path
   */
  getPluginPath(name: string, version: string): string {
    return path.join(this.pluginDir, `${name}@${version}`);
  }

  /**
   * Check if plugin is installed
   */
  async isInstalled(name: string, version: string): Promise<boolean> {
    const pluginPath = this.getPluginPath(name, version);
    try {
      await fs.access(pluginPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Copy plugin to installation directory
   */
  async installPlugin(sourcePath: string, name: string, version: string): Promise<string> {
    const targetPath = this.getPluginPath(name, version);

    try {
      // Create plugin directory
      await fs.mkdir(targetPath, { recursive: true });

      // Copy all files
      await this.copyDirectory(sourcePath, targetPath);

      return targetPath;
    } catch (error) {
      throw new PluginError(
        `Failed to install plugin: ${error}`,
        'INSTALL_ERROR',
        name
      );
    }
  }

  /**
   * Remove plugin from installation directory
   */
  async uninstallPlugin(name: string, version: string): Promise<void> {
    const pluginPath = this.getPluginPath(name, version);

    try {
      await fs.rm(pluginPath, { recursive: true, force: true });
    } catch (error) {
      throw new PluginError(
        `Failed to uninstall plugin: ${error}`,
        'UNINSTALL_ERROR',
        name
      );
    }
  }

  /**
   * Copy directory recursively
   */
  private async copyDirectory(src: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true });

    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules and .git
        if (entry.name === 'node_modules' || entry.name === '.git') {
          continue;
        }
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  /**
   * Simple YAML frontmatter parser
   */
  private parseYamlFrontmatter(yaml: string): Record<string, string> {
    const result: Record<string, string> = {};
    const lines = yaml.split('\n');

    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        result[match[1]] = match[2].trim();
      }
    }

    return result;
  }

  /**
   * Validate plugin directory structure
   */
  async validateStructure(pluginPath: string): Promise<boolean> {
    try {
      // Check for plugin.json
      await fs.access(path.join(pluginPath, 'plugin.json'));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get plugin size (in bytes)
   */
  async getPluginSize(name: string, version: string): Promise<number> {
    const pluginPath = this.getPluginPath(name, version);
    return await this.getDirectorySize(pluginPath);
  }

  /**
   * Get directory size recursively
   */
  private async getDirectorySize(dirPath: string): Promise<number> {
    let size = 0;

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules' && entry.name !== '.git') {
            size += await this.getDirectorySize(fullPath);
          }
        } else {
          const stats = await fs.stat(fullPath);
          size += stats.size;
        }
      }
    } catch {
      // Ignore errors
    }

    return size;
  }
}
