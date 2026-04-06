import { json } from '@sveltejs/kit';
import { getSchemas } from '$lib/schemas.js';

export function GET({ params }) {
  const schemas = getSchemas();
  const schema = schemas[params.type];

  if (!schema) {
    return json(
      { error: `Unknown schema type: ${params.type}. Available: ${Object.keys(schemas).join(', ')}` },
      { status: 404 }
    );
  }

  return json(schema);
}
