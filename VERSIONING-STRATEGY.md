# Versioning Strategy for @radish/schemas and radish-cli

## Core Principle

**Treat @radish/schemas as a contract package, not just a utility package.**

Version changes must reflect whether existing Radish tools and blueprints will continue to work.

---

## Two-Version System

We maintain **two distinct versions**:

### 1. Package Version (npm semver)
- **Format**: `@radish/schemas@X.Y.Z`
- **Purpose**: Tracks the npm package evolution
- **Follows**: Standard semantic versioning

### 2. Blueprint Spec Version
- **Format**: `version: N` (in blueprint YAML)
- **Purpose**: Tracks the blueprint file format itself
- **Changes**: Only when author-facing schema format changes

### Example
```
@radish/schemas@1.4.2  ← package version
  supports blueprint spec version: 1  ← spec version
```

**Why separate?**
- Package may have multiple releases without changing blueprint spec
- Validator fixes, prompt improvements, docs updates don't break blueprints
- Clear signal to users when migration is required

---

## Semantic Versioning Rules for Package

### Major Version (X.0.0)

**Bump when breaking:**
- Existing blueprint files
- radish-cli validation behavior
- Generated code assumptions
- Prompt-template expectations tied to schema shape

**Examples:**
- Renaming a required property
- Removing a supported field type
- Changing validation semantics in a breaking way
- Changing output structure expected by consumers

### Minor Version (X.Y.0)

**Bump when adding backward-compatible capability:**

**Examples:**
- New optional schema fields
- New supported enum/type options
- New helper validators
- New prompt helpers
- New exports that don't break existing imports

### Patch Version (X.Y.Z)

**Bump for:**
- Bug fixes
- Typo fixes
- Stricter validation that does NOT break valid existing inputs
- README/docs fixes
- Internal refactors with no contract impact

---

## Blueprint Spec Version Rules

### When to Bump Spec Version

**Only bump when blueprint authors must change what they write.**

**Examples requiring bump:**
- Field syntax changes
- Entity structure changes
- Relationship syntax changes
- Auth/role syntax changes
- Default semantics change in a breaking way

### When NOT to Bump Spec Version

**Do not bump for:**
- Validator refactors
- Prompt improvements
- Documentation improvements
- Internal package restructuring
- New optional features that don't affect existing blueprints

---

## Compatibility Model

### Exported Metadata

In `@radish/schemas/index.js`:

```javascript
export const VERSIONING = {
  packageVersion: '1.4.2',           // from package.json
  currentSpecVersion: 1,             // current blueprint format
  supportedSpecVersions: [1],        // all supported formats
  minCliVersion: '0.1.0'             // minimum compatible CLI version
};
```

### Usage in radish-cli

```javascript
import { VERSIONING } from '@radish/schemas';

// Validate compatibility
if (!VERSIONING.supportedSpecVersions.includes(blueprintSpecVersion)) {
  throw new Error(
    `Blueprint spec version ${blueprintSpecVersion} is not supported. ` +
    `Supported versions: ${VERSIONING.supportedSpecVersions.join(', ')}`
  );
}
```

---

## Dependency Management

### radish-cli → @radish/schemas

**Early stage (now):**
- Use **exact** or **tightly pinned** versions
- Example: `"@radish/schemas": "1.4.2"` or `"@radish/schemas": "~1.4.0"`

**Reasoning:**
- Ecosystem is still moving fast
- Schema drift will be painful
- Generator + validator + prompts need to stay aligned

**Later (when stable):**
- Can loosen to caret ranges: `"@radish/schemas": "^1.4.0"`
- Only after API stabilizes

### Package Version Alignment

**Rule of thumb:**
- Package major version roughly tracks spec major version
- `@radish/schemas@1.x` → supports blueprint spec version 1
- `@radish/schemas@2.x` → supports blueprint spec version 2
- Minor/patch versions evolve within the same blueprint family

---

## Compatibility Policy

### Official Policy Statement

```
COMPATIBILITY POLICY

1. @radish/schemas may evolve internally without changing blueprint spec version
2. Blueprint spec version changes ONLY when author-facing schema format changes materially
3. radish-cli MUST declare which blueprint spec versions it supports
4. Breaking changes to blueprint format require:
   - Spec version bump
   - Package major version bump
   - Migration guide documentation
   - Deprecation warnings (when possible)
```

### Support Window

**Current (v1.x):**
- All `1.x` releases support blueprint spec version 1
- First incompatible blueprint format becomes spec version 2
- Spec version 2 triggers package `2.0.0`

**Future:**
- May support multiple spec versions simultaneously
- Example: `@radish/schemas@2.3.0` might support spec versions `[1, 2]`
- Allows gradual migration

---

## Release Checklist

Before every release of `@radish/schemas`, answer:

### 1. Does this break existing consumers of the package?
- If YES → Major version bump

### 2. Does this break existing blueprint files?
- If YES → Spec version bump + Major version bump
- Document migration path

### 3. Does this add new features?
- If backward-compatible → Minor version bump

### 4. Is this just a fix/docs update?
- Patch version bump

---

## Changelog Structure

Use structured changelog with these categories:

```markdown
## [1.4.2] - 2026-03-13

### Added
- New optional `computed` field type

### Changed
- Improved validation error messages

### Fixed
- Bug in nested relationship validation

### Spec Impact
- None - fully backward compatible

### Migration Required
- No migration needed
```

**Key category: "Spec Impact"**
- Explicitly state whether blueprint authors need to take action
- Not every package change affects blueprint files

---

## Migration Strategy (Future)

### When Spec Version Changes

**Prepare for spec version 2:**

1. **Migration helpers** in `@radish/schemas`
   ```javascript
   export function migrateV1toV2(blueprintV1) {
     // Transform blueprint from v1 to v2 format
   }
   ```

2. **CLI migration command**
   ```bash
   radish-cli migrate --from 1 --to 2
   ```

3. **Deprecation warnings**
   - Warn users when using spec v1 features that will be removed in v2
   - Provide clear upgrade path

4. **Backward compatibility period**
   - Support both spec v1 and v2 for at least one major version
   - Example: `@radish/schemas@2.x` supports `[1, 2]`
   - `@radish/schemas@3.x` drops v1 support

### Migration Documentation

For each spec version bump, provide:
- **MIGRATION.md** - Step-by-step upgrade guide
- **CHANGELOG.md** - Complete list of breaking changes
- **Examples** - Before/after blueprint comparisons

---

## Practical First Strategy (Current Implementation)

### Phase 1: Initial Stabilization (Now)

```
@radish/schemas: 1.x
Blueprint spec: version 1
radish-cli: pins @radish/schemas exactly
```

**Rules:**
- All `1.x` package releases support blueprint spec version 1
- Minor/patch versions for improvements within spec v1
- Tight version pinning in radish-cli

### Phase 2: First Breaking Change

```
@radish/schemas: 2.0.0
Blueprint spec: version 2
radish-cli: supports both v1 and v2, pins @radish/schemas@^2.0.0
```

**Includes:**
- Migration tooling
- Support for both spec versions
- Deprecation warnings for v1

### Phase 3: Mature Ecosystem

```
@radish/schemas: 3.x
Blueprint spec: version 3 (v1 deprecated, v2 supported)
radish-cli: looser version ranges
```

**Allows:**
- More flexible dependency ranges
- Multi-version spec support
- Gradual migration paths

---

## Decision Framework

### "Should I bump spec version?"

Ask this question:
**"Do existing blueprint YAML files need to change?"**

- **YES** → Spec version bump required
- **NO** → Package version bump only

### "What package version should I use?"

| Change Type | Breaks Blueprints? | Package Version | Spec Version |
|-------------|-------------------|-----------------|--------------|
| New optional field | No | Minor (1.Y.0) | Same (1) |
| Rename required field | Yes | Major (2.0.0) | Bump (2) |
| Fix validator bug | No | Patch (1.0.Z) | Same (1) |
| New field type | No* | Minor (1.Y.0) | Same (1) |
| Remove field type | Yes | Major (2.0.0) | Bump (2) |
| Improve docs | No | Patch (1.0.Z) | Same (1) |

*If truly optional and doesn't break existing usage

---

## Communication Strategy

### For Users (Blueprint Authors)

**Focus on spec version:**
- "Your blueprints use spec version 1"
- "This update requires blueprint spec version 2"
- "Migration guide: docs/migrations/v1-to-v2.md"

### For Integrators (radish-cli, tools)

**Focus on package version:**
- "Requires @radish/schemas@^2.0.0"
- "Breaking changes in API exports"
- "See CHANGELOG.md for details"

### Version Badge in README

```markdown
## Version Compatibility

- Package: `@radish/schemas@1.4.2`
- Blueprint Spec: `version: 1`
- Compatible CLI: `radish-cli@>=0.1.0`
```

---

## Implementation Checklist

### Immediate (Next Release)

- [ ] Add `VERSIONING` export to `@radish/schemas/index.js`
- [ ] Update `package.json` with exact version
- [ ] Add spec version to all example blueprints
- [ ] Document compatibility policy in README
- [ ] Add "Spec Impact" section to CHANGELOG template

### Short Term (Next Month)

- [ ] Implement spec version validation in radish-cli
- [ ] Add compatibility check to `validate` command
- [ ] Create MIGRATION.md template for future use
- [ ] Add deprecation warning helpers

### Long Term (When Needed)

- [ ] Build `radish-cli migrate` command
- [ ] Implement multi-version spec support
- [ ] Create automated migration testing
- [ ] Establish LTS (Long Term Support) policy for older spec versions

---

## Summary

**The simplest good model:**

1. `@radish/schemas@1.x` supports blueprint `version: 1`
2. Breaking blueprint format changes become `@radish/schemas@2.0.0` and blueprint `version: 2`
3. Package can evolve within major version without breaking blueprints
4. Spec version is the contract; package version is the implementation

This approach will scale well as the ecosystem grows.
