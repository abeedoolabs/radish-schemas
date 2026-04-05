# SvelteKit Service Strategy

**Created:** 2026-04-05
**Status:** Design Phase
**Target:** Replace Fastify server with SvelteKit app at schemas.radishplatform.com

---

## Overview

Replace the current Fastify validation service (`server/index.js`) with a full SvelteKit application that serves both:

1. **Documentation site** - Landing page, schema browser, API reference, downloads
2. **API endpoints** - Same validation/prompt/schema endpoints, under `/api/` prefix

This gives `schemas.radishplatform.com` a proper web presence while maintaining all existing API functionality.

---

## Architecture

### Current (Fastify)
```
server/
└── index.js          # All endpoints in one file
```

### Proposed (SvelteKit)
```
server/
├── package.json               # SvelteKit deps (separate from root)
├── svelte.config.js           # adapter-node for Docker
├── vite.config.js
├── tailwind.config.js         # Tailwind 4 + DaisyUI 5
│
├── src/
│   ├── app.html
│   ├── app.css                # Tailwind + radish-schemas theme
│   │
│   ├── lib/
│   │   ├── schemas.js         # Import from ../../index.js (parent package)
│   │   └── components/        # Shared UI components
│   │       ├── Header.svelte
│   │       ├── Footer.svelte
│   │       ├── SchemaViewer.svelte
│   │       └── EndpointCard.svelte
│   │
│   └── routes/
│       ├── +layout.svelte     # Shared layout (header, nav, footer)
│       ├── +page.svelte       # Landing page
│       │
│       ├── schemas/
│       │   ├── +page.svelte           # Schema browser (all 4 types)
│       │   └── [type]/
│       │       └── +page.svelte       # Individual schema view + download
│       │
│       ├── docs/
│       │   └── +page.svelte           # API usage docs, curl examples
│       │
│       ├── api/
│       │   ├── health/
│       │   │   └── +server.js         # GET /api/health
│       │   ├── validate/
│       │   │   ├── +server.js         # POST /api/validate
│       │   │   └── json/
│       │   │       └── +server.js     # POST /api/validate/json
│       │   ├── schemas/
│       │   │   └── [type]/
│       │   │       └── +server.js     # GET /api/schemas/:type
│       │   ├── prompts/
│       │   │   └── [type]/
│       │   │       └── +server.js     # GET/POST /api/prompts/:type
│       │   └── to-yaml/
│       │       └── +server.js         # POST /api/to-yaml
│       │
│       └── playground/
│           └── +page.svelte           # (Future) Interactive validation tester
│
├── static/
│   ├── brand/
│   │   └── logo-schemas.svg           # Schemas logo from brand guide
│   └── favicon.ico
│
└── Dockerfile                         # Builds SvelteKit with adapter-node
```

---

## Branding

Use the **Schemas** theme from the Radish Brand Guide:

```css
@plugin "daisyui/theme" {
  name: "radish-schemas";
  default: true;
  color-scheme: light;

  --color-primary: #334155;      /* Slate */
  --color-secondary: #475569;
  --color-accent: #4f46e5;       /* Indigo accent */
  --color-neutral: #0f172a;
  --color-base-100: #ffffff;
  --color-base-200: #f8fafc;
  --color-base-300: #e2e8f0;
  --color-info: #3b82f6;
  --color-success: #22c55e;
  --color-warning: #eab308;
  --color-error: #ef4444;
}
```

**Brand note:** "Slate + indigo accent. Structural, validation-focused."

Logo: `logo-schemas.svg` from `/Users/ctmeece/Projects/radishplatform.com/static/brand/`

---

## Pages

### Landing Page (`/`)
- Radish Schemas logo + tagline
- What this service does (validation, schemas, prompts)
- Blueprint types overview (app, types, roles, ui) with links
- Quick start code examples
- Link to API docs
- Current version info (from VERSIONING export)

### Schema Browser (`/schemas`)
- Card grid showing all 4 blueprint types
- Each card: name, description, field count, link to detail

### Schema Detail (`/schemas/[type]`)
- Full JSON schema rendered in a formatted viewer
- Download button (raw JSON)
- Key properties table
- Required fields highlighted
- Example valid blueprint

### API Docs (`/docs`)
- All endpoints listed with:
  - Method, path, description
  - Request/response examples
  - curl commands (copyable)
- Organized by category: Validation, Schemas, Prompts, Utilities

### Playground (`/playground`) - Future
- Paste JSON, select type, validate live
- Show errors inline
- Convert to YAML view

---

## API Endpoints

All API endpoints move under `/api/` prefix. The response format stays identical.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Service status and version |
| `/api/validate` | POST | Validate parsed JSON object |
| `/api/validate/json` | POST | Parse JSON string + validate |
| `/api/schemas/:type` | GET | Get raw JSON schema |
| `/api/prompts/:type` | GET | Get raw prompt template |
| `/api/prompts/:type` | POST | Get prompt with description injected |
| `/api/to-yaml` | POST | Convert JSON to YAML for display |

Types supported: `app`, `types`, `roles`, `ui`

### CORS

SvelteKit handles CORS via hooks. Same `Access-Control-Allow-Origin: *` policy.

### Server.js Implementation

Each API endpoint is a SvelteKit server route (`+server.js`):

```javascript
// src/routes/api/validate/+server.js
import { json } from '@sveltejs/kit';
import { validateBlueprint, formatValidationErrors } from '$lib/schemas.js';

export async function POST({ request }) {
  const { type, data } = await request.json();
  const result = validateBlueprint(data, type);
  return json({
    valid: result.valid,
    errors: result.errors,
    data,
    formatted: result.valid ? null : formatValidationErrors(result.errors)
  });
}
```

### $lib/schemas.js Bridge

```javascript
// src/lib/schemas.js
// Bridge to parent @radish/schemas package
export {
  validateBlueprint,
  validateFromJSON,
  toYAML,
  formatValidationErrors,
  getSchemas,
  VERSIONING,
  typesSchema,
  rolesSchema,
  appSchema,
  uiSchema,
  getSchema
} from '../../index.js';

export {
  buildPrompt,
  getTypesPrompt,
  getRolesPrompt,
  getAppPrompt,
  getSchemaForPrompt
} from '../../prompts/index.js';
```

---

## Tech Stack

- **SvelteKit** - Framework (adapter-node for production)
- **Tailwind CSS 4** - Styling
- **DaisyUI 5** - Component library
- **adapter-node** - Production server for Docker

---

## Dockerfile

```dockerfile
FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install root package (schemas, validators, prompts)
COPY package.json package-lock.json ./
RUN npm ci --production

COPY index.js ./
COPY schemas/ ./schemas/
COPY validators/ ./validators/
COPY prompts/ ./prompts/

# Install and build SvelteKit app
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

EXPOSE 3000

# adapter-node outputs to build/
CMD ["node", "build/index.js"]
```

---

## Migration Plan

### Phase 1: Scaffold SvelteKit App
1. Initialize SvelteKit in `server/` with separate package.json
2. Configure Tailwind 4 + DaisyUI 5 with schemas theme
3. Set up adapter-node
4. Create `$lib/schemas.js` bridge to parent package

### Phase 2: Port API Endpoints
1. Create all `/api/*` server routes
2. Verify identical response format to current Fastify
3. Add CORS handling via hooks
4. Test all endpoints locally

### Phase 3: Build Pages
1. Layout with header/nav/footer (schemas branding)
2. Landing page
3. Schema browser + detail pages
4. API docs page

### Phase 4: Deploy
1. Update Dockerfile for SvelteKit build
2. Update Coolify healthcheck path to `/api/health`
3. Deploy to schemas.radishplatform.com
4. Update all consumers to use `/api/` prefix:
   - n8n workflows
   - Any direct API callers

### Phase 5: Cleanup
1. Remove old Fastify `server/index.js`
2. Remove Fastify dependency from package.json
3. Update documentation

---

## Breaking Changes

### API URL Change
All API endpoints move from `/` to `/api/`:

| Before | After |
|--------|-------|
| `POST /validate` | `POST /api/validate` |
| `POST /validate/json` | `POST /api/validate/json` |
| `GET /health` | `GET /api/health` |
| `GET /schemas/:type` | `GET /api/schemas/:type` |
| `GET /prompts/:type` | `GET /api/prompts/:type` |
| `POST /prompts/:type` | `POST /api/prompts/:type` |
| `POST /to-yaml` | `POST /api/to-yaml` |

### Consumer Updates Required
- **n8n workflows** - Update all HTTP request URLs to add `/api/` prefix
- **Coolify healthcheck** - Change path from `/health` to `/api/health`

---

## Open Questions

1. **Should `/api/health` also serve as the Coolify healthcheck, or add a root `/health` redirect?**
   - Recommendation: Add a root `/health` redirect for simplicity

2. **Should the playground be in Phase 3 or deferred?**
   - Recommendation: Defer to Phase 5, focus on docs and schema browser first

3. **Should we support the old endpoints (without `/api/`) for backward compat?**
   - Recommendation: No, clean break. Update consumers at deploy time.

---

## Success Criteria

1. All existing API functionality works identically under `/api/` prefix
2. Landing page loads with schemas branding
3. Schema browser shows all 4 blueprint types with download
4. API docs page has all endpoints with curl examples
5. Docker build + Coolify deployment works
6. n8n workflows updated and functional

---

## Related Files

- Brand guide: `/Users/ctmeece/Projects/radishplatform.com/src/routes/brand/+page.svelte`
- Brand assets: `/Users/ctmeece/Projects/radishplatform.com/static/brand/`
- Current Fastify server: `server/index.js`
- Schemas package: `index.js`, `schemas/`, `validators/`, `prompts/`
