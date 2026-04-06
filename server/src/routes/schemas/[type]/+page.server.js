import { error } from '@sveltejs/kit';
import { getSchemas } from '$lib/schemas.js';

export function load({ params }) {
  const schemas = getSchemas();
  const schema = schemas[params.type];

  if (!schema) {
    throw error(404, `Unknown schema type: ${params.type}`);
  }

  return {
    type: params.type,
    schema,
    schemaString: JSON.stringify(schema, null, 2)
  };
}
