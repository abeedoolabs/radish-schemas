/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // CORS for API routes
  if (event.url.pathname.startsWith('/api/')) {
    if (event.request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }
  }

  const response = await resolve(event);

  if (event.url.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
  }

  return response;
}
