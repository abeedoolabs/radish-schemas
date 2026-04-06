import { json } from '@sveltejs/kit';
import { toYAML } from '$lib/schemas.js';

export async function POST({ request }) {
  const data = await request.json();

  if (!data || typeof data !== 'object') {
    return json({ error: 'Request body must be a JSON object' }, { status: 400 });
  }

  return json({ yaml: toYAML(data) });
}
