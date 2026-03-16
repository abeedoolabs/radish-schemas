# UI Layer Strategy - Version 1 (MVP)

**Created:** 2026-03-13
**Status:** Design Phase
**Target:** Minimal Viable Product

---

## Overview

The UI Layer extends Radish CLI to generate user-facing application pages from high-level declarations. This complements the existing datalayer generator by scaffolding routes, layouts, and content blocks.

### Core Principles

1. **High-level declarations** - Routes, pages, layouts (not pixel-perfect UI)
2. **Metadata-driven** - Leverage existing datalayer entity metadata for forms/tables/displays
3. **Framework-agnostic schema** - SvelteKit generator implementation first
4. **Scaffold, not finish** - Generate functional starting point, expect customization
5. **Defer customization strategy** - Focus on generation first, regen-safety later

---

## MVP Scope

### In Scope (v1)
- **Routes** - URL paths and page mappings
- **Layouts** - Header, navigation, footer structure
- **Content Blocks** - Entity lists, detail views, forms, hero sections
- **Metadata introspection** - Auto-generate UI from datalayer entity definitions

### Out of Scope (Future)
- Regen-safe customization patterns
- View modes (Drupal-style display modes)
- Advanced widgets (rich text, date pickers, etc.)
- State management specifications
- Multi-framework generators (React, Vue)
- Complex filtering/sorting UI

---

## Schema Structure

### File: `ui.yml` (or could be in same file as types/roles)

```yaml
version: 1

# App metadata
app:
  name: "Blog App"
  description: "A simple blog with posts and comments"

# Page routes
routes:
  - path: '/'
    page: 'home'

  - path: '/posts'
    page: 'posts-list'

  - path: '/posts/[id]'
    page: 'post-detail'

  - path: '/posts/create'
    page: 'post-create'

# Pages define layout + content
pages:
  home:
    layout:
      header: true
      navigation: true
      footer: true
    content:
      - type: 'hero'
        title: 'Welcome to {app.name}'
        subtitle: '{app.description}'
      - type: 'entity-list'
        entity: 'Post'
        display: 'preview'
        limit: 5

  posts-list:
    layout:
      header: true
      navigation: true
      footer: true
    content:
      - type: 'entity-list'
        entity: 'Post'
        display: 'table'

  post-detail:
    layout:
      header: true
      navigation: true
      footer: true
    content:
      - type: 'entity-detail'
        entity: 'Post'
      - type: 'entity-list'
        entity: 'Comment'
        filter:
          field: 'post'
          value: '{post.id}'

  post-create:
    layout:
      header: true
      navigation: true
      footer: true
    content:
      - type: 'entity-form'
        entity: 'Post'
        action: 'create'
```

---

## Content Block Types (MVP)

### 1. `hero`
Landing page hero section with title/subtitle.

**Properties:**
- `title` (string, supports interpolation)
- `subtitle` (string, optional)

**Example:**
```yaml
- type: 'hero'
  title: 'Welcome to {app.name}'
  subtitle: 'Build amazing apps'
```

### 2. `entity-list`
Display a list/table of entities. Automatically introspects entity metadata from datalayer.

**Properties:**
- `entity` (string, required) - Entity name from types.yml
- `display` (string) - `table`, `grid`, `preview` (default: `table`)
- `limit` (number, optional) - Max items to display
- `filter` (object, optional) - Filter by field/value

**Example:**
```yaml
- type: 'entity-list'
  entity: 'Post'
  display: 'table'
  limit: 20
```

**Auto-generated from datalayer:**
- Table columns from entity fields
- Field types determine display format
- Pagination (if limit specified)

### 3. `entity-detail`
Display single entity with all fields. Introspects entity metadata.

**Properties:**
- `entity` (string, required) - Entity name

**Example:**
```yaml
- type: 'entity-detail'
  entity: 'Post'
```

**Auto-generated from datalayer:**
- Display all fields
- Field labels from entity field names
- Related entities (based on relationships)

### 4. `entity-form`
Create/edit form for entity. Introspects entity metadata for fields and validation.

**Properties:**
- `entity` (string, required) - Entity name
- `action` (string) - `create`, `edit` (default: `create`)

**Example:**
```yaml
- type: 'entity-form'
  entity: 'Post'
  action: 'create'
```

**Auto-generated from datalayer:**
- Form fields from entity fields
- Required validation from field metadata
- Field types determine input widgets (text, textarea, checkbox, select)

---

## Metadata Introspection

The generator reads entity definitions from `types.yml` to auto-generate UI:

**Datalayer Definition:**
```yaml
Post:
  plural: 'posts'
  fields:
    title: { type: 'string', required: true }
    content: { type: 'string' }
    published: { type: 'boolean', default: false }
    category: { type: 'enum', values: ['tech', 'life', 'food'] }
```

**Auto-generated UI:**
- **Table:** Columns for title, content, published, category
- **Form:**
  - Title: text input (required)
  - Content: textarea
  - Published: checkbox (default: unchecked)
  - Category: select dropdown
- **Detail View:** Display all fields with labels

---

## Layout Structure (MVP)

Keep layouts simple for MVP - just boolean flags:

```yaml
layout:
  header: true      # App header with logo/branding
  navigation: true  # Main navigation menu
  footer: true      # App footer
```

**Generated layout includes:**
- **Header:** App name, optional logo
- **Navigation:** Auto-generated from entity names (e.g., Posts, Comments)
- **Footer:** Copyright/credits

---

## Route Patterns

### Static Routes
```yaml
- path: '/'
  page: 'home'

- path: '/about'
  page: 'about'
```

### Dynamic Routes (SvelteKit style)
```yaml
- path: '/posts/[id]'
  page: 'post-detail'

- path: '/users/[userId]/posts'
  page: 'user-posts'
```

**Parameter Interpolation:**
Content blocks can reference route parameters:
```yaml
content:
  - type: 'entity-detail'
    entity: 'Post'
    # Automatically uses {id} from route
```

---

## Display Modes (MVP)

Simple display variations for `entity-list`:

- **`table`** - Data table with columns (default)
- **`grid`** - Card grid layout (2-4 columns)
- **`preview`** - Summary/teaser format (title + excerpt)

More sophisticated view modes (Drupal-style) deferred to future versions.

---

## Example: Complete Blog UI

**ui.yml:**
```yaml
version: 1

app:
  name: "My Blog"
  description: "Thoughts and ideas"

routes:
  - path: '/'
    page: 'home'
  - path: '/posts'
    page: 'posts-list'
  - path: '/posts/[id]'
    page: 'post-detail'
  - path: '/posts/create'
    page: 'post-create'

pages:
  home:
    layout:
      header: true
      navigation: true
      footer: true
    content:
      - type: 'hero'
        title: 'Welcome to {app.name}'
        subtitle: '{app.description}'
      - type: 'entity-list'
        entity: 'Post'
        display: 'preview'
        limit: 3

  posts-list:
    layout:
      header: true
      navigation: true
      footer: true
    content:
      - type: 'entity-list'
        entity: 'Post'
        display: 'table'

  post-detail:
    layout:
      header: true
      navigation: true
      footer: true
    content:
      - type: 'entity-detail'
        entity: 'Post'
      - type: 'entity-list'
        entity: 'Comment'
        filter:
          field: 'post'
          value: '{post.id}'

  post-create:
    layout:
      header: true
      navigation: true
      footer: true
    content:
      - type: 'entity-form'
        entity: 'Post'
        action: 'create'
```

---

## Generator Implementation Notes

### SvelteKit Generator (First Implementation)

**File Structure:**
```
src/
  routes/
    +page.svelte               # home page
    +page.server.ts            # home page data loading
    posts/
      +page.svelte             # posts-list
      +page.server.ts
      [id]/
        +page.svelte           # post-detail
        +page.server.ts
      create/
        +page.svelte           # post-create
        +page.server.ts
  lib/
    components/
      Header.svelte
      Navigation.svelte
      Footer.svelte
      EntityList.svelte        # Generic entity list
      EntityDetail.svelte      # Generic entity detail
      EntityForm.svelte        # Generic entity form
```

**Generator Workflow:**
1. Parse `ui.yml`
2. Read entity metadata from `types.yml`
3. For each route, create SvelteKit page files
4. Generate layout components
5. Generate content block components
6. Wire up data loading (server-side)
7. Configure navigation from entity names

---

## Future Enhancements (v2+)

### Regen-Safe Customization
Explore patterns like:
- Slot-based customization (Svelte slots)
- Marker comments for custom code sections
- Separate generated library vs user code

### View Modes (Drupal-inspired)
```yaml
Post:
  viewModes:
    full:
      fields: ['title', 'content', 'author', 'created']
      widgets:
        content: 'rich-text-display'
    teaser:
      fields: ['title', 'excerpt']
      widgets:
        excerpt: 'plain-text'
    table:
      fields: ['title', 'author', 'created']
```

### Form Widgets
```yaml
Post:
  fields:
    content:
      type: 'string'
      ui:
        widget: 'rich-text'  # vs textarea, markdown-editor
    category:
      type: 'enum'
      ui:
        widget: 'radio'  # vs select, multi-select
```

### Advanced Features
- Pagination controls
- Sort options UI
- Filter builder UI
- Search functionality
- Bulk actions
- Custom actions (beyond CRUD)

---

## Open Questions

### 1. Layout Structure
**Current:** Simple booleans
```yaml
layout:
  header: true
  navigation: true
  footer: true
```

**Alternative:** More structured
```yaml
layout:
  sections:
    - type: 'header'
      logo: true
      navigation: 'main'
    - type: 'main'
      sidebar: false
    - type: 'footer'
```

**Decision needed:** Keep simple for MVP?

### 2. Content Block Properties
Do we need additional properties for MVP:
- Pagination controls?
- Sort options (field, direction)?
- Filter UI controls?

**Decision needed:** Add to MVP or defer?

### 3. Multi-Entity Operations
Should we support forms/views that span multiple entities?
- Example: Create Post + add initial Comments in one form

**Decision needed:** Defer to v2+?

---

## Success Criteria (MVP)

A successful v1 implementation enables:

1. ✅ **Define routes** for common CRUD operations
2. ✅ **Auto-generate pages** from entity metadata
3. ✅ **Create functional forms** with validation (from datalayer metadata)
4. ✅ **Display entity lists** with basic formatting
5. ✅ **Show entity details** with related data
6. ✅ **Navigate between pages** via auto-generated navigation

**Not required for MVP:**
- Beautiful/polished UI (functional is enough)
- Advanced customization hooks
- Complex filtering/sorting UI
- Multi-step forms
- Regen-safe patterns

---

## Timeline & Phases

### Phase 1: Schema Design (Current)
- ✅ Define ui.yml structure
- ✅ Document content block types
- Create JSON schema validation
- Write AI prompt for UI generation

### Phase 2: Generator Implementation (radish-cli)
- Implement SvelteKit generator
- Create page templates
- Create component templates
- Wire up data loading

### Phase 3: Testing & Refinement
- Generate sample apps
- Identify gaps
- Refine templates
- Update schema if needed

### Phase 4: Future Enhancements
- Regen-safe customization
- View modes
- Advanced widgets
- Multi-framework support

---

## Related Files

- `types.schema.json` - Datalayer entity definitions
- `ui.schema.json` - UI Layer schema (to be created)
- `VERSIONING-STRATEGY.md` - Version management approach

---

## Notes for radish-cli Implementation

1. **Generator location:** `src/generators/ui-layer/`
2. **Template engine:** Handlebars (consistent with datalayer)
3. **Template location:** `src/generators/ui-layer/templates/sveltekit/`
4. **Metadata access:** Import types.yml alongside ui.yml
5. **Validation:** Use `@radish/schemas` for ui.yml validation

---

## Appendix: Comparison to Other Tools

### vs. Drupal
- **Similar:** Content types, view modes, entity-based approach
- **Simpler:** No complex field formatters, fewer display options
- **Different:** Code generation vs runtime CMS

### vs. Retool/Internal Tools
- **Similar:** Metadata-driven UI generation
- **Different:** Static code generation vs WYSIWYG builder

### vs. Next.js/Remix Generators
- **Similar:** Route-based page generation
- **Different:** Entity-centric vs arbitrary pages

---

**End of Strategy Document**
