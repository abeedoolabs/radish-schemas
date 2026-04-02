# @radish/schemas

Shared JSON schemas, validators, and AI prompts for the Radish CLI ecosystem.

**All blueprints use JSON as the source of truth.** YAML rendering is available as a display utility.

## Installation

```bash
npm install @radish/schemas
```

For GitLab private registry:

```bash
npm config set @radish:registry https://your-gitlab.com/api/v4/projects/PROJECT_ID/packages/npm/
npm install @radish/schemas
```

## Usage

### Validating Blueprints

```javascript
import { validateBlueprint, formatValidationErrors } from '@radish/schemas';
import { readFileSync } from 'fs';

const blueprint = JSON.parse(readFileSync('types.json', 'utf8'));

const result = validateBlueprint(blueprint, 'types');

if (result.valid) {
  console.log('Blueprint is valid');
} else {
  console.error(formatValidationErrors(result.errors));
}
```

### Validating from Raw JSON Strings

```javascript
import { validateFromJSON } from '@radish/schemas';

// Parse and validate in one step - useful for AI-generated output
const result = validateFromJSON(aiResponseString, 'app');

if (result.valid) {
  console.log('Valid!', result.data); // Parsed object available
} else {
  console.error(result.errors); // Includes JSON parse errors
}
```

### YAML Display

```javascript
import { toYAML } from '@radish/schemas';

const blueprint = JSON.parse(readFileSync('app.json', 'utf8'));
const yamlView = toYAML(blueprint);
console.log(yamlView);
// version: 1
// app:
//   name: MyApp
//   description: My application
```

### Getting Schemas

```javascript
import { getSchemas, typesSchema, rolesSchema, appSchema } from '@radish/schemas';

// Get all schemas
const schemas = getSchemas();

// Or import directly
console.log(typesSchema);
console.log(rolesSchema);
console.log(appSchema);
```

### AI Prompts

```javascript
import { buildPrompt } from '@radish/schemas/prompts';

// Build a prompt for app blueprint generation
const appPrompt = buildPrompt('app', 'A blog with posts and comments');

// Build a prompt for types/roles generation
const typesPrompt = buildPrompt('types', 'A blog with posts and comments');
```

## Package Structure

```
@radish/schemas/
├── schemas/          # JSON Schema files
│   ├── types.schema.json    # Data layer entities/fields
│   ├── roles.schema.json    # Roles and permissions
│   └── app.schema.json      # Application blueprint
├── validators/       # Validation utilities
│   └── index.js
├── prompts/          # AI prompt templates
│   ├── radish-schema-generation.md   # Types/roles generation
│   └── radish-app-generation.md      # App blueprint generation
└── index.js          # Main exports
```

## Blueprint Types

### types.json
Data layer entity definitions - fields, relationships, indexes, filters.

### roles.json
Role and permission definitions for access control.

### app.json
Application-level blueprint (master document) including:
- **app** - Name, description, domain, tags
- **audience** - User personas (primary, secondary, admin)
- **workflows** - Core user journeys with actors
- **categories** - Content taxonomy
- **style** - Branding and UI hints
- **features** - Feature flags (auth, roles, api, search, etc.)
- **entityOverview** - High-level entity descriptions grouped by domain concern
- **accessPatterns** - Who can do what, by access level
- **database** - Database configuration

## Version Compatibility

### Current Version

- **Package Version:** `@radish/schemas@1.2.0`
- **Blueprint Spec Version:** `1`
- **Minimum CLI Version:** `radish-cli@0.1.0`

### Compatibility Policy

`@radish/schemas` follows semantic versioning with special consideration for blueprint compatibility:

- **Major version bumps** (e.g., 1.x → 2.x) indicate **breaking changes to blueprint format**
- **Minor version bumps** (e.g., 1.0 → 1.1) add **backward-compatible features**
- **Patch version bumps** (e.g., 1.0.0 → 1.0.1) include **bug fixes and improvements**

For detailed versioning strategy, see [VERSIONING-STRATEGY.md](./VERSIONING-STRATEGY.md).

### Using VERSIONING Metadata

```javascript
import { VERSIONING } from '@radish/schemas';

console.log(VERSIONING.packageVersion);           // "1.2.0"
console.log(VERSIONING.currentSpecVersion);       // 1
console.log(VERSIONING.supportedSpecVersions);    // [1]
console.log(VERSIONING.minCliVersion);            // "0.1.0"
```

## API Reference

### Validators

#### `validateBlueprint(data, type)`

Validates a parsed object against a schema.

- **Parameters:**
  - `data` (object): Parsed JSON data
  - `type` ('types' | 'roles' | 'app'): Schema type
- **Returns:** `{ valid: boolean, errors: Array }`

#### `validateFromJSON(jsonString, type)`

Parses a JSON string and validates against a schema.

- **Parameters:**
  - `jsonString` (string): Raw JSON string
  - `type` ('types' | 'roles' | 'app'): Schema type
- **Returns:** `{ valid: boolean, errors: Array, data: object|null }`

#### `toYAML(data)`

Converts a blueprint object to YAML string for display purposes.

- **Parameters:**
  - `data` (object): Blueprint data
- **Returns:** `string` - YAML-formatted string

#### `formatValidationErrors(errors)`

Formats AJV errors for display.

- **Parameters:**
  - `errors` (Array): AJV validation errors
- **Returns:** `string` - Formatted error message

#### `getSchemas()`

Gets all schemas.

- **Returns:** `{ types: object, roles: object, app: object }`

### Prompts

#### `getSchemaPrompt()`

Gets the AI prompt template for types/roles generation.

- **Returns:** `string` - Prompt markdown

#### `getAppPrompt()`

Gets the AI prompt template for app blueprint generation.

- **Returns:** `string` - Prompt markdown

#### `buildPrompt(promptType, description)`

Builds a complete prompt with user description injected.

- **Parameters:**
  - `promptType` ('app' | 'types' | 'roles'): Blueprint type to generate
  - `description` (string): User's app description
- **Returns:** `string` - Complete prompt

#### `getSchemaForPrompt(type)`

Gets a schema as a JSON string for inclusion in prompts.

- **Parameters:**
  - `type` ('types' | 'roles' | 'app'): Schema type
- **Returns:** `string` - Stringified JSON schema

## License

MIT
