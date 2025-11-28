#!/usr/bin/env node

/**
 * Claude Skills Plugin CLI
 * Command-line interface for managing plugins
 */

import { PluginManager } from '../src/manager';
import * as path from 'path';

interface Command {
  name: string;
  description: string;
  usage: string;
  handler: (args: string[], options: Record<string, any>) => Promise<void>;
}

class PluginCLI {
  private manager: PluginManager;
  private commands: Map<string, Command>;

  constructor() {
    this.manager = new PluginManager({
      pluginDir: path.join(process.cwd(), '.claude-plugin')
    });
    this.commands = new Map();
    this.registerCommands();
  }

  private registerCommands(): void {
    this.commands.set('install', {
      name: 'install',
      description: 'Install a plugin',
      usage: 'plugin install <path|url> [--version <version>] [--force] [--no-activate]',
      handler: this.install.bind(this)
    });

    this.commands.set('uninstall', {
      name: 'uninstall',
      description: 'Uninstall a plugin',
      usage: 'plugin uninstall <name> [--force]',
      handler: this.uninstall.bind(this)
    });

    this.commands.set('list', {
      name: 'list',
      description: 'List installed plugins',
      usage: 'plugin list [--all] [--active] [--inactive]',
      handler: this.list.bind(this)
    });

    this.commands.set('info', {
      name: 'info',
      description: 'Show plugin information',
      usage: 'plugin info <name>',
      handler: this.info.bind(this)
    });

    this.commands.set('activate', {
      name: 'activate',
      description: 'Activate a plugin',
      usage: 'plugin activate <name>',
      handler: this.activate.bind(this)
    });

    this.commands.set('deactivate', {
      name: 'deactivate',
      description: 'Deactivate a plugin',
      usage: 'plugin deactivate <name>',
      handler: this.deactivate.bind(this)
    });

    this.commands.set('validate', {
      name: 'validate',
      description: 'Validate a plugin',
      usage: 'plugin validate <path>',
      handler: this.validate.bind(this)
    });

    this.commands.set('help', {
      name: 'help',
      description: 'Show help information',
      usage: 'plugin help [command]',
      handler: this.help.bind(this)
    });
  }

  async run(args: string[]): Promise<void> {
    try {
      await this.manager.initialize();

      if (args.length === 0) {
        this.help([], {});
        return;
      }

      const commandName = args[0];
      const command = this.commands.get(commandName);

      if (!command) {
        console.error(`Unknown command: ${commandName}`);
        console.error('Run "plugin help" for usage information');
        process.exit(1);
      }

      const { args: parsedArgs, options } = this.parseArgs(args.slice(1));
      await command.handler(parsedArgs, options);
    } catch (error: any) {
      console.error('Error:', error.message);
      if (process.env.DEBUG) {
        console.error(error);
      }
      process.exit(1);
    }
  }

  private parseArgs(args: string[]): {
    args: string[];
    options: Record<string, any>;
  } {
    const result: string[] = [];
    const options: Record<string, any> = {};

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg.startsWith('--')) {
        const key = arg.slice(2);
        const nextArg = args[i + 1];

        if (nextArg && !nextArg.startsWith('--')) {
          options[key] = nextArg;
          i++;
        } else {
          options[key] = true;
        }
      } else {
        result.push(arg);
      }
    }

    return { args: result, options };
  }

  private async install(args: string[], options: Record<string, any>): Promise<void> {
    if (args.length === 0) {
      console.error('Error: Plugin source required');
      console.error('Usage: plugin install <path|url>');
      process.exit(1);
    }

    const source = args[0];
    console.log(`Installing plugin from ${source}...`);

    const plugin = await this.manager.install(source, {
      version: options.version,
      force: options.force,
      activate: !options['no-activate']
    });

    console.log(`✓ Successfully installed ${plugin.name}@${plugin.version}`);
    console.log(`  Status: ${plugin.status}`);
    console.log(`  Skills: ${plugin.manifest.skills.length}`);
  }

  private async uninstall(args: string[], options: Record<string, any>): Promise<void> {
    if (args.length === 0) {
      console.error('Error: Plugin name required');
      console.error('Usage: plugin uninstall <name>');
      process.exit(1);
    }

    const name = args[0];
    console.log(`Uninstalling plugin ${name}...`);

    await this.manager.uninstall(name, {
      force: options.force
    });

    console.log(`✓ Successfully uninstalled ${name}`);
  }

  private async list(args: string[], options: Record<string, any>): Promise<void> {
    const filter: any = {};

    if (options.active) {
      filter.status = 'active';
    } else if (options.inactive) {
      filter.status = 'inactive';
    }

    const plugins = await this.manager.list(filter);

    if (plugins.length === 0) {
      console.log('No plugins installed');
      return;
    }

    console.log(`\nInstalled plugins (${plugins.length}):\n`);

    for (const plugin of plugins) {
      const statusSymbol = plugin.status === 'active' ? '●' : '○';
      const statusColor = plugin.status === 'active' ? '\x1b[32m' : '\x1b[90m';
      console.log(`${statusColor}${statusSymbol}\x1b[0m ${plugin.name}@${plugin.version}`);
      console.log(`  ${plugin.manifest.description}`);
      console.log(`  Skills: ${plugin.manifest.skills.length} | Category: ${plugin.manifest.category || 'other'}`);
      console.log();
    }
  }

  private async info(args: string[], options: Record<string, any>): Promise<void> {
    if (args.length === 0) {
      console.error('Error: Plugin name required');
      console.error('Usage: plugin info <name>');
      process.exit(1);
    }

    const name = args[0];
    const plugin = await this.manager.get(name);

    if (!plugin) {
      console.error(`Plugin not found: ${name}`);
      process.exit(1);
    }

    console.log(`\n${plugin.name}@${plugin.version}`);
    console.log('─'.repeat(50));
    console.log(`\nDescription: ${plugin.manifest.description}`);
    console.log(`Status: ${plugin.status}`);
    console.log(`Category: ${plugin.manifest.category || 'other'}`);

    if (plugin.manifest.author) {
      console.log(`\nAuthor: ${plugin.manifest.author.name}`);
      if (plugin.manifest.author.email) {
        console.log(`  Email: ${plugin.manifest.author.email}`);
      }
    }

    if (plugin.manifest.license) {
      console.log(`\nLicense: ${plugin.manifest.license}`);
    }

    console.log(`\nSkills (${plugin.manifest.skills.length}):`);
    for (const skill of plugin.manifest.skills) {
      const skillPath = typeof skill === 'string' ? skill : skill.path;
      console.log(`  • ${skillPath}`);
    }

    if (plugin.manifest.dependencies) {
      const deps = Object.entries(plugin.manifest.dependencies);
      if (deps.length > 0) {
        console.log(`\nDependencies (${deps.length}):`);
        for (const [dep, version] of deps) {
          console.log(`  • ${dep}@${version}`);
        }
      }
    }

    if (plugin.manifest.permissions) {
      console.log('\nPermissions:');
      if (plugin.manifest.permissions.filesystem) {
        console.log(`  Filesystem: ${plugin.manifest.permissions.filesystem.join(', ')}`);
      }
      if (plugin.manifest.permissions.network) {
        console.log(`  Network: ${plugin.manifest.permissions.network.join(', ')}`);
      }
      if (plugin.manifest.permissions.tools) {
        console.log(`  Tools: ${plugin.manifest.permissions.tools.join(', ')}`);
      }
    }

    console.log(`\nInstalled: ${plugin.installedAt.toLocaleString()}`);
    console.log(`Updated: ${plugin.updatedAt.toLocaleString()}`);
    console.log(`Source: ${plugin.source}`);
    console.log();
  }

  private async activate(args: string[], options: Record<string, any>): Promise<void> {
    if (args.length === 0) {
      console.error('Error: Plugin name required');
      console.error('Usage: plugin activate <name>');
      process.exit(1);
    }

    const name = args[0];
    console.log(`Activating plugin ${name}...`);

    await this.manager.activate(name);

    console.log(`✓ Successfully activated ${name}`);
  }

  private async deactivate(args: string[], options: Record<string, any>): Promise<void> {
    if (args.length === 0) {
      console.error('Error: Plugin name required');
      console.error('Usage: plugin deactivate <name>');
      process.exit(1);
    }

    const name = args[0];
    console.log(`Deactivating plugin ${name}...`);

    await this.manager.deactivate(name);

    console.log(`✓ Successfully deactivated ${name}`);
  }

  private async validate(args: string[], options: Record<string, any>): Promise<void> {
    if (args.length === 0) {
      console.error('Error: Plugin path required');
      console.error('Usage: plugin validate <path>');
      process.exit(1);
    }

    const pluginPath = args[0];
    console.log(`Validating plugin at ${pluginPath}...`);

    const { Validator } = await import('../src/validator');
    const { PluginLoader } = await import('../src/loader');

    const validator = new Validator();
    const loader = new PluginLoader('');

    const manifest = await loader.loadManifest(pluginPath);
    const result = await validator.validate(manifest, pluginPath);

    if (result.valid) {
      console.log('✓ Plugin is valid');
    } else {
      console.log('✗ Plugin validation failed');
      console.log('\nErrors:');
      for (const error of result.errors) {
        console.log(`  • ${error.message} (${error.path})`);
      }
    }

    if (result.warnings.length > 0) {
      console.log('\nWarnings:');
      for (const warning of result.warnings) {
        console.log(`  • ${warning.message} (${warning.path})`);
      }
    }

    if (!result.valid) {
      process.exit(1);
    }
  }

  private async help(args: string[], options: Record<string, any>): Promise<void> {
    if (args.length > 0) {
      const commandName = args[0];
      const command = this.commands.get(commandName);

      if (!command) {
        console.error(`Unknown command: ${commandName}`);
        process.exit(1);
      }

      console.log(`\n${command.name} - ${command.description}`);
      console.log(`\nUsage: ${command.usage}\n`);
      return;
    }

    console.log('\nClaude Skills Plugin Manager\n');
    console.log('Usage: plugin <command> [options]\n');
    console.log('Commands:\n');

    for (const command of this.commands.values()) {
      console.log(`  ${command.name.padEnd(15)} ${command.description}`);
    }

    console.log('\nRun "plugin help <command>" for more information on a command.\n');
  }
}

// Main entry point
if (require.main === module) {
  const cli = new PluginCLI();
  cli.run(process.argv.slice(2));
}

export { PluginCLI };
