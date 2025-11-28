/**
 * Type definitions for the Claude Skills Plugin System
 */

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author?: {
    name: string;
    email?: string;
    url?: string;
  };
  license?: string;
  repository?: {
    type: 'git' | 'svn' | 'mercurial';
    url: string;
  };
  keywords?: string[];
  category?: PluginCategory;
  skills: SkillDefinition[];
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  systemRequirements?: SystemRequirements;
  permissions?: Permissions;
  hooks?: LifecycleHooks;
  config?: Record<string, unknown>;
  metadata?: PluginMetadata;
}

export type PluginCategory =
  | 'productivity'
  | 'creative'
  | 'technical'
  | 'communication'
  | 'development'
  | 'data-analysis'
  | 'design'
  | 'documentation'
  | 'enterprise'
  | 'education'
  | 'other';

export type SkillDefinition =
  | string
  | {
      path: string;
      required?: boolean;
      enabled?: boolean;
    };

export interface SystemRequirements {
  minVersion?: string;
  maxVersion?: string;
  platforms?: Platform[];
  node?: string;
  python?: string;
}

export type Platform = 'linux' | 'darwin' | 'win32' | 'android' | 'ios';

export interface Permissions {
  filesystem?: ('read' | 'write' | 'delete')[];
  network?: ('http' | 'https' | 'websocket')[];
  tools?: string[];
  environment?: string[];
}

export interface LifecycleHooks {
  onInstall?: string;
  onActivate?: string;
  onDeactivate?: string;
  onUninstall?: string;
  onUpdate?: string;
  preInstall?: string;
  postActivate?: string;
}

export interface PluginMetadata {
  homepage?: string;
  documentation?: string;
  issues?: string;
  changelog?: string;
  tags?: string[];
  screenshots?: string[];
  icon?: string;
  [key: string]: unknown;
}

export interface Plugin {
  name: string;
  version: string;
  manifest: PluginManifest;
  status: PluginStatus;
  installedAt: Date;
  updatedAt: Date;
  source: string;
  checksum?: string;
  resolvedDependencies: Record<string, string>;
}

export type PluginStatus = 'active' | 'inactive' | 'broken' | 'installing' | 'uninstalling';

export interface PluginRegistry {
  version: string;
  plugins: RegistryEntry[];
  marketplaces: Marketplace[];
}

export interface RegistryEntry {
  name: string;
  version: string;
  status: PluginStatus;
  installedAt: string;
  updatedAt: string;
  source: string;
  checksum?: string;
  dependencies: Record<string, string>;
}

export interface Marketplace {
  name: string;
  url: string;
  addedAt: string;
}

export interface InstallOptions {
  version?: string;
  force?: boolean;
  skipDependencies?: boolean;
  activate?: boolean;
}

export interface UninstallOptions {
  force?: boolean;
  keepData?: boolean;
}

export interface PluginFilter {
  status?: PluginStatus | PluginStatus[];
  category?: PluginCategory;
  keyword?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationWarning[];
}

export interface ValidationIssue {
  code: string;
  message: string;
  path?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  path?: string;
}

export interface DependencyNode {
  name: string;
  version: string;
  dependencies: DependencyNode[];
}

export interface ResolvedDependencies {
  installOrder: string[];
  dependencyTree: DependencyNode;
  conflicts: DependencyConflict[];
}

export interface DependencyConflict {
  plugin: string;
  requiredBy: string[];
  versions: string[];
}

export interface PluginManagerConfig {
  pluginDir: string;
  registryPath: string;
  cacheDir: string;
  logsDir: string;
  validateChecksum: boolean;
  autoUpdate: boolean;
}

export interface PluginSearchResult {
  name: string;
  version: string;
  description: string;
  author?: string;
  category?: PluginCategory;
  downloads?: number;
  rating?: number;
  source: string;
}

export interface HookResult {
  success: boolean;
  output?: string;
  error?: string;
  exitCode?: number;
}

export interface SkillInfo {
  name: string;
  description: string;
  path: string;
  enabled: boolean;
  plugin: string;
}

// Error types
export class PluginError extends Error {
  constructor(
    message: string,
    public code: string,
    public plugin?: string
  ) {
    super(message);
    this.name = 'PluginError';
  }
}

export class DependencyError extends PluginError {
  constructor(message: string, plugin?: string) {
    super(message, 'DEPENDENCY_ERROR', plugin);
    this.name = 'DependencyError';
  }
}

export class ValidationError extends PluginError {
  constructor(message: string, plugin?: string) {
    super(message, 'VALIDATION_ERROR', plugin);
    this.name = 'ValidationError';
  }
}

export class InstallError extends PluginError {
  constructor(message: string, plugin?: string) {
    super(message, 'INSTALL_ERROR', plugin);
    this.name = 'InstallError';
  }
}

// Events
export interface PluginEvent {
  type: PluginEventType;
  plugin: string;
  timestamp: Date;
  data?: unknown;
}

export type PluginEventType =
  | 'install'
  | 'uninstall'
  | 'activate'
  | 'deactivate'
  | 'update'
  | 'error';

export interface PluginEventHandler {
  (event: PluginEvent): void | Promise<void>;
}
