# @radish/schemas

Shared JSON schemas, validators, and AI prompts for the Radish CLI ecosystem.

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
import yaml from 'yaml';

const blueprintYaml = yaml.parse(readFileSync('types.yml', 'utf8'));

const result = validateBlueprint(blueprintYaml, 'types');

if (result.valid) {
  console.log('✅ Blueprint is valid');
} else {
  console.error('❌ Validation errors:');
  console.error(formatValidationErrors(result.errors));
}
```

### Getting Schemas

```javascript
import { getSchemas, typesSchema, rolesSchema } from '@radish/schemas';

// Get all schemas
const schemas = getSchemas();
console.log(schemas.types);
console.log(schemas.roles);

// Or import directly
console.log(typesSchema);
console.log(rolesSchema);
```

### AI Prompts

```javascript
import { getSchemaPrompt, buildPrompt } from '@radish/schemas/prompts';

// Get the base prompt template
const template = getSchemaPrompt();

// Build a prompt with user description
const prompt = buildPrompt(
  'A blog platform with posts, comments, and users',
  typesSchema
);

// Use with your AI provider
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: prompt }]
});
```

## Package Structure

```
@radish/schemas/
├── schemas/          # JSON Schema files
│   ├── types.schema.json
│   └── roles.schema.json
├── validators/       # Validation utilities
│   └── index.js
├── prompts/          # AI prompt templates
│   └── radish-schema-generation.md
└── index.js          # Main exports
```

## Version Compatibility

### Current Version

- **Package Version:** `@radish/schemas@1.0.0`
- **Blueprint Spec Version:** `1`
- **Minimum CLI Version:** `radish-cli@0.1.0`

### Compatibility Policy

`@radish/schemas` follows semantic versioning with special consideration for blueprint compatibility:

- **Major version bumps** (e.g., 1.x → 2.x) indicate **breaking changes to blueprint format**
- **Minor version bumps** (e.g., 1.0 → 1.1) add **backward-compatible features**
- **Patch version bumps** (e.g., 1.0.0 → 1.0.1) include **bug fixes and improvements**

**Important:** All `1.x` releases support blueprint spec version `1`. When blueprint format changes in a breaking way, both the package major version and spec version will increment together.

For detailed versioning strategy, see [VERSIONING-STRATEGY.md](./VERSIONING-STRATEGY.md).

### Using VERSIONING Metadata

```javascript
import { VERSIONING } from '@radish/schemas';

console.log(VERSIONING.packageVersion);           // "1.0.0"
console.log(VERSIONING.currentSpecVersion);       // 1
console.log(VERSIONING.supportedSpecVersions);    // [1]
console.log(VERSIONING.minCliVersion);            // "0.1.0"

// Validate compatibility
if (!VERSIONING.supportedSpecVersions.includes(blueprintSpecVersion)) {
  throw new Error(`Blueprint spec version ${blueprintSpecVersion} is not supported`);
}
```

## API Reference

### Validators

#### `validateBlueprint(data, type)`

Validates data against a schema.

- **Parameters:**
  - `data` (any): Parsed YAML/JSON data
  - `type` ('types' | 'roles'): Schema type
- **Returns:** `{ valid: boolean, errors: Array }`

#### `formatValidationErrors(errors)`

Formats AJV errors for display.

- **Parameters:**
  - `errors` (Array): AJV validation errors
- **Returns:** `string` - Formatted error message

#### `getSchemas()`

Gets all schemas.

- **Returns:** `{ types: object, roles: object }`

### Prompts

#### `getSchemaPrompt()`

Gets the AI prompt template.

- **Returns:** `string` - Prompt markdown

#### `buildPrompt(description, schema)`

Builds a complete AI prompt.

- **Parameters:**
  - `description` (string): User's description
  - `schema` (object): JSON schema
- **Returns:** `string` - Complete prompt

## License

MIT
