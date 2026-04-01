// Main entry point for @radish/schemas
export { typesSchema, rolesSchema, appSchema, getSchema } from './schemas/index.js';
export {
  validateBlueprint,
  getSchemas,
  formatValidationErrors,
  validators
} from './validators/index.js';
export {
  getSchemaPrompt,
  getAppPrompt,
  buildPrompt,
  getSchemaForPrompt
} from './prompts/index.js';

/**
 * Version metadata for @radish/schemas
 *
 * This provides compatibility information for tools and CLIs that depend on this package.
 *
 * @property {string} packageVersion - The npm package version (from package.json)
 * @property {number} currentSpecVersion - The current blueprint format version
 * @property {number[]} supportedSpecVersions - All blueprint format versions supported by this package
 * @property {string} minCliVersion - Minimum radish-cli version compatible with this package
 */
export const VERSIONING = {
  packageVersion: '1.2.0',
  currentSpecVersion: 1,
  supportedSpecVersions: [1],
  minCliVersion: '0.1.0'
};
