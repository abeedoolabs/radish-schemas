# Setup Guide for @radish/schemas

## GitLab Package Registry

### Registry Details

- **Instance:** `gitlab.mini1.abeedoo.com`
- **Project ID:** `6`
- **Registry URL:** `https://gitlab.mini1.abeedoo.com/api/v4/projects/6/packages/npm/`

### Authentication

A deploy token is used for read access to the registry:

```bash
# Configure npm for @radish scope
npm config set @radish:registry https://gitlab.mini1.abeedoo.com/api/v4/projects/6/packages/npm/
npm config set //gitlab.mini1.abeedoo.com/api/v4/projects/6/packages/npm/:_authToken YOUR_DEPLOY_TOKEN
```

### Publishing

Publishing is automated via GitLab CI/CD. To publish a new version:

```bash
# 1. Make changes on dev branch
# 2. Merge to main
# 3. Tag a release
git tag v1.2.0
git push origin v1.2.0
# GitLab CI publishes automatically
```

Manual publishing (if needed):

```bash
npm version patch  # or minor/major
npm publish
```

## Using in Other Projects

### @radish/cli

```bash
cd /Users/ctmeece/Projects/radish-cli
npm install @radish/schemas
```

```javascript
import { validateBlueprint, validateFromJSON, formatValidationErrors } from '@radish/schemas';
import { buildPrompt } from '@radish/schemas/prompts';

// Validate a parsed blueprint object
const result = validateBlueprint(data, 'types');

// Parse and validate a JSON string (e.g., AI output)
const result = validateFromJSON(jsonString, 'app');

// Build an AI prompt
const prompt = buildPrompt('app', 'A blog with posts and comments');
```

### @radish/wizard

```bash
cd /Users/ctmeece/Projects/radish-wizard
npm install @radish/schemas
```

```javascript
import { validateFromJSON, toYAML } from '@radish/schemas';
import { buildPrompt } from '@radish/schemas/prompts';

// Build prompt for AI
const prompt = buildPrompt('types', userDescription);

// Validate AI response
const result = validateFromJSON(aiResponse, 'types');

// Display as YAML for human readability
const yamlView = toYAML(result.data);
```

## Version Management

Use semantic versioning (see [VERSIONING-STRATEGY.md](./VERSIONING-STRATEGY.md)):

- **Patch** (1.0.1): Bug fixes, no breaking changes
- **Minor** (1.1.0): New features, backward compatible
- **Major** (2.0.0): Breaking changes to blueprint format

```bash
npm version patch  # 1.2.0 -> 1.2.1
npm version minor  # 1.2.0 -> 1.3.0
npm version major  # 1.2.0 -> 2.0.0
```

## Development Workflow

1. Create feature branch from `dev`
2. Make changes to schemas/validators/prompts
3. Run tests: `node test.js`
4. Commit and push to feature branch
5. Merge to `dev` for integration testing
6. Merge `dev` to `main` for release
7. Tag version: `git tag v1.x.0 && git push origin v1.x.0`
8. GitLab CI publishes automatically
9. Update consumers: `npm update @radish/schemas`
