# AI Context - @radish/schemas

## What This Package Is

A shared npm package providing JSON schemas, validators, and AI prompts for the Radish CLI ecosystem. It is the single source of truth for blueprint validation and AI generation across all Radish projects.

## Why It Exists

**Problem:** Multiple Radish projects (CLI, wizard) need identical schemas, validators, and prompts. Duplicating these causes version drift and maintenance burden.

**Solution:** Single versioned package published to private GitLab npm registry.

## Current State

**Version:** 1.2.0 (published to GitLab registry)
**Blueprint Format:** JSON (source of truth). YAML available as display utility only.

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
├── prompts/                          # AI prompt templates
│   ├── radish-schema-generation.md   # Types/roles generation prompt
│   ├── radish-app-generation.md      # App blueprint generation prompt
│   └── index.js                      # buildPrompt, getSchemaPrompt, getAppPrompt
│
├── index.js                          # Main entry point - re-exports everything
├── test.js                           # 10 validation tests
└── package.json                      # v1.2.0, published to GitLab
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
- **Package version** (npm semver): `@radish/schemas@1.2.0`
- **Blueprint spec version**: `version: 1` in each blueprint
- Package can evolve within major version without breaking blueprints
- Breaking blueprint changes = major version bump + spec version bump

### Schema Loading
Schemas are loaded once in `schemas/index.js` and imported by validators and prompts. No duplicate file reads.

### Extensible Prompt System
`buildPrompt(type, description)` maps blueprint types to prompt templates:
```javascript
buildPrompt('app', description)    // Uses radish-app-generation.md
buildPrompt('types', description)  // Uses radish-schema-generation.md
buildPrompt('roles', description)  // Uses radish-schema-generation.md
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
getSchemaPrompt()                    // Raw types/roles prompt template
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
VERSIONING.packageVersion        // "1.2.0"
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

## Dependencies

**Production:**
- `ajv@^8.12.0` - JSON Schema validator
- `ajv-formats@^2.1.1` - Additional AJV format validators

**No YAML dependency.** The `toYAML()` utility is built-in with zero external dependencies.

## Consumer Projects

- **@radish/cli** (`/Users/ctmeece/Projects/radish-cli`) - CLI tool, code generators
- **@radish/wizard** - AI-powered blueprint generation wizard

## Registry

- **GitLab:** gitlab.mini1.abeedoo.com/abeedoo/radish-schemas
- **Project ID:** 6
- **npm:** `@radish/schemas` via GitLab private registry
- **Auth:** Deploy token with `read_package_registry` scope

## Related Documentation

- **README.md** - Package usage and API reference
- **SETUP.md** - GitLab publishing and consumer setup
- **MIGRATION.md** - Migration guide (including YAML to JSON)
- **VERSIONING-STRATEGY.md** - Two-version system details
- **UI-LAYER-STRATEGY.md** - UI Layer design (MVP)
