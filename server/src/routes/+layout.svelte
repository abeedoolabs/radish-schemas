<script>
  import '../app.css';
  let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-base-100">
  <header class="navbar bg-base-200 border-b border-base-300 px-4">
    <div class="navbar-start">
      <a href="/" class="btn btn-ghost text-lg font-bold gap-2">
        <img src="/brand/logo-schemas.svg" alt="Radish Schemas" class="w-7 h-7" />
        <span class="text-primary">Radish Schemas</span>
      </a>
    </div>
    <div class="navbar-end gap-1">
      <a href="/schemas" class="btn btn-ghost btn-sm">Schemas</a>
      <a href="/docs" class="btn btn-ghost btn-sm">API Docs</a>
    </div>
  </header>

  <main class="flex-1">
    {@render children()}
  </main>

  <footer class="footer footer-center p-6 bg-base-200 text-base-content/60 border-t border-base-300">
    <p class="text-sm">Radish Schemas &mdash; JSON schema validation service for the Radish CLI ecosystem</p>
  </footer>
</div>
