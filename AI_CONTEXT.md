# AI Context - @radish/schemas

## What This Package Is

A shared npm package that extracts JSON schemas, validators, and AI prompts from the Radish CLI ecosystem. Previously these files were duplicated across `radish-cli` and `radish-wizard`, causing maintenance issues and version drift.

## Why It Exists

**Problem:** radish-cli and radish-wizard both need:
1. JSON schemas to validate blueprint YAML files
2. AJV validators to check schema compliance
3. AI prompts to generate blueprints from natural language

**Before:** These files were duplicated in both projects, leading to:
- Schema changes required updates in two places
- Validation logic could drift between projects
- No versioning of schemas

**After:** Single package published to private GitLab npm registry:
- Update once, use everywhere
- Semantic versioning for schema changes
- Independent release cycle from CLI/wizard

## Current State

**Status:** ✅ Package created, not yet published or consumed

**Completed:**
- ✅ Package structure created
- ✅ Schemas copied from radish-cli
- ✅ Validators module created with AJV
- ✅ Prompts module created
- ✅ Tests written and passing
- ✅ GitLab CI/CD configured
- ✅ Documentation written (README, SETUP, MIGRATION)
- ✅ Git repository initialized and committed

**Next Steps:**
1. Push to GitLab
2. Configure GitLab project ID and registry URL
3. Publish first version (v1.0.0)
4. Migrate radish-cli to use this package
5. Migrate radish-wizard to use this package

## Design Decisions

### Why npm Package Instead of Git Submodule?

**Git Submodule Approach:**
- ❌ Requires `git submodule update` dance
- ❌ Easy to get submodules out of sync
- ❌ No versioning - always uses HEAD
- ❌ Doesn't work well with npm install

**npm Package Approach:**
- ✅ Standard dependency management
- ✅ Semantic versioning
- ✅ Lock to specific versions
- ✅ Works with npm install workflows
- ✅ Can publish breaking changes safely

### Why Private GitLab Registry Instead of Public npm?

- Radish CLI is private/internal tooling
- GitLab registry already available
- No need for public npm account
- Keep everything in GitLab ecosystem

### Module Structure

**Separate index files per directory:**
```
schemas/index.js    - Exports schemas
validators/index.js - Exports validators
prompts/index.js    - Exports prompts
index.js            - Re-exports everything
```

**Benefits:**
- Tree-shaking support: `import { typesSchema } from '@radish/schemas/schemas'`
- Partial imports: `import { validateBlueprint } from '@radish/schemas/validators'`
- Clear separation of concerns

### Validation Approach

**Uses AJV (Another JSON Validator):**
- Industry standard for JSON Schema validation
- Fast and widely used
- Same library already used by radish-cli

**Wrapper Functions:**
```javascript
validateBlueprint(data, type) // Returns { valid, errors }
formatValidationErrors(errors) // Formats AJV errors for display
```

**Benefits:**
- Consumer doesn't need to know AJV
- Consistent error formatting
- Can swap validator implementation later

## Schema Details

### types.schema.json

Defines the structure of blueprint YAML files for entities:

**Key Sections:**
- `version`: Schema version (currently 1)
- `defaults`: Default settings for all entities
- `entities`: Object of entity definitions
  - Each entity has: `plural`, `fields`, `filters`, `indexes`, `relationships`, etc.
  - Fields have: `type`, `required`, `default`, `unique`, etc.

**Supported Field Types:**
```
string, int, float, boolean, any, url, isoDate, objectId, enum, object,
string[], int[], float[], boolean[], objectId[], array,
secretKey, encryptedKey
```

### roles.schema.json

Defines roles and permissions:

**Key Sections:**
- `version`: Schema version
- `roles`: Object of role definitions
  - Each role has: `description`, `permissions`
  - Permissions format: `entity:action` (e.g., `user:create`)

## AI Prompt Template

**File:** `prompts/radish-schema-generation.md`

**Purpose:** System prompt for LLMs to generate blueprint YAML from natural language

**Key Sections:**
1. Role definition (data modeling expert)
2. Output format requirements (JSON with types/roles)
3. Blueprint structure explanation
4. Entity modeling guidelines
5. Field type reference
6. Relationship patterns
7. Common mistakes to avoid
8. Examples

**Usage in radish-wizard:**
```javascript
import { getSchemaPrompt } from '@radish/schemas/prompts';

const systemPrompt = getSchemaPrompt();
const userPrompt = "Build a blog with posts and comments";

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]
});
```

## Testing Strategy

**Current Tests (test.js):**
1. Valid blueprint validation (should pass)
2. Invalid blueprint validation (should fail with specific error)
3. Schema loading (schemas should load without errors)

**Test Approach:**
- Simple node script, no test framework
- Just validates core functionality works
- Easy to run: `node test.js`

**Future Test Improvements:**
- Add more edge cases
- Test all field types
- Test relationship validation
- Test enum validation
- Test required field validation

## Version History

- **v1.0.0** (planned) - Initial release
  - types.schema.json (from radish-cli)
  - roles.schema.json (from radish-cli)
  - AJV validators
  - AI prompt template

## Migration Impact

### For radish-cli

**Before:**
```javascript
import typesSchema from './schemas/types.schema.json';
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(typesSchema);

if (!validate(data)) {
  console.error('Validation errors:', validate.errors);
}
```

**After:**
```javascript
import { validateBlueprint, formatValidationErrors } from '@radish/schemas';

const result = validateBlueprint(data, 'types');
if (!result.valid) {
  console.error('Validation errors:', formatValidationErrors(result.errors));
}
```

**Changes Required:**
- Add `@radish/schemas` to package.json dependencies
- Update imports in `src/commands/validate.mjs`
- Update imports in any other files using schemas
- Can delete `schemas/` directory after migration

### For radish-wizard

**Before:**
```javascript
// Load schema
const typesSchema = JSON.parse(
  readFileSync('../../schemas/types.schema.json', 'utf-8')
);

// Load prompt
const prompt = readFileSync('src/prompts/radish-schema-generation.md', 'utf-8');

// Validate with AJV
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(typesSchema);
```

**After:**
```javascript
import { validateBlueprint } from '@radish/schemas';
import { getSchemaPrompt } from '@radish/schemas/prompts';

const result = validateBlueprint(data, 'types');
const prompt = getSchemaPrompt();
```

**Changes Required:**
- Add `@radish/schemas` to wizard/package.json
- Update `src/routes/+page.server.ts` validation
- Remove `src/prompts/radish-schema-generation.md`
- Update prompt loading logic

## Common Pitfalls

### Schema Changes Are Breaking

If you modify the schema structure (rename fields, change types, remove fields):
- This is a **MAJOR** version bump (2.0.0)
- Requires coordinated update of consumers
- Need migration guide for users

**Safe Changes (minor/patch):**
- Adding optional fields
- Adding new enum values
- Loosening validation (making fields optional)
- Fixing typos in descriptions

**Breaking Changes (major):**
- Renaming fields
- Changing field types
- Making optional fields required
- Removing enum values
- Changing validation rules

### Don't Forget to Update Prompt

If schemas change significantly, the AI prompt template needs to match:
- Update examples in prompt
- Update field type reference
- Update common mistakes section

### Circular Dependencies

Don't import from consumer projects:
- ❌ @radish/schemas imports from radish-cli
- ✅ radish-cli imports from @radish/schemas

This package should have no dependencies on radish-cli or radish-wizard.

## Dependencies

**Production:**
- `ajv@^8.12.0` - JSON Schema validator
- `ajv-formats@^2.1.1` - Additional AJV format validators
- `yaml@^2.5.0` - YAML parser (for potential future use)

**None:** No dev dependencies needed (simple project)

**Peer Dependencies:** None (self-contained)

## File Locations Reference

### In This Package
- Schemas: `/Users/ctmeece/Projects/radish-schemas/schemas/`
- Validators: `/Users/ctmeece/Projects/radish-schemas/validators/`
- Prompts: `/Users/ctmeece/Projects/radish-schemas/prompts/`

### In Consumer Projects
- radish-cli: `/Users/ctmeece/Projects/radish-cli/`
  - Current schemas: `schemas/*.json` (will be deleted after migration)
  - Validate command: `src/commands/validate.mjs`

- radish-wizard: `/Users/ctmeece/Projects/radish-cli/wizard/`
  - Current prompt: `src/prompts/radish-schema-generation.md` (will be deleted)
  - Validation: `src/routes/+page.server.ts`

## Quick Command Reference

```bash
# Development
node test.js                          # Run tests
npm pack                              # Create tarball for local testing

# Publishing
npm version patch                     # Bump version (1.0.0 → 1.0.1)
git push --follow-tags                # Push and trigger CI publish

# Installation in consumers
npm install @radish/schemas           # Install latest
npm install @radish/schemas@1.0.0     # Install specific version
npm update @radish/schemas            # Update to latest compatible

# Local testing in consumers
npm install ../radish-schemas/radish-schemas-1.0.0.tgz
```
