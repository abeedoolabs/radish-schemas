<script>
  const schemas = [
    { type: 'app', name: 'App Blueprint', description: 'Master application document defining audience, workflows, features, entity overview, and access patterns.', required: ['version', 'app'] },
    { type: 'types', name: 'Types Blueprint', description: 'Data layer entities with fields, relationships, indexes, filters, and validation rules.', required: ['version', 'entities'] },
    { type: 'roles', name: 'Roles Blueprint', description: 'User roles with labels, descriptions, system flags, and permission arrays.', required: ['version', 'roles'] },
    { type: 'ui', name: 'UI Blueprint', description: 'Routes, pages, layouts, and content blocks for UI generation.', required: ['version', 'routes', 'pages'] }
  ];
</script>

<svelte:head>
  <title>Schema Browser - Radish Schemas</title>
</svelte:head>

<section class="py-16 px-4 bg-base-200">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold tracking-tight">Schema Browser</h1>
    <p class="mt-2 text-base-content/60">Browse and download JSON schemas for all Radish blueprint types.</p>
  </div>
</section>

<section class="py-12 px-4">
  <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
    {#each schemas as s}
      <a href="/schemas/{s.type}" class="card bg-base-200 border border-base-300 hover:border-accent/30 hover:shadow-md transition-all">
        <div class="card-body">
          <h2 class="card-title">{s.name}</h2>
          <p class="text-sm text-base-content/60">{s.description}</p>
          <div class="mt-3 flex flex-wrap gap-2">
            {#each s.required as field}
              <span class="badge badge-sm badge-outline font-mono">{field}</span>
            {/each}
          </div>
          <div class="card-actions justify-end mt-2">
            <span class="text-xs text-accent font-mono">{s.type}.schema.json</span>
          </div>
        </div>
      </a>
    {/each}
  </div>
</section>
