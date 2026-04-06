<script>
  const blueprintTypes = [
    {
      type: 'app',
      name: 'App Blueprint',
      description: 'Master application document. Defines audience, workflows, features, entity overview, and access patterns.',
      file: 'app.schema.json'
    },
    {
      type: 'types',
      name: 'Types Blueprint',
      description: 'Data layer entities, fields, relationships, indexes, and validation rules.',
      file: 'types.schema.json'
    },
    {
      type: 'roles',
      name: 'Roles Blueprint',
      description: 'User roles, permissions, and access control definitions.',
      file: 'roles.schema.json'
    },
    {
      type: 'ui',
      name: 'UI Blueprint',
      description: 'Routes, pages, layouts, and content blocks for UI generation.',
      file: 'ui.schema.json'
    }
  ];
</script>

<svelte:head>
  <title>Radish Schemas - Validation Service</title>
</svelte:head>

<section class="py-16 px-4 bg-base-200">
  <div class="max-w-4xl mx-auto text-center">
    <img src="/brand/logo-schemas.svg" alt="Radish Schemas" class="w-20 h-20 mx-auto mb-6" />
    <h1 class="text-4xl font-bold tracking-tight text-primary">Radish Schemas</h1>
    <p class="mt-3 text-lg text-base-content/60 max-w-2xl mx-auto">
      JSON schema validation service for the Radish CLI ecosystem.
      Validate blueprints, fetch schemas, and generate AI prompts.
    </p>
    <div class="mt-8 flex gap-3 justify-center">
      <a href="/schemas" class="btn btn-primary">Browse Schemas</a>
      <a href="/docs" class="btn btn-outline">API Documentation</a>
    </div>
  </div>
</section>

<section class="py-16 px-4">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold tracking-tight mb-8">Blueprint Types</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each blueprintTypes as bt}
        <a href="/schemas/{bt.type}" class="card bg-base-200 border border-base-300 hover:border-accent/30 hover:shadow-md transition-all">
          <div class="card-body">
            <h3 class="card-title text-lg">{bt.name}</h3>
            <p class="text-sm text-base-content/60">{bt.description}</p>
            <div class="card-actions justify-end mt-2">
              <span class="badge badge-outline font-mono text-xs">{bt.file}</span>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>

<section class="py-16 px-4 bg-base-200">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold tracking-tight mb-8">Quick Start</h2>

    <div class="space-y-6">
      <div>
        <h3 class="font-semibold mb-2">Validate a blueprint</h3>
        <div class="mockup-code bg-neutral text-neutral-content text-sm">
          <pre><code>curl -X POST https://schemas.radishplatform.com/api/validate \
  -H "Content-Type: application/json" \
  -d '{JSON.stringify({ type: "app", data: { version: 1, app: { name: "MyApp", description: "My app" }}})}'</code></pre>
        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-2">Fetch a schema</h3>
        <div class="mockup-code bg-neutral text-neutral-content text-sm">
          <pre><code>curl https://schemas.radishplatform.com/api/schemas/types</code></pre>
        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-2">Get an AI prompt</h3>
        <div class="mockup-code bg-neutral text-neutral-content text-sm">
          <pre><code>curl -X POST https://schemas.radishplatform.com/api/prompts/app \
  -H "Content-Type: application/json" \
  -d '{JSON.stringify({ description: "A blog with posts and comments" })}'</code></pre>
        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-2">npm package</h3>
        <div class="mockup-code bg-neutral text-neutral-content text-sm">
          <pre><code>npm install @radish/schemas

import {"{"} validateBlueprint, buildPrompt {"}"} from '@radish/schemas';</code></pre>
        </div>
      </div>
    </div>
  </div>
</section>
