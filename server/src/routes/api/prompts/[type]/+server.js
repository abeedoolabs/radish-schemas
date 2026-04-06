import { json } from '@sveltejs/kit';
import { buildPrompt } from '$lib/schemas.js';

export function GET({ params }) {
  try {
    const prompt = buildPrompt(params.type, '{{USER_DESCRIPTION}}');
    return json({ prompt });
  } catch (err) {
    return json({ error: err.message }, { status: 400 });
  }
}

export async function POST({ params, request }) {
  const { description } = await request.json();

  try {
    const prompt = buildPrompt(params.type, description);
    return json({ prompt });
  } catch (err) {
    return json({ error: err.message }, { status: 400 });
  }
}
