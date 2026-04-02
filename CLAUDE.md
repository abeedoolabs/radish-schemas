# Claude Code Session Context - @radish/schemas

## Project Overview

**@radish/schemas** is a shared npm package (v1.2.0) providing JSON schemas, validators, and AI prompts for the Radish CLI ecosystem. Published to a private GitLab npm registry.

**All blueprints use JSON as the source of truth.** YAML is available only as a display utility.

## Architecture

```
@radish/schemas/
├── package.json              # v1.2.0, @radish scope, GitLab registry
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
│   ├── radish-schema-generation.md   # Types/roles generation
│   ├── radish-app-generation.md      # App blueprint generation
│   └── index.js              # buildPrompt, getSchemaPrompt, getAppPrompt
│
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
| `types` | types.schema.json | radish-schema-generation.md | Data layer entities |
| `roles` | roles.schema.json | radish-schema-generation.md | Roles/permissions |

### Validators
```javascript
import { validateBlueprint, validateFromJSON, toYAML, formatValidationErrors } from '@radish/schemas';

// Validate parsed object
validateBlueprint(data, 'types')  // { valid, errors }

// Parse JSON string + validate (ideal for AI output)
validateFromJSON(jsonString, 'app')  // { valid, errors, data }

// Display as YAML
toYAML(data)  // YAML string (zero dependencies)
```

### Prompts
```javascript
import { buildPrompt } from '@radish/schemas/prompts';

buildPrompt('app', description)    // App blueprint prompt
buildPrompt('types', description)  // Types/roles prompt
buildPrompt('roles', description)  // Types/roles prompt (same template)
```

### Versioning
Two-version system:
- **Package version** (semver): `@radish/schemas@1.2.0`
- **Blueprint spec version**: `"version": 1` in each blueprint file
- See VERSIONING-STRATEGY.md for details

## Consumer Projects

1. **@radish/cli** (`/Users/ctmeece/Projects/radish-cli`)
   - Code generators for data layer, UI layer
   - Blueprint validation
   - Package name: `@radish/cli` (binary: `radish-cli`)

2. **@radish/wizard** - AI-powered blueprint generation

## Registry

- **GitLab:** gitlab.mini1.abeedoo.com/abeedoo/radish-schemas
- **Project ID:** 6
- **Published versions:** v1.0.0, v1.1.0, v1.2.0

## Development Workflow

1. Create feature branch from `dev`
2. Make changes, run `node test.js`
3. Merge to `dev`, then to `main`
4. Tag version: `git tag v1.x.0 && git push origin v1.x.0`
5. GitLab CI publishes automatically

## Dependencies

- `ajv@^8.12.0` - JSON Schema validation
- `ajv-formats@^2.1.1` - AJV format validators
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
