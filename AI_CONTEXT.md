# AI Context - @radish/schemas

## What This Package Is

A shared npm package providing JSON schemas, validators, and AI prompts for the Radish CLI ecosystem. It is the single source of truth for blueprint validation and AI generation across all Radish projects.

## Why It Exists

**Problem:** Multiple Radish projects (CLI, wizard) need identical schemas, validators, and prompts. Duplicating these causes version drift and maintenance burden.

**Solution:** Single versioned package published to private GitLab npm registry, plus a standalone HTTP validation service deployed at `https://schemas.radishplatform.com`.

## Current State

**Version:** 1.4.0 (published to GitLab registry)
**Blueprint Format:** JSON (source of truth). YAML available as display utility only.
**Validation Service:** https://schemas.radishplatform.com (Coolify)

## Architecture

```
@radish/schemas/
├── schemas/                          # JSON Schema definitions
│   ├── types.schema.json             # Data layer entities/fields
│   ├── roles.schema.json             # Roles and permissions
│   ├── app.schema.json               # Application blueprint (master document)
│   └── index.js                      # Single schema loader (canonical)
│
├── validators/                       # Validation utilities
│   └── index.js                      # validateBlueprint, validateFromJSON, toYAML
│
├── prompts/                          # AI prompt templates (separate per type)
│   ├── radish-types-generation.md    # Types-only generation
│   ├── radish-roles-generation.md    # Roles-only generation
│   ├── radish-app-generation.md      # App blueprint generation
│   ├── radish-schema-generation.md   # Combined types+roles (deprecated)
│   └── index.js                      # buildPrompt, getTypesPrompt, getRolesPrompt, getAppPrompt
│
├── server/                           # Standalone validation service
│   └── index.js                      # Fastify HTTP API
│
├── Dockerfile                        # For Coolify deployment
├── index.js                          # Main entry point - re-exports everything
├── test.js                           # 10 validation tests
└── package.json                      # v1.4.0, published to GitLab
```

## Key Design Decisions

### JSON-First Pipeline
All blueprints use JSON throughout the entire pipeline. AI prompts request raw JSON output. No YAML parsing dependency. `toYAML()` is a zero-dependency display utility for human readability in UIs.

### Blueprint Types
Three blueprint types, each with a schema, validator, and prompt:

| Type | File | Purpose |
|------|------|---------|
| `app` | app.schema.json | Master application document (audience, workflows, features, entity overview) |
| `types` | types.schema.json | Data layer entities, fields, relationships, indexes |
| `roles` | roles.schema.json | Roles, permissions, access control |

### Two-Version System
- **Package version** (npm semver): `@radish/schemas@1.4.0`
- **Blueprint spec version**: `version: 1` in each blueprint
- Package can evolve within major version without breaking blueprints
- Breaking blueprint changes = major version bump + spec version bump

### Schema Loading
Schemas are loaded once in `schemas/index.js` and imported by validators and prompts. No duplicate file reads.

### Extensible Prompt System
`buildPrompt(type, description)` maps blueprint types to separate prompt templates:
```javascript
buildPrompt('app', description)    // Uses radish-app-generation.md
buildPrompt('types', description)  // Uses radish-types-generation.md
buildPrompt('roles', description)  // Uses radish-roles-generation.md
// Future: buildPrompt('ui', description)
```

## API Summary

### Validators
```javascript
validateBlueprint(data, type)        // Validate parsed object
validateFromJSON(jsonString, type)   // Parse JSON string + validate
formatValidationErrors(errors)       // Format AJV errors for display
toYAML(data)                         // Convert to YAML for display
getSchemas()                         // Get all schema objects
```

### Prompts
```javascript
buildPrompt(type, description)       // Build prompt with description injected
getTypesPrompt()                     // Raw types-only prompt template
getRolesPrompt()                     // Raw roles-only prompt template
getAppPrompt()                       // Raw app prompt template
getSchemaForPrompt(type)             // Schema as JSON string for prompts
```

### Schemas
```javascript
typesSchema    // Parsed types JSON Schema object
rolesSchema    // Parsed roles JSON Schema object
appSchema      // Parsed app JSON Schema object
getSchema(name) // Get schema by name
```

### Versioning
```javascript
VERSIONING.packageVersion        // "1.4.0"
VERSIONING.currentSpecVersion    // 1
VERSIONING.supportedSpecVersions // [1]
VERSIONING.minCliVersion         // "0.1.0"
```

## App Blueprint (app.schema.json)

The app blueprint is the master document that drives all other generators:

- **app** - Name, description, domain, tags
- **audience** - User personas (primary, secondary, admin)
- **workflows** - Core user journeys with actors and descriptions
- **categories** - Content taxonomy with subcategories
- **style** - Branding hints (theme, tone, palette, typography, layout, icons)
- **features** - Feature flags (auth, roles, adminPanel, api, search, etc.)
- **entityOverview** - High-level entity descriptions grouped by domain concern
- **accessPatterns** - Who can do what, by access level
- **database** - Database engine and name

## Validation Service

Standalone Fastify HTTP service deployed at `https://schemas.radishplatform.com` via Coolify.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Service status and version |
| `/validate` | POST | Validate parsed JSON object |
| `/validate/json` | POST | Parse JSON string + validate |
| `/schemas/:type` | GET | Get raw JSON schema |
| `/prompts/:type` | GET | Get raw prompt template |
| `/prompts/:type` | POST | Get prompt with description injected |
| `/to-yaml` | POST | Convert JSON to YAML for display |

Server code lives in `server/index.js`. Not shipped in npm package (excluded by `files` field). Server-only changes don't need a version tag - just push to main and Coolify redeploys.

## Dependencies

**Production:**
- `ajv@^8.12.0` - JSON Schema validator
- `ajv-formats@^2.1.1` - Additional AJV format validators
- `fastify@^5.x` - HTTP server (validation service only, not in npm package)

**No YAML dependency.** The `toYAML()` utility is built-in with zero external dependencies.

## Consumer Projects

- **@radish/cli** (`/Users/ctmeece/Projects/radish-cli`) - CLI tool, code generators (via npm package)
- **@radish/wizard** - AI-powered blueprint generation (via npm package)
- **n8n workflows** - Blueprint generation pipeline (via HTTP service)

## Registry & Deployment

- **GitLab:** gitlab.mini1.abeedoo.com/abeedoo/radish-schemas
- **Project ID:** 6
- **npm:** `@radish/schemas` via GitLab private registry
- **Auth:** Deploy token with `read_package_registry` scope
- **Validation service:** https://schemas.radishplatform.com (Coolify, auto-deploys from main)
