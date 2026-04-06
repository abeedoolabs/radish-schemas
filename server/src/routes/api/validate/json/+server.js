import { json } from '@sveltejs/kit';
import { validateFromJSON, formatValidationErrors } from '$lib/schemas.js';

export async function POST({ request }) {
  const body = await request.json();
  const { type, json: jsonString } = body;

  const validTypes = ['app', 'types', 'roles', 'ui'];
  if (!validTypes.includes(type)) {
    return json({ error: `Invalid type: ${type}. Available: ${validTypes.join(', ')}` }, { status: 400 });
  }

  const result = validateFromJSON(jsonString, type);

  return json({
    valid: result.valid,
    errors: result.errors,
    data: result.data,
    formatted: result.valid ? null : formatValidationErrors(result.errors)
  });
}
