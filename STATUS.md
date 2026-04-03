# @radish/schemas - Current Status

## Package Info

- **Name:** `@radish/schemas`
- **Version:** 1.4.0
- **Registry:** GitLab private npm registry (project ID: 6)
- **Instance:** gitlab.mini1.abeedoo.com
- **Blueprint Format:** JSON (source of truth), YAML (display only)
- **Validation Service:** https://schemas.radishplatform.com

## Published Versions

- **v1.0.0** - Initial release (types, roles schemas)
- **v1.1.0** - VERSIONING metadata, required version field, raw JSON exports
- **v1.2.0** - App schema, JSON-first pipeline, validateFromJSON, toYAML
- **v1.3.0** - JSON-first prompts, buildPrompt aligned to blueprint types
- **v1.3.1** - Split types/roles into separate prompts
- **v1.3.2** - Allow hyphens in permission names
- **v1.3.3** - Accept camelCase in permission names
- **v1.4.0** - Standalone Fastify validation service

## Completed

- [x] Package structure and module system
- [x] types.schema.json - Data layer entity/field schema
- [x] roles.schema.json - Roles and permissions schema
- [x] app.schema.json - Application blueprint schema
- [x] AJV validators (validateBlueprint, validateFromJSON, formatValidationErrors)
- [x] toYAML display utility (zero dependencies)
- [x] Separate AI prompt templates (app, types, roles)
- [x] buildPrompt() with extensible type system (app, types, roles)
- [x] VERSIONING metadata export
- [x] Two-version system (package version + blueprint spec version)
- [x] GitLab CI/CD automated publishing
- [x] Deploy token for consumer authentication
- [x] Tests (10 tests, all passing)
- [x] JSON-first pipeline (YAML removed as dependency)
- [x] Standalone Fastify validation service
- [x] Validation service deployed to schemas.radishplatform.com
- [x] Service endpoints: /validate, /validate/json, /schemas, /prompts, /to-yaml, /health
- [x] Documentation (README, SETUP, MIGRATION, VERSIONING-STRATEGY)
- [x] UI Layer strategy document

## Next Steps

### Short Term
- [ ] Create ui.schema.json for UI Layer blueprints
- [ ] Create UI Layer AI prompt template
- [ ] Add /prompts/ui endpoint to validation service

### Medium Term
- [ ] Implement spec version compatibility checking in @radish/cli
- [ ] Add component schema for reusable UI components
- [ ] Add view modes to data layer schema (Drupal-inspired)

### Long Term
- [ ] Multi-version spec support
- [ ] Migration tooling for spec version upgrades
- [ ] Regen-safe customization strategy

## Consumer Projects

| Project | Consumes Via | Status |
|---------|-------------|--------|
| @radish/cli | npm package | @radish/schemas@^1.4.0 |
| @radish/wizard | npm package | @radish/schemas@^1.4.0 |
| n8n workflows | HTTP service | schemas.radishplatform.com |

## Testing

```bash
node test.js  # Run all 10 validation tests
npm start     # Start validation service locally on :3000
```
