# Claude Code Session Context - @radish/schemas

## Project Overview

**@radish/schemas** is a shared npm package (v1.4.0) providing JSON schemas, validators, and AI prompts for the Radish CLI ecosystem. Published to a private GitLab npm registry. Also deployed as a standalone validation service at `https://schemas.radishplatform.com`.

**All blueprints use JSON as the source of truth.** YAML is available only as a display utility.

## Architecture

```
@radish/schemas/
├── package.json              # v1.4.0, @radish scope, GitLab registry
├── index.js                  # Main entry point - re-exports all modules
│
├── schemas/                  # JSON Schema definitions
│   ├── types.schema.json     # Data layer entities/fields
│   ├── roles.schema.json     # Roles and permissions
│   ├── app.schema.json       # Application blueprint (master document)
│   └── index.js              # Canonical schema loader (single source)
│
├── validators/               # Validation utilities
│   └── index.js              # validateBlueprint, validateFromJSON, toYAML, formatValidationErrors
│
├── prompts/                  # AI prompt templates (request raw JSON output)
│   ├── radish-types-generation.md    # Types-only generation
│   ├── radish-roles-generation.md    # Roles-only generation
│   ├── radish-app-generation.md      # App blueprint generation
│   ├── radish-schema-generation.md   # Combined types+roles (deprecated)
│   └── index.js              # buildPrompt, getTypesPrompt, getRolesPrompt, getAppPrompt
│
├── server/                   # Standalone validation service (Fastify)
│   └── index.js              # HTTP API deployed at schemas.radishplatform.com
│
├── Dockerfile                # For Coolify deployment
├── .dockerignore
├── test.js                   # 10 validation tests
├── .gitlab-ci.yml            # CI/CD pipeline (test + publish on tag)
│
├── README.md                 # Package usage and API
├── SETUP.md                  # GitLab registry setup
├── MIGRATION.md              # YAML-to-JSON migration guide
├── VERSIONING-STRATEGY.md    # Two-version system (package + spec)
├── UI-LAYER-STRATEGY.md      # UI Layer design document (MVP)
├── STATUS.md                 # Current project status
├── AI_CONTEXT.md             # Extended AI context
└── CLAUDE.md                 # This file
```

## Key Concepts

### Blueprint Types
| Type | Schema | Prompt | Purpose |
|------|--------|--------|---------|
| `app` | app.schema.json | radish-app-generation.md | Master app document |
| `types` | types.schema.json | radish-types-generation.md | Data layer entities |
| `roles` | roles.schema.json | radish-roles-generation.md | Roles/permissions |

### Validators
```javascript
import { validateBlueprint, validateFromJSON, toYAML, formatValidationErrors } from '@radish/schemas';

// Validate parsed object
validateBlueprint(data, 'types')  // { valid, errors, data }

// Parse JSON string + validate (ideal for AI output)
validateFromJSON(jsonString, 'app')  // { valid, errors, data }

// Display as YAML
toYAML(data)  // YAML string (zero dependencies)
```

### Prompts
```javascript
import { buildPrompt } from '@radish/schemas/prompts';

buildPrompt('app', description)    // App blueprint prompt
buildPrompt('types', description)  // Types-only prompt
buildPrompt('roles', description)  // Roles-only prompt
```

### Validation Service
Deployed at `https://schemas.radishplatform.com`. All endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Service status and version |
| `/validate` | POST | Validate parsed JSON object |
| `/validate/json` | POST | Parse JSON string + validate |
| `/schemas/:type` | GET | Get raw JSON schema |
| `/prompts/:type` | GET | Get raw prompt template |
| `/prompts/:type` | POST | Get prompt with description injected |
| `/to-yaml` | POST | Convert JSON to YAML for display |

### Versioning
Two-version system:
- **Package version** (semver): `@radish/schemas@1.4.0`
- **Blueprint spec version**: `"version": 1` in each blueprint file
- See VERSIONING-STRATEGY.md for details

## Consumer Projects

1. **@radish/cli** (`/Users/ctmeece/Projects/radish-cli`)
   - Code generators for data layer, UI layer
   - Blueprint validation via npm package
   - Package name: `@radish/cli` (binary: `radish-cli`)

2. **@radish/wizard** - AI-powered blueprint generation via npm package

3. **n8n workflows** - Blueprint generation pipeline via HTTP service

## Registry & Deployment

- **GitLab:** gitlab.mini1.abeedoo.com/abeedoo/radish-schemas
- **Project ID:** 6
- **npm versions:** v1.0.0 through v1.4.0
- **Validation service:** https://schemas.radishplatform.com (Coolify)

## Development Workflow

1. Create feature branch from `dev`
2. Make changes, run `node test.js`
3. Merge to `dev`, then to `main`
4. For npm package changes: tag version `git tag v1.x.0 && git push origin v1.x.0`
5. For server-only changes: push to main (Coolify auto-deploys)
6. GitLab CI publishes npm package on tags

## Dependencies

- `ajv@^8.12.0` - JSON Schema validation
- `ajv-formats@^2.1.1` - AJV format validators
- `fastify@^5.x` - HTTP server (for validation service only, not shipped in npm package)
- No YAML dependency (toYAML is built-in)

## Common Tasks

### Add a New Blueprint Type
1. Create `schemas/newtype.schema.json`
2. Export from `schemas/index.js` and add to `getSchema()`
3. Add validator in `validators/index.js` (compile + add to validators map)
4. Create `prompts/radish-newtype-generation.md`
5. Add getter in `prompts/index.js` and register in `buildPrompt()`
6. Export from main `index.js`
7. Add subpath export in `package.json`
8. Add tests in `test.js`
9. Update README

### Modify Existing Schema
1. Edit `schemas/*.schema.json`
2. Determine if breaking (major) or additive (minor)
3. Test with `node test.js`
4. Update prompt if schema structure changed
5. Bump version appropriately
