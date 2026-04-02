import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getSchema } from '../schemas/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the AI schema generation prompt template (types + roles)
 * @returns {string} Prompt markdown content
 */
export function getSchemaPrompt() {
  return readFileSync(
    join(__dirname, 'radish-schema-generation.md'),
    'utf-8'
  );
}

/**
 * Get the AI app blueprint generation prompt template
 * @returns {string} Prompt markdown content
 */
export function getAppPrompt() {
  return readFileSync(
    join(__dirname, 'radish-app-generation.md'),
    'utf-8'
  );
}

/**
 * Build a complete prompt with user description injected
 * @param {'schema' | 'app'} promptType - Which prompt template to use
 * @param {string} description - User's app description
 * @returns {string} Complete prompt with description injected
 */
export function buildPrompt(promptType, description) {
  const basePrompt = promptType === 'app' ? getAppPrompt() : getSchemaPrompt();
  return basePrompt.replace('{{USER_DESCRIPTION}}', description);
}

/**
 * Get schema JSON for inclusion in prompts
 * @param {'types' | 'roles' | 'app'} type - Schema type
 * @returns {string} Stringified JSON schema
 */
export function getSchemaForPrompt(type) {
  return JSON.stringify(getSchema(type), null, 2);
}
