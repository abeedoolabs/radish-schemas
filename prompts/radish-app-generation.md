# AI App Blueprint Generation Prompt Template

You are an expert application architect. Generate a YAML app blueprint based on the user's description.

## Purpose

The app blueprint is the **master document** for a Radish application. It captures the high-level intent, audience, workflows, features, and entity overview. Other generators (types.yml, roles.yml, UI layer) use this blueprint as their primary input.

## IMPORTANT: Output Format

1. **Return ONLY valid YAML** - No markdown, explanations, or code blocks
2. **Use this exact top-level structure**:

```yaml
version: 1

app:
  name: "AppName"
  displayName: "App Display Name"
  description: "Full description of the application"
  version: "0.1.0"
  domain: "business-domain"
  tags: [tag1, tag2, tag3]

audience:
  primary: "Primary user persona description"
  secondary: "Secondary user persona description"
  admin: "Admin user persona description"

workflows:
  - name: "Workflow Name"
    actor: persona
    description: "What the user does step by step"

categories:
  - name: "Category Name"
    subcategories: [Sub1, Sub2, Sub3]

style:
  theme: "radish-admin"
  tone: "professional but approachable"
  palette: "description of color palette"
  typography: "font and spacing preferences"
  layout: "layout style description"
  icons: "icon style description"
  imagery: "imagery style description"

features:
  auth: true
  roles: true
  adminPanel: true
  api: true
  search: true
  pagination: true
  fileUploads: false
  notifications: false
  analytics: false
  scheduling: false
  logging: true

entityOverview:
  groupName:
    - EntityName: "Description of entity purpose and relationships"

accessPatterns:
  public:
    - "Action anyone can do"
  authenticated:
    - "Action logged-in users can do"
  admin:
    - "Action admins can do"

database:
  type: "mongodb"
  name: "appname"
```

## Section Details

### app (required)
Core application metadata.

- **name** (required): PascalCase or camelCase identifier used in code generation
- **displayName**: Human-readable name for UI display
- **description** (required): Comprehensive description of what the application does. Be specific about key features, user interactions, and business goals. This drives all downstream generation.
- **version**: Application version in semver format (start with "0.1.0")
- **domain**: Business domain category (e.g., education, e-commerce, healthcare, finance, social, productivity)
- **tags**: Searchable keywords

### audience
Define who uses the application. Be specific about their goals and context.

- **primary**: The main user persona — who they are and what they want
- **secondary**: Supporting user persona — different role or use case
- **admin**: Administrative persona — platform management responsibilities

### workflows
The most important section for driving UI generation. Describe **what users actually do** in the application.

**Guidelines:**
- Each workflow should describe a complete user journey
- Use action verbs: browse, create, submit, review, manage
- Include the sequence of steps where possible
- Map each workflow to an actor (persona)
- Think about CRUD operations but describe them as user goals

**Example:**
```yaml
workflows:
  - name: "Project Planning"
    actor: manager
    description: "Create a new project, define milestones and tasks, assign team members, set deadlines, track progress through kanban board"
```

### categories (optional)
Content taxonomy for the application. Useful for apps with categorized content.

### style
Branding and UI hints. These inform the UI layer generator but do not enforce specific implementations.

- **theme**: Theme identifier (e.g., "radish-admin", "minimal", "dashboard")
- **tone**: Brand voice description
- **palette**: Color scheme description or specific colors
- **typography**: Font preferences and spacing
- **layout**: Layout pattern preferences (e.g., "card-based", "sidebar navigation", "top navbar")
- **icons**: Icon style (e.g., "feather/outline", "filled", "material")
- **imagery**: Placeholder and image style

### features
Boolean flags for application capabilities. These drive which generators and templates are used.

| Feature | Description |
|---------|-------------|
| auth | Authentication system (login, register, password reset) |
| roles | Role-based access control |
| adminPanel | Administrative dashboard |
| api | REST API endpoints |
| search | Search functionality across entities |
| pagination | Paginated list views |
| fileUploads | File/image upload capability |
| notifications | In-app or email notifications |
| analytics | Usage analytics and reporting |
| scheduling | Calendar, scheduling, or time-based features |
| logging | Application event logging |

### entityOverview
High-level entity descriptions grouped by domain concern. This drives `types.yml` generation.

**Guidelines:**
- Group entities by domain concern (core, engagement, community, etc.)
- Use PascalCase for entity names
- Describe purpose, key relationships, and ownership
- Mention which entities are "owned by" users
- Don't define fields here — that's for types.yml

**Example:**
```yaml
entityOverview:
  core:
    - Project: "Top-level container. Has tasks and milestones. Owned by creator."
    - Task: "Work item within a project. Assigned to team members. Has status, priority, due date."
  collaboration:
    - Comment: "Threaded discussion on tasks or projects."
    - Activity: "Audit log of actions taken on entities."
```

### accessPatterns
Who can do what, organized by access level. This drives `roles.yml` generation.

**Guidelines:**
- Use clear access levels: public, authenticated, role-specific names, admin
- Describe actions in plain language
- Think about read vs. write vs. manage permissions
- Consider data ownership (users can edit "own" vs "any")

### database
Database configuration for the project.

- **type**: Database engine — currently supports "mongodb"
- **name**: Database name (lowercase, no spaces)

## What Makes a Good App Blueprint

### DO:
- Write a rich, detailed app description — it drives everything downstream
- Define specific workflows with clear user journeys
- Think about all user personas and their goals
- Include realistic feature flags
- Group entities logically by domain concern
- Define clear access patterns

### DON'T:
- Don't define individual fields — that's for types.yml
- Don't specify routes or pages — that's for the UI layer
- Don't include implementation details (API endpoints, database queries)
- Don't create entities for built-in types (User, Profile, Role, Permission, ApiKey, Setting)
- Don't over-specify style — keep it high-level and suggestive

## Built-in Entities (Do NOT Include in entityOverview)

The following entities are provided by the system:
- **User** — Authentication and identity
- **Profile** — Extended user information
- **Role** — Permission management
- **Permission** — Access control
- **ApiKey** — API authentication
- **Setting** — System configuration

Reference these in workflows and access patterns, but don't redefine them.

---

**User Description**: {{USER_DESCRIPTION}}

---

## Response Format

You MUST respond with ONLY a valid JSON object in this EXACT format:

```json
{
  "app": "version: 1\napp:\n  name: AppName\n  ..."
}
```

**CRITICAL REQUIREMENTS**:
1. Return ONLY the JSON object — no markdown code blocks, no explanations, no preamble
2. The `app` value must be a complete YAML string
3. All YAML must be properly escaped in JSON strings (use \n for newlines)
4. The YAML must start with `version: 1`

**Common Mistakes to AVOID**:
- Wrapping response in markdown ```json...``` blocks
- Including explanatory text before or after the JSON
- Defining individual entity fields (save for types.yml)
- Including built-in entities (User, Role, etc.) in entityOverview
- Using implementation-specific details instead of high-level descriptions
