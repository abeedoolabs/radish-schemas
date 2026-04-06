<script>
  let { data } = $props();

  const titles = {
    app: 'App Blueprint Schema',
    types: 'Types Blueprint Schema',
    roles: 'Roles Blueprint Schema',
    ui: 'UI Blueprint Schema'
  };

  function downloadSchema() {
    const blob = new Blob([data.schemaString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.type}.schema.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head>
  <title>{titles[data.type] || data.type} - Radish Schemas</title>
</svelte:head>

<section class="py-12 px-4 bg-base-200">
  <div class="max-w-5xl mx-auto">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-sm breadcrumbs mb-2">
          <ul>
            <li><a href="/schemas">Schemas</a></li>
            <li>{data.type}</li>
          </ul>
        </div>
        <h1 class="text-3xl font-bold tracking-tight">{titles[data.type] || data.type}</h1>
        <p class="mt-1 text-base-content/60 font-mono text-sm">{data.schema.$id}</p>
      </div>
      <div class="flex gap-2">
        <button onclick={downloadSchema} class="btn btn-primary btn-sm">Download JSON</button>
        <a href="/api/schemas/{data.type}" target="_blank" class="btn btn-outline btn-sm font-mono">API</a>
      </div>
    </div>
  </div>
</section>

<section class="py-8 px-4">
  <div class="max-w-5xl mx-auto">
    {#if data.schema.properties}
      <h2 class="text-xl font-bold mb-4">Properties</h2>
      <div class="overflow-x-auto mb-8">
        <table class="table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {#each Object.entries(data.schema.properties) as [key, prop]}
              <tr>
                <td class="font-mono text-sm font-semibold">{key}</td>
                <td class="font-mono text-xs text-accent">{prop.type || 'object'}</td>
                <td>
                  {#if data.schema.required?.includes(key)}
                    <span class="badge badge-sm badge-primary">required</span>
                  {:else}
                    <span class="text-base-content/40 text-xs">optional</span>
                  {/if}
                </td>
                <td class="text-sm text-base-content/60">{prop.description || ''}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}

    <h2 class="text-xl font-bold mb-4">Full Schema</h2>
    <div class="mockup-code bg-neutral text-neutral-content text-xs overflow-auto max-h-[600px]">
      <pre class="px-6"><code>{data.schemaString}</code></pre>
    </div>
  </div>
</section>
