# Migration Guide

## YAML to JSON Migration

As of v1.2.0, Radish uses **JSON as the source of truth** for all blueprint files. YAML is available only as a display utility.

### What Changed

| Before | After |
|--------|-------|
| `.types.yml` | `.types.json` |
| `.roles.yml` | `.roles.json` |
| `.app.yml` | `.app.json` |
| AI returns YAML strings in JSON | AI returns raw JSON objects |
| `yaml` dependency required | No YAML dependency |
| `buildPrompt(description, schema)` | `buildPrompt('types', description)` |

### Code Changes

**Validation:**
```javascript
// Before
import yaml from 'yaml';
const data = yaml.parse(readFileSync('types.yml', 'utf8'));
const result = validateBlueprint(data, 'types');

// After
const data = JSON.parse(readFileSync('types.json', 'utf8'));
const result = validateBlueprint(data, 'types');

// Or validate from raw JSON string in one step
const result = validateFromJSON(readFileSync('types.json', 'utf8'), 'types');
```

**AI Prompt Building:**
```javascript
// Before
import { buildPrompt } from '@radish/schemas/prompts';
const prompt = buildPrompt(description, schema);

// After
const prompt = buildPrompt('types', description);
const appPrompt = buildPrompt('app', description);
```

**Display as YAML (optional):**
```javascript
import { toYAML } from '@radish/schemas';
const yamlView = toYAML(blueprintData);
```

## For @radish/cli

### Install

```bash
npm install @radish/schemas@^1.2.0
```

### Update Validation

```javascript
// Before
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import typesSchema from '../schemas/types.schema.json';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(typesSchema);

// After
import { validateBlueprint, formatValidationErrors } from '@radish/schemas';

const result = validateBlueprint(blueprintData, 'types');
if (!result.valid) {
  console.error(formatValidationErrors(result.errors));
}
```

### Update Schema Imports

```javascript
// Before
import typesSchema from './schemas/types.schema.json';
import rolesSchema from './schemas/roles.schema.json';

// After
import { typesSchema, rolesSchema, appSchema } from '@radish/schemas';
```

### Update AI Generation

```javascript
// Before
import { readFileSync } from 'fs';
const prompt = readFileSync('prompts/radish-schema-generation.md', 'utf-8');

// After
import { buildPrompt } from '@radish/schemas/prompts';
const prompt = buildPrompt('types', userDescription);
const appPrompt = buildPrompt('app', userDescription);
```

### Update Blueprint File Handling

```javascript
// Before - reading YAML files
import yaml from 'yaml';
const blueprint = yaml.parse(readFileSync('types.yml', 'utf8'));

// After - reading JSON files
const blueprint = JSON.parse(readFileSync('types.json', 'utf8'));
```

## For @radish/wizard

### Install

```bash
npm install @radish/schemas@^1.2.0
```

### Update Validation

```javascript
// Before
import Ajv from 'ajv';
import typesSchema from '../../schemas/types.schema.json';

const ajv = new Ajv({ allErrors: true, strict: false });
const validateTypes = ajv.compile(typesSchema);

// After
import { validateFromJSON, formatValidationErrors } from '@radish/schemas';

// Validate AI-generated JSON directly
const result = validateFromJSON(aiResponseString, 'types');
if (!result.valid) {
  return { error: formatValidationErrors(result.errors) };
}
const validatedData = result.data;
```

### Update Prompt Loading

```javascript
// Before
import { readFileSync } from 'fs';
const promptTemplate = readFileSync('src/prompts/radish-schema-generation.md', 'utf-8');

// After
import { buildPrompt } from '@radish/schemas/prompts';
const prompt = buildPrompt('app', userDescription);
```

## Testing After Migration

```bash
# Test validation
node -e "
import { validateFromJSON } from '@radish/schemas';
const result = validateFromJSON('{\"version\":1,\"app\":{\"name\":\"Test\",\"description\":\"Test app\"}}', 'app');
console.log(result.valid ? 'OK' : 'FAIL');
"

# Test prompts
node -e "
import { buildPrompt } from '@radish/schemas/prompts';
const prompt = buildPrompt('app', 'A blog');
console.log(prompt.substring(0, 100));
"
```

## Rollback

If something breaks, pin to the previous version:

```bash
npm install @radish/schemas@1.1.0
```
