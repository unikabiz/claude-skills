# Claude Skills Plugin System

A comprehensive plugin system for managing, installing, and organizing collections of Claude Skills. This system provides a modular, extensible architecture for skill management with dependency resolution, versioning, lifecycle hooks, and security validation.

## Features

- 📦 **Plugin Packaging**: Bundle multiple skills into reusable plugins
- 🔄 **Dependency Management**: Automatic dependency resolution and version management
- 🔐 **Security Validation**: Built-in security checks and permission management
- 🎯 **Lifecycle Hooks**: Execute scripts during install, activate, and other lifecycle events
- 🔍 **Plugin Discovery**: Search and discover plugins from marketplaces
- 📊 **Version Control**: Semantic versioning with constraint satisfaction
- 🛠️ **CLI Tools**: Command-line interface for plugin management
- 🔌 **Extensible**: Easy to extend with custom functionality

## Quick Start

### Installation

```bash
npm install @claude-skills/plugin-system
```

### Using the CLI

```bash
# Install a plugin
plugin install /path/to/plugin

# List installed plugins
plugin list

# Activate a plugin
plugin activate plugin-name

# Show plugin information
plugin info plugin-name

# Uninstall a plugin
plugin uninstall plugin-name
```

### Using the API

```typescript
import { PluginManager } from '@claude-skills/plugin-system';

// Initialize the plugin manager
const manager = new PluginManager();
await manager.initialize();

// Install a plugin
const plugin = await manager.install('/path/to/plugin');

// List all plugins
const plugins = await manager.list();

// Activate a plugin
await manager.activate('plugin-name');

// Get plugin information
const info = await manager.get('plugin-name');
```

## Creating a Plugin

### Plugin Structure

```
my-plugin/
├── plugin.json           # Plugin manifest
├── skills/              # Skills directory
│   ├── skill-1/
│   │   └── SKILL.md
│   └── skill-2/
│       └── SKILL.md
├── scripts/             # Lifecycle scripts (optional)
│   ├── install.sh
│   └── activate.sh
└── README.md            # Plugin documentation
```

### Plugin Manifest

Create a `plugin.json` file:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "A helpful plugin that does amazing things",
  "author": {
    "name": "Your Name",
    "email": "you@example.com"
  },
  "license": "Apache-2.0",
  "category": "productivity",
  "skills": [
    {
      "path": "./skills/skill-1",
      "required": true,
      "enabled": true
    }
  ],
  "dependencies": {},
  "permissions": {
    "filesystem": ["read", "write"],
    "network": ["https"]
  },
  "hooks": {
    "onInstall": "./scripts/install.sh",
    "onActivate": "./scripts/activate.sh"
  }
}
```

### Manifest Fields

#### Required Fields

- **name**: Unique plugin identifier (lowercase, hyphens only)
- **version**: Semantic version (e.g., 1.0.0)
- **description**: Clear description of the plugin
- **skills**: Array of skill paths or objects

#### Optional Fields

- **author**: Author information (name, email, url)
- **license**: License identifier or path
- **category**: Plugin category (productivity, creative, technical, etc.)
- **dependencies**: Plugin dependencies with version constraints
- **systemRequirements**: System requirements (platforms, versions)
- **permissions**: Required permissions (filesystem, network, tools)
- **hooks**: Lifecycle scripts
- **config**: Custom configuration
- **metadata**: Additional metadata (homepage, docs, etc.)

## Skills

Each skill in a plugin must:

1. Be in its own directory
2. Contain a `SKILL.md` file with YAML frontmatter
3. Follow the [Agent Skills Spec](../agent_skills_spec.md)

Example `SKILL.md`:

```markdown
---
name: my-skill
description: This skill helps with task management
---

# My Skill

Instructions for Claude on how to use this skill...
```

## Lifecycle Hooks

Plugins can execute scripts at various lifecycle points:

- **preInstall**: Before installation starts
- **onInstall**: After files are copied
- **onActivate**: When plugin is activated
- **postActivate**: After activation completes
- **onDeactivate**: When plugin is deactivated
- **onUninstall**: Before plugin is removed
- **onUpdate**: After plugin is updated

### Hook Script Example

```bash
#!/bin/bash
# scripts/install.sh

echo "Installing ${PLUGIN_NAME} v${PLUGIN_VERSION}..."

# Create data directory
mkdir -p "$HOME/.claude-skills/${PLUGIN_NAME}/data"

# Initialize configuration
echo "{}" > "$HOME/.claude-skills/${PLUGIN_NAME}/config.json"

echo "Installation complete!"
```

## Dependencies

Plugins can depend on other plugins:

```json
{
  "dependencies": {
    "base-plugin": "^1.0.0",
    "utils-plugin": ">=2.1.0 <3.0.0"
  }
}
```

Supported version constraints:

- **Exact**: `1.0.0`
- **Caret**: `^1.0.0` (>=1.0.0 <2.0.0)
- **Tilde**: `~1.2.3` (>=1.2.3 <1.3.0)
- **Range**: `>=1.0.0 <2.0.0`

The plugin system automatically:
- Resolves dependency trees
- Detects circular dependencies
- Determines installation order
- Validates version constraints

## Permissions

Plugins must declare required permissions:

```json
{
  "permissions": {
    "filesystem": ["read", "write"],
    "network": ["https"],
    "tools": ["bash", "python"],
    "environment": ["HOME", "PATH"]
  }
}
```

Users are warned about dangerous permissions during installation.

## System Requirements

Specify system requirements:

```json
{
  "systemRequirements": {
    "minVersion": "1.0.0",
    "maxVersion": "2.0.0",
    "platforms": ["linux", "darwin"],
    "node": ">=16.0.0",
    "python": ">=3.8.0"
  }
}
```

## Plugin States

Plugins can be in one of these states:

- **active**: Plugin is enabled and skills are available
- **inactive**: Plugin is installed but disabled
- **installing**: Plugin is being installed
- **uninstalling**: Plugin is being removed
- **broken**: Plugin has errors and cannot be loaded

## CLI Commands

### Install

```bash
plugin install <path|url> [options]

Options:
  --version <version>   Install specific version
  --force              Force reinstall
  --no-activate        Don't activate after install
```

### Uninstall

```bash
plugin uninstall <name> [options]

Options:
  --force              Force uninstall even if errors occur
```

### List

```bash
plugin list [options]

Options:
  --all                Show all plugins
  --active             Show only active plugins
  --inactive           Show only inactive plugins
```

### Info

```bash
plugin info <name>

Shows detailed information about a plugin including:
- Description and metadata
- Author and license
- Skills included
- Dependencies
- Permissions
- Installation details
```

### Activate/Deactivate

```bash
plugin activate <name>
plugin deactivate <name>
```

### Validate

```bash
plugin validate <path>

Validates a plugin manifest and structure before installation
```

## API Reference

### PluginManager

Main interface for managing plugins.

#### Methods

##### `initialize(): Promise<void>`

Initialize the plugin manager and registry.

##### `install(source: string, options?: InstallOptions): Promise<Plugin>`

Install a plugin from a source path.

```typescript
const plugin = await manager.install('/path/to/plugin', {
  version: '1.0.0',
  force: false,
  activate: true
});
```

##### `uninstall(name: string, options?: UninstallOptions): Promise<void>`

Uninstall a plugin.

```typescript
await manager.uninstall('plugin-name', {
  force: false
});
```

##### `activate(name: string): Promise<void>`

Activate an installed plugin.

```typescript
await manager.activate('plugin-name');
```

##### `deactivate(name: string): Promise<void>`

Deactivate an active plugin.

```typescript
await manager.deactivate('plugin-name');
```

##### `list(filter?: PluginFilter): Promise<Plugin[]>`

List installed plugins with optional filtering.

```typescript
const activePlugins = await manager.list({ status: 'active' });
const productivityPlugins = await manager.list({ category: 'productivity' });
```

##### `get(name: string): Promise<Plugin | null>`

Get information about a specific plugin.

```typescript
const plugin = await manager.get('plugin-name');
```

##### `on(eventType: string, handler: PluginEventHandler): void`

Register event handlers for plugin lifecycle events.

```typescript
manager.on('install', (event) => {
  console.log(`Plugin installed: ${event.plugin}`);
});
```

### Events

The plugin manager emits events:

- **install**: When a plugin is installed
- **uninstall**: When a plugin is uninstalled
- **activate**: When a plugin is activated
- **deactivate**: When a plugin is deactivated
- **update**: When a plugin is updated
- **error**: When an error occurs

## Examples

See the [`examples/`](./examples/) directory for complete plugin examples:

- **productivity-pack**: Task management and note-taking skills
- **creative-tools**: Design and creative workflow skills

## Best Practices

### For Plugin Developers

1. **Use Semantic Versioning**: Follow semver for all plugin versions
2. **Minimize Dependencies**: Keep dependencies minimal and necessary
3. **Request Minimal Permissions**: Only request permissions you actually need
4. **Test Lifecycle Hooks**: Ensure all hooks work correctly and handle errors
5. **Provide Clear Documentation**: Include comprehensive README and examples
6. **Handle Errors Gracefully**: Make hooks idempotent when possible
7. **Validate Input**: Check configuration and environment before executing
8. **Clean Up Resources**: Remove data and configs in onUninstall hook

### For Plugin Users

1. **Review Permissions**: Always check requested permissions before installing
2. **Trust Sources**: Only install plugins from trusted sources
3. **Keep Updated**: Regularly update plugins for security patches
4. **Backup Data**: Backup plugin data before major updates
5. **Report Issues**: Report security concerns and bugs promptly
6. **Test First**: Test new plugins in non-production environments

## Security

The plugin system includes several security features:

- **Manifest Validation**: Validates plugin structure and metadata
- **Permission Checking**: Warns about dangerous permissions
- **Checksum Verification**: Verifies plugin integrity (optional)
- **Sandboxed Execution**: Hooks run with limited permissions
- **Code Scanning**: Basic security checks (extensible)

### Security Guidelines

- Never install plugins from untrusted sources
- Review hook scripts before installation
- Be cautious with plugins requesting write/delete permissions
- Report security vulnerabilities responsibly

## Troubleshooting

### Plugin Won't Install

- Check manifest validation: `plugin validate /path/to/plugin`
- Verify all required fields are present
- Ensure skill paths are correct
- Check for dependency conflicts

### Hook Fails

- Review hook script permissions (must be executable)
- Check hook output in logs
- Verify required environment variables
- Test hook scripts manually

### Plugin Shows as Broken

- Check plugin directory structure
- Verify manifest file is valid JSON
- Ensure all skill SKILL.md files exist
- Review plugin logs for errors

## Architecture

The plugin system consists of:

- **PluginManager**: Main coordinator
- **Registry**: Persistent plugin storage
- **Validator**: Manifest and security validation
- **DependencyResolver**: Dependency graph resolution
- **PluginLoader**: Plugin loading and hook execution

See [PLUGIN_SYSTEM.md](../PLUGIN_SYSTEM.md) for detailed architecture documentation.

## Contributing

Contributions are welcome! Please:

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Submit pull requests with clear descriptions

## License

Apache-2.0

## Support

- **Documentation**: See docs in this repository
- **Issues**: Report at https://github.com/anthropics/skills/issues
- **Discussions**: Join community discussions

## Roadmap

Future enhancements:

- Remote marketplace integration
- Plugin signing and verification
- Auto-update functionality
- Plugin sandboxing
- Inter-plugin communication API
- Hot reloading
- Telemetry and analytics (opt-in)
- Plugin scaffolding tools
