<script>
  const endpoints = [
    {
      category: 'Validation',
      items: [
        {
          method: 'POST',
          path: '/api/validate',
          description: 'Validate a parsed JSON blueprint object.',
          body: '{ "type": "app", "data": { "version": 1, "app": { "name": "MyApp", "description": "..." } } }',
          response: '{ "valid": true, "errors": [], "data": { ... }, "formatted": null }',
          curl: 'curl -X POST https://schemas.radishplatform.com/api/validate \\\n  -H "Content-Type: application/json" \\\n  -d \'{"type":"app","data":{"version":1,"app":{"name":"Test","description":"A test"}}}\''
        },
        {
          method: 'POST',
          path: '/api/validate/json',
          description: 'Parse a raw JSON string and validate. Ideal for AI-generated output.',
          body: '{ "type": "types", "json": "{\\"version\\":1,\\"entities\\":{...}}" }',
          response: '{ "valid": true, "errors": [], "data": { ... }, "formatted": null }',
          curl: 'curl -X POST https://schemas.radishplatform.com/api/validate/json \\\n  -H "Content-Type: application/json" \\\n  -d \'{"type":"types","json":"{\\"version\\":1,\\"entities\\":{}}"}\''
        }
      ]
    },
    {
      category: 'Schemas',
      items: [
        {
          method: 'GET',
          path: '/api/schemas/:type',
          description: 'Fetch the raw JSON Schema for a blueprint type.',
          body: null,
          response: '{ "$schema": "...", "title": "...", "properties": { ... } }',
          curl: 'curl https://schemas.radishplatform.com/api/schemas/app'
        }
      ]
    },
    {
      category: 'Prompts',
      items: [
        {
          method: 'GET',
          path: '/api/prompts/:type',
          description: 'Get the raw AI prompt template with {{USER_DESCRIPTION}} placeholder.',
          body: null,
          response: '{ "prompt": "..." }',
          curl: 'curl https://schemas.radishplatform.com/api/prompts/types'
        },
        {
          method: 'POST',
          path: '/api/prompts/:type',
          description: 'Get an AI prompt with user description injected.',
          body: '{ "description": "A blog with posts and comments" }',
          response: '{ "prompt": "..." }',
          curl: 'curl -X POST https://schemas.radishplatform.com/api/prompts/app \\\n  -H "Content-Type: application/json" \\\n  -d \'{"description":"A blog with posts and comments"}\''
        }
      ]
    },
    {
      category: 'Utilities',
      items: [
        {
          method: 'GET',
          path: '/api/health',
          description: 'Service health check. Returns version and spec info.',
          body: null,
          response: '{ "status": "ok", "version": "1.6.0", "specVersion": 1, "supportedSpecVersions": [1] }',
          curl: 'curl https://schemas.radishplatform.com/api/health'
        },
        {
          method: 'POST',
          path: '/api/to-yaml',
          description: 'Convert a JSON object to YAML for display.',
          body: '{ "version": 1, "app": { "name": "Blog" } }',
          response: '{ "yaml": "version: 1\\napp:\\n  name: Blog" }',
          curl: 'curl -X POST https://schemas.radishplatform.com/api/to-yaml \\\n  -H "Content-Type: application/json" \\\n  -d \'{"version":1,"app":{"name":"Blog"}}\''
        }
      ]
    }
  ];

  const types = ['app', 'types', 'roles', 'ui'];
</script>

<svelte:head>
  <title>API Documentation - Radish Schemas</title>
</svelte:head>

<section class="py-16 px-4 bg-base-200">
  <div class="max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold tracking-tight">API Documentation</h1>
    <p class="mt-2 text-base-content/60">
      All endpoints are available at <code class="text-xs bg-base-300 px-1.5 py-0.5 rounded">https://schemas.radishplatform.com/api/</code>
    </p>
    <div class="mt-4 flex flex-wrap gap-2">
      <span class="text-sm text-base-content/50">Supported types:</span>
      {#each types as t}
        <span class="badge badge-outline badge-sm font-mono">{t}</span>
      {/each}
    </div>
  </div>
</section>

<section class="py-12 px-4">
  <div class="max-w-5xl mx-auto space-y-12">
    {#each endpoints as group}
      <div>
        <h2 class="text-2xl font-bold tracking-tight mb-6">{group.category}</h2>
        <div class="space-y-6">
          {#each group.items as ep}
            <div class="card bg-base-200 border border-base-300">
              <div class="card-body">
                <div class="flex items-center gap-3">
                  <span class="badge font-mono text-xs" class:badge-primary={ep.method === 'POST'} class:badge-accent={ep.method === 'GET'}>{ep.method}</span>
                  <code class="font-mono text-sm font-semibold">{ep.path}</code>
                </div>
                <p class="text-sm text-base-content/60 mt-1">{ep.description}</p>

                {#if ep.body}
                  <div class="mt-3">
                    <p class="text-xs font-semibold text-base-content/50 mb-1">Request Body</p>
                    <div class="bg-base-300 rounded-lg p-3">
                      <code class="text-xs font-mono">{ep.body}</code>
                    </div>
                  </div>
                {/if}

                <div class="mt-3">
                  <p class="text-xs font-semibold text-base-content/50 mb-1">Response</p>
                  <div class="bg-base-300 rounded-lg p-3">
                    <code class="text-xs font-mono">{ep.response}</code>
                  </div>
                </div>

                <details class="mt-3">
                  <summary class="text-xs text-accent cursor-pointer hover:underline">curl example</summary>
                  <div class="mockup-code bg-neutral text-neutral-content text-xs mt-2">
                    <pre class="px-4"><code>{ep.curl}</code></pre>
                  </div>
                </details>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</section>
