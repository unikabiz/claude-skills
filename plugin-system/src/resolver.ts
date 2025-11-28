import {
  PluginManifest,
  DependencyNode,
  ResolvedDependencies,
  DependencyConflict,
  DependencyError
} from './types';

/**
 * Dependency Resolver
 * Resolves plugin dependencies and determines installation order
 */
export class DependencyResolver {
  /**
   * Resolve dependencies for a set of plugins
   */
  async resolve(
    targetPlugin: PluginManifest,
    availablePlugins: Map<string, PluginManifest>
  ): Promise<ResolvedDependencies> {
    const dependencyTree = this.buildDependencyTree(targetPlugin, availablePlugins);
    const conflicts = this.findConflicts(dependencyTree, availablePlugins);

    if (conflicts.length > 0) {
      throw new DependencyError(
        `Dependency conflicts found: ${conflicts.map(c => c.plugin).join(', ')}`,
        targetPlugin.name
      );
    }

    const installOrder = this.topologicalSort(dependencyTree);

    return {
      installOrder,
      dependencyTree,
      conflicts
    };
  }

  /**
   * Build dependency tree for a plugin
   */
  private buildDependencyTree(
    plugin: PluginManifest,
    availablePlugins: Map<string, PluginManifest>,
    visited: Set<string> = new Set()
  ): DependencyNode {
    // Detect circular dependencies
    if (visited.has(plugin.name)) {
      throw new DependencyError(
        `Circular dependency detected: ${[...visited, plugin.name].join(' -> ')}`,
        plugin.name
      );
    }

    visited.add(plugin.name);

    const node: DependencyNode = {
      name: plugin.name,
      version: plugin.version,
      dependencies: []
    };

    if (plugin.dependencies) {
      for (const [depName, versionRange] of Object.entries(plugin.dependencies)) {
        const depPlugin = availablePlugins.get(depName);

        if (!depPlugin) {
          throw new DependencyError(
            `Dependency not found: ${depName} (required by ${plugin.name})`,
            plugin.name
          );
        }

        // Verify version compatibility
        if (!this.satisfiesVersion(depPlugin.version, versionRange)) {
          throw new DependencyError(
            `Version mismatch: ${depName} ${depPlugin.version} does not satisfy ${versionRange} (required by ${plugin.name})`,
            plugin.name
          );
        }

        // Recursively build dependency tree
        const depNode = this.buildDependencyTree(
          depPlugin,
          availablePlugins,
          new Set(visited)
        );
        node.dependencies.push(depNode);
      }
    }

    return node;
  }

  /**
   * Perform topological sort to determine installation order
   */
  private topologicalSort(root: DependencyNode): string[] {
    const visited = new Set<string>();
    const result: string[] = [];

    const visit = (node: DependencyNode) => {
      if (visited.has(node.name)) {
        return;
      }

      visited.add(node.name);

      // Visit dependencies first
      for (const dep of node.dependencies) {
        visit(dep);
      }

      result.push(node.name);
    };

    visit(root);
    return result;
  }

  /**
   * Find dependency conflicts
   */
  private findConflicts(
    root: DependencyNode,
    availablePlugins: Map<string, PluginManifest>
  ): DependencyConflict[] {
    const conflicts: DependencyConflict[] = [];
    const versionMap = new Map<string, Map<string, string[]>>();

    const collectVersions = (node: DependencyNode, parent: string) => {
      if (!versionMap.has(node.name)) {
        versionMap.set(node.name, new Map());
      }

      const versions = versionMap.get(node.name)!;
      if (!versions.has(node.version)) {
        versions.set(node.version, []);
      }
      versions.get(node.version)!.push(parent);

      for (const dep of node.dependencies) {
        collectVersions(dep, node.name);
      }
    };

    collectVersions(root, 'root');

    // Check for version conflicts
    for (const [pluginName, versions] of versionMap.entries()) {
      if (versions.size > 1) {
        const versionArray = Array.from(versions.keys());
        const requiredBy = Array.from(versions.values()).flat();

        conflicts.push({
          plugin: pluginName,
          requiredBy,
          versions: versionArray
        });
      }
    }

    return conflicts;
  }

  /**
   * Check if a version satisfies a version range
   * Supports: exact (1.0.0), caret (^1.0.0), tilde (~1.0.0), range (>=1.0.0 <2.0.0)
   */
  private satisfiesVersion(version: string, range: string): boolean {
    // Remove whitespace
    range = range.trim();

    // Exact version
    if (!range.includes('^') && !range.includes('~') && !range.includes('>') && !range.includes('<')) {
      return version === range;
    }

    const versionParts = this.parseVersion(version);
    if (!versionParts) return false;

    // Caret range (^1.2.3 := >=1.2.3 <2.0.0)
    if (range.startsWith('^')) {
      const minVersion = this.parseVersion(range.slice(1));
      if (!minVersion) return false;

      return (
        versionParts.major === minVersion.major &&
        (versionParts.minor > minVersion.minor ||
          (versionParts.minor === minVersion.minor &&
            versionParts.patch >= minVersion.patch))
      );
    }

    // Tilde range (~1.2.3 := >=1.2.3 <1.3.0)
    if (range.startsWith('~')) {
      const minVersion = this.parseVersion(range.slice(1));
      if (!minVersion) return false;

      return (
        versionParts.major === minVersion.major &&
        versionParts.minor === minVersion.minor &&
        versionParts.patch >= minVersion.patch
      );
    }

    // Range operators (>=, >, <=, <)
    if (range.includes('>=') || range.includes('>') || range.includes('<=') || range.includes('<')) {
      return this.satisfiesRangeOperators(version, range);
    }

    return false;
  }

  /**
   * Parse semantic version string
   */
  private parseVersion(version: string): { major: number; minor: number; patch: number } | null {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
    if (!match) return null;

    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10)
    };
  }

  /**
   * Compare two versions
   * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
   */
  private compareVersions(v1: string, v2: string): number {
    const p1 = this.parseVersion(v1);
    const p2 = this.parseVersion(v2);

    if (!p1 || !p2) return 0;

    if (p1.major !== p2.major) return p1.major - p2.major;
    if (p1.minor !== p2.minor) return p1.minor - p2.minor;
    return p1.patch - p2.patch;
  }

  /**
   * Check if version satisfies range operators
   */
  private satisfiesRangeOperators(version: string, range: string): boolean {
    // Split on space to handle ranges like ">=1.0.0 <2.0.0"
    const parts = range.split(/\s+/);

    for (const part of parts) {
      if (part.startsWith('>=')) {
        const minVersion = part.slice(2);
        if (this.compareVersions(version, minVersion) < 0) return false;
      } else if (part.startsWith('>')) {
        const minVersion = part.slice(1);
        if (this.compareVersions(version, minVersion) <= 0) return false;
      } else if (part.startsWith('<=')) {
        const maxVersion = part.slice(2);
        if (this.compareVersions(version, maxVersion) > 0) return false;
      } else if (part.startsWith('<')) {
        const maxVersion = part.slice(1);
        if (this.compareVersions(version, maxVersion) >= 0) return false;
      }
    }

    return true;
  }

  /**
   * Get all dependencies (flattened)
   */
  getAllDependencies(node: DependencyNode): string[] {
    const result: string[] = [];
    const visited = new Set<string>();

    const visit = (n: DependencyNode) => {
      if (visited.has(n.name)) return;
      visited.add(n.name);
      result.push(n.name);

      for (const dep of n.dependencies) {
        visit(dep);
      }
    };

    visit(node);
    return result.slice(1); // Exclude root
  }

  /**
   * Validate dependency graph (check for issues)
   */
  validate(node: DependencyNode): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const visited = new Set<string>();

    const visit = (n: DependencyNode, path: string[]) => {
      if (path.includes(n.name)) {
        errors.push(`Circular dependency: ${path.join(' -> ')} -> ${n.name}`);
        return;
      }

      visited.add(n.name);

      for (const dep of n.dependencies) {
        visit(dep, [...path, n.name]);
      }
    };

    visit(node, []);

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
