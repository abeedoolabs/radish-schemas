import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { typesSchema, rolesSchema, appSchema } from '../schemas/index.js';

// Initialize AJV
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Compile validators
const validators = {
  types: ajv.compile(typesSchema),
  roles: ajv.compile(rolesSchema),
  app: ajv.compile(appSchema)
};

/**
 * Validate a blueprint against its schema
 * @param {any} data - Parsed JSON data to validate
 * @param {'types' | 'roles' | 'app'} type - Schema type to validate against
 * @returns {{ valid: boolean, errors: Array }}
 */
export function validateBlueprint(data, type) {
  const validate = validators[type];
  if (!validate) {
    throw new Error(`Unknown schema type: ${type}`);
  }

  const isValid = validate(data);

  return {
    valid: isValid,
    errors: validate.errors || []
  };
}

/**
 * Get the raw JSON schemas
 * @returns {{ types: object, roles: object, app: object }}
 */
export function getSchemas() {
  return {
    types: typesSchema,
    roles: rolesSchema,
    app: appSchema
  };
}

/**
 * Format validation errors for display
 * @param {Array} errors - AJV validation errors
 * @returns {string} Formatted error message
 */
export function formatValidationErrors(errors) {
  if (!errors || errors.length === 0) {
    return 'No errors';
  }

  return errors
    .map(err => {
      const path = err.instancePath || '/';
      const message = err.message;
      const params = err.params ? JSON.stringify(err.params) : '';
      return `${path}: ${message} ${params}`.trim();
    })
    .join('\n');
}

/**
 * Parse a JSON string and validate against a schema
 * @param {string} jsonString - Raw JSON string to parse and validate
 * @param {'types' | 'roles' | 'app'} type - Schema type to validate against
 * @returns {{ valid: boolean, errors: Array, data: object|null }}
 */
export function validateFromJSON(jsonString, type) {
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (err) {
    return {
      valid: false,
      errors: [{ instancePath: '/', message: `Invalid JSON: ${err.message}`, params: {} }],
      data: null
    };
  }

  const result = validateBlueprint(data, type);
  return { ...result, data };
}

/**
 * Convert a blueprint object to YAML string for display purposes
 * @param {object} data - Blueprint data object
 * @param {number} indent - Indentation level (default: 2)
 * @returns {string} YAML-formatted string
 */
export function toYAML(data, indent = 2) {
  return jsonToYaml(data, 0, indent);
}

/**
 * Simple JSON-to-YAML converter for display purposes.
 * No external dependencies required.
 */
function jsonToYaml(value, level, indent) {
  const pad = ' '.repeat(level * indent);
  const childPad = ' '.repeat((level + 1) * indent);

  if (value === null || value === undefined) {
    return 'null';
  }

  if (typeof value === 'boolean' || typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    if (value.includes('\n') || value.includes(': ') || value.includes('#') ||
        value.startsWith('{') || value.startsWith('[') || value.startsWith('"') ||
        value.startsWith("'") || value === '' || value === 'true' || value === 'false' ||
        value === 'null' || /^\d+(\.\d+)?$/.test(value)) {
      return JSON.stringify(value);
    }
    return value;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    // Check if all items are simple (non-object) values
    const allSimple = value.every(item => typeof item !== 'object' || item === null);
    if (allSimple) {
      const items = value.map(item => jsonToYaml(item, 0, indent));
      if (items.join(', ').length < 80) {
        return `[${items.join(', ')}]`;
      }
    }
    return '\n' + value.map(item => {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        const entries = Object.entries(item);
        if (entries.length === 0) return `${childPad}- {}`;
        const [firstKey, firstVal] = entries[0];
        const firstLine = `${childPad}- ${firstKey}: ${jsonToYaml(firstVal, level + 2, indent)}`;
        const rest = entries.slice(1).map(([k, v]) => {
          return `${childPad}  ${k}: ${jsonToYaml(v, level + 2, indent)}`;
        });
        return [firstLine, ...rest].join('\n');
      }
      return `${childPad}- ${jsonToYaml(item, level + 1, indent)}`;
    }).join('\n');
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    return '\n' + entries.map(([key, val]) => {
      const rendered = jsonToYaml(val, level + 1, indent);
      if (typeof val === 'object' && val !== null && !Array.isArray(val) && Object.keys(val).length > 0) {
        return `${childPad}${key}:${rendered}`;
      }
      if (Array.isArray(val) && val.length > 0 && val.some(item => typeof item === 'object' && item !== null)) {
        return `${childPad}${key}:${rendered}`;
      }
      return `${childPad}${key}: ${rendered}`;
    }).join('\n');
  }

  return String(value);
}

export { typesSchema, rolesSchema, appSchema, validators };
