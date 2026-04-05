import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getSchema } from '../schemas/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the AI types blueprint generation prompt
 * @returns {string} Prompt markdown content
 */
export function getTypesPrompt() {
  return readFileSync(
    join(__dirname, 'radish-types-generation.md'),
    'utf-8'
  );
}

/**
 * Get the AI roles blueprint generation prompt
 * @returns {string} Prompt markdown content
 */
export function getRolesPrompt() {
  return readFileSync(
    join(__dirname, 'radish-roles-generation.md'),
    'utf-8'
  );
}

/**
 * Get the AI UI blueprint generation prompt
 * @returns {string} Prompt markdown content
 */
export function getUiPrompt() {
  return readFileSync(
    join(__dirname, 'radish-ui-generation.md'),
    'utf-8'
  );
}

/**
 * Get the AI app blueprint generation prompt
 * @returns {string} Prompt markdown content
 */
export function getAppPrompt() {
  return readFileSync(
    join(__dirname, 'radish-app-generation.md'),
    'utf-8'
  );
}

/**
 * @deprecated Use getTypesPrompt() or getRolesPrompt() instead.
 * Returns the combined types+roles prompt for backward compatibility.
 * @returns {string} Prompt markdown content
 */
export function getSchemaPrompt() {
  return readFileSync(
    join(__dirname, 'radish-schema-generation.md'),
    'utf-8'
  );
}

/**
 * Build a complete prompt with user description injected
 * @param {'app' | 'types' | 'roles' | 'ui'} promptType - Blueprint type to generate
 * @param {string} description - User's app description
 * @returns {string} Complete prompt with description injected
 */
export function buildPrompt(promptType, description) {
  const prompts = {
    app: getAppPrompt,
    types: getTypesPrompt,
    roles: getRolesPrompt,
    ui: getUiPrompt
  };

  const getPrompt = prompts[promptType];
  if (!getPrompt) {
    throw new Error(`Unknown prompt type: ${promptType}. Available: ${Object.keys(prompts).join(', ')}`);
  }

  return getPrompt().replace('{{USER_DESCRIPTION}}', description);
}

/**
 * Get schema JSON for inclusion in prompts
 * @param {'types' | 'roles' | 'app'} type - Schema type
 * @returns {string} Stringified JSON schema
 */
export function getSchemaForPrompt(type) {
  return JSON.stringify(getSchema(type), null, 2);
}
