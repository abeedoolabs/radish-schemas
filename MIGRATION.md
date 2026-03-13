# Migration Guide: Using @radish/schemas in Existing Projects

## Overview

This package extracts shared schemas, validators, and prompts that were previously duplicated across `radish-cli` and `wizard`.

## For radish-cli

### 1. Install the package

```bash
cd /Users/ctmeece/Projects/radish-cli
npm install @radish/schemas
```

### 2. Update validate command

**Before:**
```javascript
// src/commands/validate.mjs
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import typesSchema from '../schemas/types.schema.json';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(typesSchema);
```

**After:**
```javascript
// src/commands/validate.mjs
import { validateBlueprint, formatValidationErrors } from '@radish/schemas';

const result = validateBlueprint(blueprintData, 'types');
if (!result.valid) {
  console.error(formatValidationErrors(result.errors));
}
```

### 3. Update any schema imports

**Before:**
```javascript
import typesSchema from './schemas/types.schema.json';
import rolesSchema from './schemas/roles.schema.json';
```

**After:**
```javascript
import { typesSchema, rolesSchema } from '@radish/schemas';
```

### 4. Remove local schemas directory (optional)

After confirming everything works:
```bash
git rm -r schemas/
```

## For radish-wizard

### 1. Install the package

```bash
cd /Users/ctmeece/Projects/radish-cli/wizard
npm install @radish/schemas
```

### 2. Update server-side validation

**Before:**
```typescript
// src/routes/+page.server.ts
import Ajv from 'ajv';
import typesSchema from '../../schemas/types.schema.json';

const ajv = new Ajv({ allErrors: true, strict: false });
const validateTypes = ajv.compile(typesSchema);
```

**After:**
```typescript
// src/routes/+page.server.ts
import { validateBlueprint, formatValidationErrors } from '@radish/schemas';

const result = validateBlueprint(typesYaml, 'types');
if (!result.valid) {
  return {
    success: false,
    error: formatValidationErrors(result.errors),
    validationErrors: result.errors
  };
}
```

### 3. Update AI prompt loading

**Before:**
```typescript
// src/routes/+page.server.ts
import { readFileSync } from 'fs';
const promptTemplate = readFileSync('src/prompts/radish-schema-generation.md', 'utf-8');
```

**After:**
```typescript
// src/routes/+page.server.ts
import { getSchemaPrompt } from '@radish/schemas/prompts';

const promptTemplate = getSchemaPrompt();
```

### 4. Clean up duplicate files

After confirming everything works:
```bash
# Remove duplicate prompt file
rm src/prompts/radish-schema-generation.md
```

## Testing After Migration

### radish-cli

```bash
cd /Users/ctmeece/Projects/radish-cli

# Test validation command
radish-cli validate /path/to/blueprint.yml

# Test schema command
radish-cli schema types
```

### radish-wizard

```bash
cd /Users/ctmeece/Projects/radish-cli/wizard

# Start wizard
npm run dev

# Test:
# 1. Generate a blueprint
# 2. Verify validation works
# 3. Check for errors in console
```

## Benefits After Migration

✅ **Single source of truth** - Schema updates happen in one place
✅ **Version management** - Can lock to specific schema versions
✅ **Independent updates** - Update schemas without touching CLI/wizard code
✅ **Consistent validation** - Both projects use identical validation logic
✅ **Easier testing** - Test schemas independently
✅ **Smaller repos** - Remove duplicate files

## Rollback Plan

If something breaks:

```bash
# Revert package installation
npm uninstall @radish/schemas

# Restore from git
git checkout -- schemas/
git checkout -- src/commands/validate.mjs
# etc.
```
