# @radish/schemas - Current Status

## Package Info

- **Name:** `@radish/schemas`
- **Version:** 1.2.0
- **Registry:** GitLab private npm registry (project ID: 6)
- **Instance:** gitlab.mini1.abeedoo.com
- **Blueprint Format:** JSON (source of truth), YAML (display only)

## Published Versions

- **v1.0.0** - Initial release (types, roles schemas)
- **v1.1.0** - VERSIONING metadata, required version field, raw JSON exports
- **v1.2.0** - App schema, JSON-first pipeline, validateFromJSON, toYAML, prompt updates

## Completed

- [x] Package structure and module system
- [x] types.schema.json - Data layer entity/field schema
- [x] roles.schema.json - Roles and permissions schema
- [x] app.schema.json - Application blueprint schema
- [x] AJV validators (validateBlueprint, validateFromJSON, formatValidationErrors)
- [x] toYAML display utility (zero dependencies)
- [x] AI prompt templates (types/roles and app)
- [x] buildPrompt() with extensible type system (app, types, roles)
- [x] VERSIONING metadata export
- [x] Two-version system (package version + blueprint spec version)
- [x] GitLab CI/CD automated publishing
- [x] Deploy token for consumer authentication
- [x] Tests (10 tests, all passing)
- [x] JSON-first pipeline (YAML removed as dependency)
- [x] Documentation (README, SETUP, MIGRATION, VERSIONING-STRATEGY)
- [x] UI Layer strategy document

## Next Steps

### Short Term
- [ ] Migrate @radish/cli to use @radish/schemas@1.2.0
- [ ] Migrate @radish/wizard to use @radish/schemas@1.2.0
- [ ] Create ui.schema.json for UI Layer blueprints
- [ ] Create UI Layer AI prompt template

### Medium Term
- [ ] Implement spec version compatibility checking in radish-cli
- [ ] Add component schema for reusable UI components
- [ ] Add view modes to data layer schema (Drupal-inspired)

### Long Term
- [ ] Multi-version spec support
- [ ] Migration tooling for spec version upgrades
- [ ] Regen-safe customization strategy

## Consumer Projects

| Project | Package | Status |
|---------|---------|--------|
| @radish/cli | @radish/schemas | Dependency added, migration in progress |
| @radish/wizard | @radish/schemas | Dependency added, migration in progress |

## Testing

```bash
node test.js  # Run all 10 validation tests
```
