# Plugin System Quick Start

The Claude Skills repository now includes a comprehensive plugin system for managing, packaging, and distributing collections of skills.

## What's New?

The plugin system provides:

- 📦 **Plugin Packaging**: Bundle multiple related skills together
- 🔄 **Dependency Management**: Automatic dependency resolution
- 🔐 **Security Validation**: Permission checks and validation
- 🎯 **Lifecycle Hooks**: Setup and cleanup automation
- 🛠️ **CLI Tools**: Easy plugin management
- 📊 **Versioning**: Semantic versioning support

## Quick Start

### Installation

The plugin system is located in the `plugin-system/` directory:

```bash
cd plugin-system
npm install
npm run build
```

### Using the CLI

```bash
# Add CLI to your PATH or use directly
./cli/plugin-cli.js list

# Or install globally
npm install -g .
plugin list
```

### Example: Install a Plugin

```bash
# Install the example productivity pack
plugin install ./examples/productivity-pack

# List installed plugins
plugin list

# Get plugin information
plugin info productivity-pack

# Use the skills in Claude
# Just mention them: "Use the task manager skill to create a task"
```

## For Plugin Developers

### Create Your First Plugin

1. **Create directory structure**
   ```bash
   mkdir my-plugin
   cd my-plugin
   mkdir skills
   ```

2. **Create plugin.json**
   ```json
   {
     "name": "my-plugin",
     "version": "1.0.0",
     "description": "My first plugin",
     "skills": ["./skills/my-skill"]
   }
   ```

3. **Add a skill**
   ```bash
   mkdir skills/my-skill
   # Create skills/my-skill/SKILL.md with frontmatter and instructions
   ```

4. **Validate and install**
   ```bash
   plugin validate .
   plugin install .
   ```

## Documentation

Comprehensive documentation is available:

- **[Plugin System Architecture](./PLUGIN_SYSTEM.md)** - System design and architecture
- **[README](./plugin-system/README.md)** - Complete user guide with API reference
- **[Developer Guide](./plugin-system/DEVELOPER_GUIDE.md)** - Step-by-step plugin creation
- **[Migration Guide](./plugin-system/MIGRATION_GUIDE.md)** - Migrate existing skills
- **[Schema](./plugin-system/schemas/plugin-manifest.schema.json)** - Manifest JSON schema

## Examples

Two complete example plugins are included:

- **productivity-pack**: Task management and note-taking skills
  - Location: `plugin-system/examples/productivity-pack/`
  - Demonstrates: Lifecycle hooks, multiple skills, configuration

- **creative-tools**: (coming soon) Design and creative workflow skills

## Key Features

### 1. Dependency Management

Plugins can depend on other plugins:

```json
{
  "dependencies": {
    "base-utilities": "^1.0.0"
  }
}
```

The system automatically:
- Resolves dependencies
- Validates versions
- Determines installation order
- Detects circular dependencies

### 2. Lifecycle Hooks

Execute scripts at key points:

```json
{
  "hooks": {
    "onInstall": "./scripts/install.sh",
    "onActivate": "./scripts/activate.sh",
    "onUninstall": "./scripts/uninstall.sh"
  }
}
```

### 3. Permission System

Declare required permissions:

```json
{
  "permissions": {
    "filesystem": ["read", "write"],
    "network": ["https"],
    "tools": ["python", "node"]
  }
}
```

Users are warned about dangerous permissions.

### 4. Validation

Automatic validation of:
- Manifest structure and required fields
- Skill paths and SKILL.md files
- Version formats
- Permission declarations
- System requirements

### 5. Version Management

Full semantic versioning support:
- Version constraints (^, ~, >=, etc.)
- Automatic version resolution
- Update management

## Architecture

The plugin system consists of:

```
plugin-system/
├── src/
│   ├── manager.ts      # Main plugin manager
│   ├── registry.ts     # Plugin registry
│   ├── validator.ts    # Validation logic
│   ├── resolver.ts     # Dependency resolver
│   ├── loader.ts       # Plugin loader
│   └── types.ts        # TypeScript types
├── cli/
│   └── plugin-cli.ts   # Command-line interface
├── schemas/
│   └── plugin-manifest.schema.json
├── examples/
│   └── productivity-pack/
└── docs/
```

## CLI Commands

```bash
# Install plugin
plugin install <path|url> [--version <ver>] [--force]

# Uninstall plugin
plugin uninstall <name> [--force]

# List plugins
plugin list [--all|--active|--inactive]

# Show plugin info
plugin info <name>

# Activate/deactivate
plugin activate <name>
plugin deactivate <name>

# Validate before installing
plugin validate <path>

# Help
plugin help [command]
```

## API Usage

```typescript
import { PluginManager } from '@claude-skills/plugin-system';

// Initialize
const manager = new PluginManager();
await manager.initialize();

// Install
const plugin = await manager.install('/path/to/plugin');

// List
const plugins = await manager.list({ status: 'active' });

// Get info
const info = await manager.get('plugin-name');

// Activate
await manager.activate('plugin-name');

// Events
manager.on('install', (event) => {
  console.log(`Plugin installed: ${event.plugin}`);
});
```

## Migration Path

Existing skills can be easily migrated:

1. **Standalone skill** → Wrap in plugin
2. **Multiple skills** → Bundle in plugin
3. **Marketplace format** → Convert to plugins

See the [Migration Guide](./plugin-system/MIGRATION_GUIDE.md) for detailed steps.

## Development Status

**Current Status**: ✅ Complete and ready to use

**Features Implemented**:
- ✅ Plugin manifest schema
- ✅ Plugin manager core
- ✅ Registry system
- ✅ Dependency resolver
- ✅ Validator
- ✅ Plugin loader
- ✅ Lifecycle hooks
- ✅ CLI interface
- ✅ Comprehensive documentation
- ✅ Example plugins

**Future Enhancements**:
- 🔄 Remote marketplace integration
- 🔄 Plugin signing/verification
- 🔄 Auto-update functionality
- 🔄 Plugin sandboxing
- 🔄 Hot reloading

## Contributing

We welcome contributions! Areas where you can help:

1. **Create plugins** - Build and share useful skill collections
2. **Improve documentation** - Clarify or expand docs
3. **Add features** - Implement roadmap items
4. **Report issues** - Help us improve
5. **Write tests** - Increase test coverage

## License

Apache-2.0

## Getting Started

1. **Read the [README](./plugin-system/README.md)** for comprehensive overview
2. **Follow the [Developer Guide](./plugin-system/DEVELOPER_GUIDE.md)** to create your first plugin
3. **Check the [examples](./plugin-system/examples/)** for reference implementations
4. **Review the [Migration Guide](./plugin-system/MIGRATION_GUIDE.md)** if you have existing skills

## Support

- **Documentation**: Complete docs in `plugin-system/` directory
- **Examples**: Reference implementations in `plugin-system/examples/`
- **Issues**: Report at https://github.com/anthropics/skills/issues
- **Discussions**: Join community discussions

---

**Ready to get started?** Check out the full documentation in the `plugin-system/` directory!
