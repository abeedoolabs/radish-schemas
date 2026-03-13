# Claude Code Session Context - @radish/schemas

This file provides context for Claude Code about the @radish/schemas package structure, purpose, and development workflow.

## Project Overview

**@radish/schemas** is a shared npm package containing JSON schemas, validators, and AI prompts used across the Radish CLI ecosystem. It provides a single source of truth for:

- Blueprint type definitions (types.schema.json)
- Role/permission schemas (roles.schema.json)
- AJV-based validation utilities
- AI prompt templates for schema generation

## Architecture

```
@radish/schemas/
├── package.json              # NPM package configuration
├── index.js                  # Main entry point - exports all modules
│
├── schemas/                  # JSON Schema definitions
│   ├── types.schema.json     # Blueprint entity/field schema
│   ├── roles.schema.json     # Roles and permissions schema
│   └── index.js              # Schema exports
│
├── validators/               # Validation utilities
│   └── index.js              # AJV validators with error formatting
│
├── prompts/                  # AI prompt templates
│   ├── radish-schema-generation.md  # LLM prompt for generating blueprints
│   └── index.js              # Prompt loading utilities
│
├── test.js                   # Simple validation tests
├── README.md                 # Package documentation
├── SETUP.md                  # GitLab publishing guide
├── MIGRATION.md              # Migration guide for consumers
└── .gitlab-ci.yml            # CI/CD pipeline
```

## Key Concepts

### JSON Schemas
The core of this package is two JSON Schema files that define the structure of Radish blueprints:

- **types.schema.json**: Defines entities, fields, relationships, indexes, filters, etc.
- **roles.schema.json**: Defines roles, permissions, and access control

These schemas are used by:
- `radish-cli` - To validate blueprint YAML files before code generation
- `radish-wizard` - To validate AI-generated blueprints in real-time

### Validators Module
Wraps AJV (Another JSON Validator) to provide clean validation functions:

```javascript
import { validateBlueprint, formatValidationErrors } from '@radish/schemas';

const result = validateBlueprint(blueprintData, 'types');
// Returns: { valid: boolean, errors: Array }

if (!result.valid) {
  console.error(formatValidationErrors(result.errors));
}
```

### Prompts Module
Provides the AI prompt template used to generate blueprints from natural language:

```javascript
import { getSchemaPrompt } from '@radish/schemas/prompts';

const prompt = getSchemaPrompt();
// Returns: Full markdown prompt with schema examples
```

## Consumer Projects

This package is consumed by:

1. **radish-cli** (`/Users/ctmeece/Projects/radish-cli`)
   - Uses validators in `src/commands/validate.mjs`
   - Uses schemas in `src/commands/schema.mjs`
   - Validates blueprints before code generation

2. **radish-wizard** (`/Users/ctmeece/Projects/radish-cli/wizard`)
   - Uses validators in `src/routes/+page.server.ts`
   - Uses prompts for AI generation
   - Validates AI-generated YAML in real-time

## Development Workflow

### Making Changes

1. **Update schemas** in `schemas/*.schema.json`
2. **Test locally**: `node test.js`
3. **Update version**: `npm version patch|minor|major`
4. **Commit & tag**: `git push --follow-tags`
5. **GitLab CI publishes** automatically on tag push
6. **Update consumers**: `npm update @radish/schemas` in radish-cli/wizard

### Testing Changes Locally

Before publishing, test in consuming projects:

```bash
# In radish-schemas
npm pack

# In radish-cli
npm install ../radish-schemas/radish-schemas-1.0.0.tgz

# Test
radish-cli validate ./blueprints/types.yml
```

### Version Guidelines

Use semantic versioning:
- **Patch** (1.0.1): Bug fixes, typos, non-breaking changes
- **Minor** (1.1.0): New features, backward compatible schema additions
- **Major** (2.0.0): Breaking changes (rename fields, change validation rules)

**Breaking changes require coordinated updates:**
1. Update @radish/schemas
2. Update radish-cli to handle new schema
3. Update radish-wizard to handle new schema

## Publishing to GitLab Package Registry

### Initial Setup

1. Update `package.json` with your GitLab project ID:
   ```json
   {
     "publishConfig": {
       "@radish:registry": "https://gitlab.your-domain.com/api/v4/projects/YOUR_PROJECT_ID/packages/npm/"
     }
   }
   ```

2. Configure npm authentication:
   ```bash
   npm config set @radish:registry https://gitlab.your-domain.com/api/v4/projects/YOUR_PROJECT_ID/packages/npm/
   npm config set //gitlab.your-domain.com/api/v4/projects/YOUR_PROJECT_ID/packages/npm/:_authToken YOUR_TOKEN
   ```

### Publishing

**Manual:**
```bash
npm version patch
npm publish
```

**Automated (Recommended):**
```bash
git tag v1.0.0
git push origin v1.0.0
# GitLab CI publishes automatically
```

## Common Tasks

### Add a New Schema

1. Create new schema file in `schemas/`
2. Export from `schemas/index.js`
3. Add validator in `validators/index.js`
4. Export from main `index.js`
5. Update tests in `test.js`
6. Update README with usage examples

### Modify Existing Schema

1. Edit schema in `schemas/*.schema.json`
2. Determine if breaking change (major) or addition (minor)
3. Test with `node test.js`
4. Update version appropriately
5. Update MIGRATION.md if breaking

### Add New Validator Function

1. Add function to `validators/index.js`
2. Export from main `index.js`
3. Add test case
4. Document in README

## Files to Watch

### Critical Files
- `schemas/types.schema.json` - Entity/field definitions
- `schemas/roles.schema.json` - Role/permission definitions
- `validators/index.js` - Validation logic
- `prompts/radish-schema-generation.md` - AI prompt template

### Configuration Files
- `package.json` - Version, dependencies, publishConfig
- `.gitlab-ci.yml` - CI/CD pipeline
- `.npmignore` - Files excluded from npm package

## Integration Points

### radish-cli Integration
Location: `/Users/ctmeece/Projects/radish-cli`

**Usage:**
- `src/commands/validate.mjs` - Validates blueprint files
- `src/commands/schema.mjs` - Displays schema info
- `src/generators/*` - May use schemas for validation during generation

**Migration Status:** Not yet migrated (still using local schemas)

### radish-wizard Integration
Location: `/Users/ctmeece/Projects/radish-cli/wizard`

**Usage:**
- `src/routes/+page.server.ts` - Validates AI-generated blueprints
- AI generation flow - Uses prompt template
- Real-time validation - Validates as user generates

**Migration Status:** Not yet migrated (still using local schemas/prompts)

## Related Documentation

- **README.md** - Package usage and API reference
- **SETUP.md** - GitLab publishing setup
- **MIGRATION.md** - Guide for migrating radish-cli/wizard to use this package
- **AI_CONTEXT.md** - Additional context for AI assistants

## Troubleshooting

### Tests Fail
- Check if schemas have valid JSON syntax
- Verify test data matches schema requirements
- Check for missing dependencies: `npm install`

### Publishing Fails
- Verify GitLab token has `api` and `write_repository` scopes
- Check package.json publishConfig matches GitLab project
- Ensure version number is incremented

### Consumers Can't Install
- Verify package is published: Check GitLab Package Registry
- Check consumer's npm config has correct @radish registry
- Verify consumer's GitLab token has `read_api` scope

## Project Organization

- **Production code**: `schemas/`, `validators/`, `prompts/`
- **Tests**: `test.js`
- **Documentation**: `README.md`, `SETUP.md`, `MIGRATION.md`, `CLAUDE.md`, `AI_CONTEXT.md`
- **CI/CD**: `.gitlab-ci.yml`
- **Config**: `package.json`, `.npmignore`, `.gitignore`
