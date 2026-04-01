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
 * @param {any} data - Parsed YAML/JSON data to validate
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

export { typesSchema, rolesSchema, appSchema, validators };
