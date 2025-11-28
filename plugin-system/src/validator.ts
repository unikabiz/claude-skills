import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  PluginManifest,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  SystemRequirements
} from './types';

/**
 * Plugin Validator
 * Validates plugin manifests and performs security checks
 */
export class Validator {
  private readonly REQUIRED_FIELDS = ['name', 'version', 'description', 'skills'];
  private readonly NAME_PATTERN = /^[a-z0-9-]+$/;
  private readonly SEMVER_PATTERN =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

  /**
   * Validate a plugin manifest
   */
  async validate(manifest: unknown, pluginPath: string): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Type check
    if (typeof manifest !== 'object' || manifest === null) {
      errors.push({
        code: 'INVALID_TYPE',
        message: 'Manifest must be a JSON object',
        path: '$'
      });
      return { valid: false, errors, warnings };
    }

    const m = manifest as Partial<PluginManifest>;

    // Validate required fields
    for (const field of this.REQUIRED_FIELDS) {
      if (!(field in m)) {
        errors.push({
          code: 'MISSING_REQUIRED_FIELD',
          message: `Missing required field: ${field}`,
          path: `$.${field}`
        });
      }
    }

    // Validate name
    if (m.name) {
      if (!this.NAME_PATTERN.test(m.name)) {
        errors.push({
          code: 'INVALID_NAME',
          message: 'Plugin name must be lowercase alphanumeric with hyphens only',
          path: '$.name'
        });
      }
      if (m.name.length > 100) {
        errors.push({
          code: 'NAME_TOO_LONG',
          message: 'Plugin name must be 100 characters or less',
          path: '$.name'
        });
      }
    }

    // Validate version
    if (m.version) {
      if (!this.SEMVER_PATTERN.test(m.version)) {
        errors.push({
          code: 'INVALID_VERSION',
          message: 'Version must follow semantic versioning (e.g., 1.0.0)',
          path: '$.version'
        });
      }
    }

    // Validate description
    if (m.description) {
      if (m.description.length < 10) {
        warnings.push({
          code: 'SHORT_DESCRIPTION',
          message: 'Description should be at least 10 characters',
          path: '$.description'
        });
      }
      if (m.description.length > 500) {
        errors.push({
          code: 'DESCRIPTION_TOO_LONG',
          message: 'Description must be 500 characters or less',
          path: '$.description'
        });
      }
    }

    // Validate skills
    if (m.skills) {
      if (!Array.isArray(m.skills)) {
        errors.push({
          code: 'INVALID_SKILLS',
          message: 'Skills must be an array',
          path: '$.skills'
        });
      } else if (m.skills.length === 0) {
        errors.push({
          code: 'NO_SKILLS',
          message: 'Plugin must include at least one skill',
          path: '$.skills'
        });
      } else {
        // Validate each skill path exists
        for (let i = 0; i < m.skills.length; i++) {
          const skill = m.skills[i];
          const skillPath =
            typeof skill === 'string' ? skill : (skill as any).path;

          if (!skillPath) {
            errors.push({
              code: 'MISSING_SKILL_PATH',
              message: `Skill at index ${i} missing path`,
              path: `$.skills[${i}]`
            });
            continue;
          }

          const fullPath = path.resolve(pluginPath, skillPath);
          try {
            const stat = await fs.stat(fullPath);
            if (!stat.isDirectory()) {
              errors.push({
                code: 'SKILL_NOT_DIRECTORY',
                message: `Skill path is not a directory: ${skillPath}`,
                path: `$.skills[${i}].path`
              });
            } else {
              // Check for SKILL.md
              const skillMdPath = path.join(fullPath, 'SKILL.md');
              try {
                await fs.access(skillMdPath);
              } catch {
                errors.push({
                  code: 'MISSING_SKILL_MD',
                  message: `Skill directory missing SKILL.md: ${skillPath}`,
                  path: `$.skills[${i}].path`
                });
              }
            }
          } catch {
            errors.push({
              code: 'SKILL_PATH_NOT_FOUND',
              message: `Skill path not found: ${skillPath}`,
              path: `$.skills[${i}].path`
            });
          }
        }
      }
    }

    // Validate dependencies
    if (m.dependencies) {
      if (typeof m.dependencies !== 'object') {
        errors.push({
          code: 'INVALID_DEPENDENCIES',
          message: 'Dependencies must be an object',
          path: '$.dependencies'
        });
      } else {
        for (const [dep, version] of Object.entries(m.dependencies)) {
          if (!this.NAME_PATTERN.test(dep)) {
            errors.push({
              code: 'INVALID_DEPENDENCY_NAME',
              message: `Invalid dependency name: ${dep}`,
              path: `$.dependencies.${dep}`
            });
          }
          // TODO: Validate semver range syntax
        }
      }
    }

    // Validate permissions
    if (m.permissions) {
      this.validatePermissions(m.permissions, errors, warnings);
    }

    // Validate system requirements
    if (m.systemRequirements) {
      this.validateSystemRequirements(m.systemRequirements, errors, warnings);
    }

    // Validate hooks
    if (m.hooks) {
      await this.validateHooks(m.hooks, pluginPath, errors, warnings);
    }

    // Validate author
    if (m.author) {
      if (typeof m.author !== 'object' || !m.author.name) {
        errors.push({
          code: 'INVALID_AUTHOR',
          message: 'Author must have at least a name field',
          path: '$.author'
        });
      }
    }

    // Recommendations
    if (!m.license) {
      warnings.push({
        code: 'NO_LICENSE',
        message: 'Consider adding a license field',
        path: '$.license'
      });
    }

    if (!m.author) {
      warnings.push({
        code: 'NO_AUTHOR',
        message: 'Consider adding author information',
        path: '$.author'
      });
    }

    if (!m.repository) {
      warnings.push({
        code: 'NO_REPOSITORY',
        message: 'Consider adding repository information',
        path: '$.repository'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate permissions
   */
  private validatePermissions(
    permissions: any,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const dangerousPermissions = ['write', 'delete'];
    const dangerousTools = ['rm', 'sudo', 'chmod', 'chown'];

    if (permissions.filesystem) {
      for (const perm of permissions.filesystem) {
        if (dangerousPermissions.includes(perm)) {
          warnings.push({
            code: 'DANGEROUS_PERMISSION',
            message: `Plugin requests dangerous filesystem permission: ${perm}`,
            path: '$.permissions.filesystem'
          });
        }
      }
    }

    if (permissions.tools) {
      for (const tool of permissions.tools) {
        if (dangerousTools.includes(tool)) {
          warnings.push({
            code: 'DANGEROUS_TOOL',
            message: `Plugin requests potentially dangerous tool: ${tool}`,
            path: '$.permissions.tools'
          });
        }
      }
    }

    if (permissions.network) {
      warnings.push({
        code: 'NETWORK_ACCESS',
        message: 'Plugin requests network access',
        path: '$.permissions.network'
      });
    }
  }

  /**
   * Validate system requirements
   */
  private validateSystemRequirements(
    requirements: SystemRequirements,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const currentPlatform = process.platform;

    if (requirements.platforms && !requirements.platforms.includes(currentPlatform as any)) {
      warnings.push({
        code: 'PLATFORM_MISMATCH',
        message: `Plugin may not support current platform: ${currentPlatform}`,
        path: '$.systemRequirements.platforms'
      });
    }

    // Validate version format
    if (requirements.minVersion && !this.SEMVER_PATTERN.test(requirements.minVersion)) {
      errors.push({
        code: 'INVALID_MIN_VERSION',
        message: 'minVersion must follow semantic versioning',
        path: '$.systemRequirements.minVersion'
      });
    }

    if (requirements.maxVersion && !this.SEMVER_PATTERN.test(requirements.maxVersion)) {
      errors.push({
        code: 'INVALID_MAX_VERSION',
        message: 'maxVersion must follow semantic versioning',
        path: '$.systemRequirements.maxVersion'
      });
    }
  }

  /**
   * Validate lifecycle hooks
   */
  private async validateHooks(
    hooks: any,
    pluginPath: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    const validHooks = [
      'onInstall',
      'onActivate',
      'onDeactivate',
      'onUninstall',
      'onUpdate',
      'preInstall',
      'postActivate'
    ];

    for (const [hook, script] of Object.entries(hooks)) {
      if (!validHooks.includes(hook)) {
        warnings.push({
          code: 'UNKNOWN_HOOK',
          message: `Unknown hook: ${hook}`,
          path: `$.hooks.${hook}`
        });
      }

      if (typeof script !== 'string') {
        errors.push({
          code: 'INVALID_HOOK_SCRIPT',
          message: `Hook script must be a string: ${hook}`,
          path: `$.hooks.${hook}`
        });
        continue;
      }

      // Check if script file exists
      const scriptPath = path.resolve(pluginPath, script);
      try {
        await fs.access(scriptPath);
      } catch {
        errors.push({
          code: 'HOOK_SCRIPT_NOT_FOUND',
          message: `Hook script not found: ${script}`,
          path: `$.hooks.${hook}`
        });
      }
    }
  }

  /**
   * Calculate checksum of a directory
   */
  async calculateChecksum(dirPath: string): Promise<string> {
    const hash = crypto.createHash('sha256');
    const files = await this.getAllFiles(dirPath);

    files.sort(); // Ensure consistent ordering

    for (const file of files) {
      const content = await fs.readFile(file);
      hash.update(content);
    }

    return hash.digest('hex');
  }

  /**
   * Get all files in a directory recursively
   */
  private async getAllFiles(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        // Skip node_modules and hidden directories
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
          continue;
        }
        const subFiles = await this.getAllFiles(fullPath);
        files.push(...subFiles);
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Verify checksum of a plugin
   */
  async verifyChecksum(dirPath: string, expectedChecksum: string): Promise<boolean> {
    const actualChecksum = await this.calculateChecksum(dirPath);
    return actualChecksum === expectedChecksum;
  }
}
