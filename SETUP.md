# Setup Guide for @radish/schemas

## Publishing to GitLab Package Registry

### 1. Update package.json with your GitLab info

```json
{
  "publishConfig": {
    "@radish:registry": "https://gitlab.your-domain.com/api/v4/projects/YOUR_PROJECT_ID/packages/npm/"
  }
}
```

Replace:
- `gitlab.your-domain.com` with your GitLab instance URL
- `YOUR_PROJECT_ID` with your GitLab project ID

### 2. Create GitLab Personal Access Token

1. Go to GitLab → Settings → Access Tokens
2. Create token with scopes: `api`, `read_api`, `write_repository`
3. Save the token

### 3. Configure npm for Publishing

```bash
# Set registry for @radish scope
npm config set @radish:registry https://gitlab.your-domain.com/api/v4/projects/YOUR_PROJECT_ID/packages/npm/

# Set auth token
npm config set //gitlab.your-domain.com/api/v4/projects/YOUR_PROJECT_ID/packages/npm/:_authToken YOUR_TOKEN
```

### 4. Manual Publishing

```bash
# Update version
npm version patch  # or minor/major

# Publish
npm publish
```

### 5. Automated Publishing with GitLab CI

The `.gitlab-ci.yml` is already configured. To trigger:

```bash
# Tag a release
git tag v1.0.0
git push origin v1.0.0
```

GitLab CI will automatically publish when you push a tag.

## Using in Other Projects

### radish-cli

```bash
cd /Users/ctmeece/Projects/radish-cli
npm install @radish/schemas
```

Update imports:
```javascript
// Before
import typesSchema from './schemas/types.schema.json';

// After
import { typesSchema } from '@radish/schemas';
```

### radish-wizard

```bash
cd /Users/ctmeece/Projects/radish-cli/wizard
npm install @radish/schemas
```

Update imports:
```javascript
// Before
import { readFileSync } from 'fs';
const typesSchema = JSON.parse(readFileSync('../../schemas/types.schema.json'));

// After
import { typesSchema, validateBlueprint } from '@radish/schemas';
```

## Version Management

Use semantic versioning:

- **Patch** (1.0.1): Bug fixes, no breaking changes
- **Minor** (1.1.0): New features, backward compatible
- **Major** (2.0.0): Breaking changes

```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.1 → 1.1.0
npm version major  # 1.1.0 → 2.0.0
```

## Development Workflow

1. Make changes to schemas/validators/prompts
2. Run test: `node test.js`
3. Commit changes: `git commit -am "Update schema"`
4. Bump version: `npm version patch`
5. Push tag: `git push --follow-tags`
6. GitLab CI publishes automatically
7. Update radish-cli and radish-wizard: `npm update @radish/schemas`
