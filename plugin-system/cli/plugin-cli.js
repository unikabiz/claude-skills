#!/usr/bin/env node

/**
 * Claude Skills Plugin CLI - JavaScript Entry Point
 * This wrapper loads and runs the TypeScript CLI
 */

const path = require('path');
const { PluginManager } = require('../dist/manager');

async function main() {
  const manager = new PluginManager({
    pluginDir: path.join(process.cwd(), '.claude-plugin')
  });

  try {
    await manager.initialize();

    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === 'help') {
      showHelp(args[1]);
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);
    const options = parseOptions(commandArgs);

    switch (command) {
      case 'list':
        await listCommand(manager, options);
        break;
      case 'install':
        await installCommand(manager, commandArgs, options);
        break;
      case 'uninstall':
        await uninstallCommand(manager, commandArgs, options);
        break;
      case 'info':
        await infoCommand(manager, commandArgs);
        break;
      case 'activate':
        await activateCommand(manager, commandArgs);
        break;
      case 'deactivate':
        await deactivateCommand(manager, commandArgs);
        break;
      case 'validate':
        await validateCommand(commandArgs);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        console.error('Run "plugin help" for usage information');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (process.env.DEBUG) {
      console.error(error);
    }
    process.exit(1);
  }
}

function parseOptions(args) {
  const options = {};
  const positional = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const next = args[i + 1];

      if (next && !next.startsWith('--')) {
        options[key] = next;
        i++;
      } else {
        options[key] = true;
      }
    } else {
      positional.push(args[i]);
    }
  }

  return { options, positional };
}

async function listCommand(manager, { options }) {
  const filter = {};

  if (options.active) {
    filter.status = 'active';
  } else if (options.inactive) {
    filter.status = 'inactive';
  }

  const plugins = await manager.list(filter);

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

async function installCommand(manager, args, { options, positional }) {
  if (positional.length === 0) {
    console.error('Error: Plugin source required');
    console.error('Usage: plugin install <path|url>');
    process.exit(1);
  }

  const source = positional[0];
  console.log(`Installing plugin from ${source}...`);

  const plugin = await manager.install(source, {
    version: options.version,
    force: options.force,
    activate: !options['no-activate']
  });

  console.log(`✓ Successfully installed ${plugin.name}@${plugin.version}`);
  console.log(`  Status: ${plugin.status}`);
  console.log(`  Skills: ${plugin.manifest.skills.length}`);
}

async function uninstallCommand(manager, args, { options, positional }) {
  if (positional.length === 0) {
    console.error('Error: Plugin name required');
    console.error('Usage: plugin uninstall <name>');
    process.exit(1);
  }

  const name = positional[0];
  console.log(`Uninstalling plugin ${name}...`);

  await manager.uninstall(name, {
    force: options.force
  });

  console.log(`✓ Successfully uninstalled ${name}`);
}

async function infoCommand(manager, args) {
  const { positional } = parseOptions(args);

  if (positional.length === 0) {
    console.error('Error: Plugin name required');
    console.error('Usage: plugin info <name>');
    process.exit(1);
  }

  const name = positional[0];
  const plugin = await manager.get(name);

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

  console.log(`\nInstalled: ${plugin.installedAt.toLocaleString()}`);
  console.log(`Updated: ${plugin.updatedAt.toLocaleString()}`);
  console.log(`Source: ${plugin.source}`);
  console.log();
}

async function activateCommand(manager, args) {
  const { positional } = parseOptions(args);

  if (positional.length === 0) {
    console.error('Error: Plugin name required');
    console.error('Usage: plugin activate <name>');
    process.exit(1);
  }

  const name = positional[0];
  console.log(`Activating plugin ${name}...`);

  await manager.activate(name);

  console.log(`✓ Successfully activated ${name}`);
}

async function deactivateCommand(manager, args) {
  const { positional } = parseOptions(args);

  if (positional.length === 0) {
    console.error('Error: Plugin name required');
    console.error('Usage: plugin deactivate <name>');
    process.exit(1);
  }

  const name = positional[0];
  console.log(`Deactivating plugin ${name}...`);

  await manager.deactivate(name);

  console.log(`✓ Successfully deactivated ${name}`);
}

async function validateCommand(args) {
  const { positional } = parseOptions(args);

  if (positional.length === 0) {
    console.error('Error: Plugin path required');
    console.error('Usage: plugin validate <path>');
    process.exit(1);
  }

  const pluginPath = positional[0];
  console.log(`Validating plugin at ${pluginPath}...`);

  const { Validator } = require('../dist/validator');
  const { PluginLoader } = require('../dist/loader');

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

function showHelp(command) {
  if (command) {
    showCommandHelp(command);
    return;
  }

  console.log('\nClaude Skills Plugin Manager\n');
  console.log('Usage: plugin <command> [options]\n');
  console.log('Commands:\n');
  console.log('  install         Install a plugin');
  console.log('  uninstall       Uninstall a plugin');
  console.log('  list            List installed plugins');
  console.log('  info            Show plugin information');
  console.log('  activate        Activate a plugin');
  console.log('  deactivate      Deactivate a plugin');
  console.log('  validate        Validate a plugin');
  console.log('  help            Show help information');
  console.log('\nRun "plugin help <command>" for more information on a command.\n');
}

function showCommandHelp(command) {
  const helps = {
    install: {
      description: 'Install a plugin',
      usage: 'plugin install <path|url> [--version <version>] [--force] [--no-activate]'
    },
    uninstall: {
      description: 'Uninstall a plugin',
      usage: 'plugin uninstall <name> [--force]'
    },
    list: {
      description: 'List installed plugins',
      usage: 'plugin list [--all] [--active] [--inactive]'
    },
    info: {
      description: 'Show plugin information',
      usage: 'plugin info <name>'
    },
    activate: {
      description: 'Activate a plugin',
      usage: 'plugin activate <name>'
    },
    deactivate: {
      description: 'Deactivate a plugin',
      usage: 'plugin deactivate <name>'
    },
    validate: {
      description: 'Validate a plugin',
      usage: 'plugin validate <path>'
    }
  };

  const help = helps[command];
  if (!help) {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
  }

  console.log(`\n${command} - ${help.description}`);
  console.log(`\nUsage: ${help.usage}\n`);
}

// Run CLI
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
