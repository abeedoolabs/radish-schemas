import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the AI schema generation prompt template
 * @returns {string} Prompt markdown content
 */
export function getSchemaPrompt() {
  return readFileSync(
    join(__dirname, 'radish-schema-generation.md'),
    'utf-8'
  );
}

/**
 * Build a complete prompt with user description and schema
 * @param {string} description - User's app description
 * @param {object} schema - JSON schema object
 * @returns {string} Complete prompt
 */
export function buildPrompt(description, schema) {
  const basePrompt = getSchemaPrompt();

  // The prompt template uses placeholders that can be replaced
  // or the schema can be appended as context
  return basePrompt
    .replace('{{USER_DESCRIPTION}}', description)
    .replace('{{SCHEMA_JSON}}', JSON.stringify(schema, null, 2));
}

/**
 * Get schema JSON for inclusion in prompts
 * @param {'types' | 'roles'} type - Schema type
 * @returns {string} Stringified JSON schema
 */
export function getSchemaForPrompt(type) {
  const schemas = {
    types: JSON.parse(
      readFileSync(join(__dirname, '../schemas/types.schema.json'), 'utf-8')
    ),
    roles: JSON.parse(
      readFileSync(join(__dirname, '../schemas/roles.schema.json'), 'utf-8')
    )
  };

  return JSON.stringify(schemas[type], null, 2);
}
