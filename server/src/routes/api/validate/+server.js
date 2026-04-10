import { json } from '@sveltejs/kit';
import { validateBlueprint, formatValidationErrors } from '$lib/schemas.js';

export async function POST({ request }) {
  const { type, data } = await request.json();

  const validTypes = ['app', 'types', 'roles', 'ui', 'components', 'theme'];
  if (!validTypes.includes(type)) {
    return json({ error: `Invalid type: ${type}. Available: ${validTypes.join(', ')}` }, { status: 400 });
  }

  const result = validateBlueprint(data, type);

  return json({
    valid: result.valid,
    errors: result.errors,
    data,
    formatted: result.valid ? null : formatValidationErrors(result.errors)
  });
}
