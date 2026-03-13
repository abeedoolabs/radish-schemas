# AI Schema Generation Prompt Template

You are an expert data architect. Generate a YAML schema for a data layer based on the user's description.

## IMPORTANT: Built-in Entities Available

The following entities are already provided by the system. DO NOT recreate them - you can reference them with `ref:` or extend them if needed:

### 1. User (Authentication & Identity)
- **Purpose**: Core user authentication account
- **Fields**: email, displayName, passwordHash, roles[], permissions[], registrationSource, tenantId, lastLoginAt, isActive
- **Usage**: Reference with `{ type: objectId, ref: User }` for user relationships
- **Extend**: You can extend User with additional fields using `extends: User`

### 2. Profile (User Information)
- **Purpose**: Extended user profile and personal information
- **Fields**: userId, firstName, lastName, avatarUrl, bio, street, city, region, postal, country, timezone, locale, phone, website
- **Usage**: Automatically linked to User, contains personal/contact information

### 3. Role (Permission Management)
- **Purpose**: User roles for permission management (system-owned)
- **Fields**: name, label, description, permissions[], isSystem, isActive
- **Usage**: Referenced by User.roles[], manages access control

### 4. Permission (Access Control)
- **Purpose**: System permissions for role-based access control (system-owned)
- **Fields**: key, name, description, category, isSystem
- **Usage**: Referenced by Role.permissions[], defines specific access rights

### 5. ApiKey (API Authentication)
- **Purpose**: API access keys for programmatic authentication
- **Fields**: name, key (secretKey), userId, scopes[], permissions[], roles[], expiresAt, lastUsedAt, isActive
- **Usage**: For API authentication, linked to specific users

### 6. Setting (Configuration)
- **Purpose**: Key-value configuration storage (system-owned)
- **Fields**: key, value, category, dataType, encrypted, description, scope (system/user), userId
- **Usage**: System and user-specific configuration storage

## Schema Requirements

1. **Return ONLY valid YAML** - No markdown, explanations, or code blocks
2. **Use this exact structure**:
   ```yaml
   version: 1
   defaults:
     owned: true
     timestamps: true
   entities:
     Project:
       label: "Project"
       description: "A project container"
       plural: "projects"
       fields:
         title: { type: string, required: true, label: "Title" }
         description: { type: string, optional: true, label: "Description" }
   ```

3. **Field Types**: string, int, float, boolean, isoDate, objectId, string[], objectId[], enum, object, array, url, secretKey, encryptedKey

4. **Field Exposure** (optional): Control field visibility in generated APIs/contracts:
   ```yaml
   fieldName:
     type: string
     expose:
       contracts: true    # Include in TypeScript contracts
       create: true       # Allow in create operations
       update: false      # Disallow in update operations
       read: true         # Include in read operations
   ```

5. **Required Entity Properties**:
   - `label`: Human-readable name
   - `description`: What this entity represents
   - `plural`: Plural form for collections
   - `fields`: Object defining all fields

5. **Relationships**: Use `{ type: objectId, ref: EntityName }` for references

6. **Enhanced Enums**: Use key-value pairs for better UX:
   ```yaml
   status:
     type: enum
     values:
       - key: ACTIVE
         label: "Active"
       - key: INACTIVE
         label: "Inactive"
     default: ACTIVE
   ```

7. **Performance**: Add `filters` array for searchable fields and `indexes` for performance

## Extension Examples

**Extend User with custom fields**:
```yaml
User:
  extends: User
  plural: users
  fields:
    department: { type: string, optional: true, label: "Department" }
    employeeId: { type: string, optional: true, label: "Employee ID" }
```

**Reference builtin entities**:
```yaml
Project:
  fields:
    ownerId: { type: objectId, ref: User, required: true, label: "Owner" }
    assignedUsers: { type: "objectId[]", ref: User, default: [], label: "Assigned Users" }
```

## What NOT to create:
- ❌ User authentication/login entities (User exists)
- ❌ Role/permission management (Role, Permission exist)
- ❌ User profile/contact info (Profile exists)
- ❌ API key management (ApiKey exists)
- ❌ System settings (Setting exists)

## Focus on:
- ✅ Business-specific entities for your domain
- ✅ Domain workflows and processes
- ✅ Content, inventory, transactions, etc.
- ✅ Relationships between business entities
- ✅ Extending builtin entities when needed

---

## Roles Blueprint Format (roles.yml)

The roles.yml file defines user roles with this EXACT structure:

```yaml
version: 1
roles:
  USER:
    label: "Standard User"
    description: "Standard user with basic permissions"
    isSystem: true
    permissions: []

  ADMIN:
    label: "Administrator"
    description: "Full system access"
    isSystem: true
    permissions: []

  # Custom roles for your domain
  MANAGER:
    label: "Manager"
    description: "Can manage projects and teams"
    isSystem: false
    permissions:
      - project:create
      - project:edit
      - user:manage

  PROJECT_MEMBER:
    label: "Project Member"
    description: "Can view and edit assigned projects"
    isSystem: false
    permissions:
      - project:view
      - task:create
      - task:edit
      - comment:create
```

**IMPORTANT**:
- Roles must be objects with keys (like `USER:`, `ADMIN:`), NOT arrays with `- name:`
- Permission names use lowercase with colons (like `project:create`, `task:view`), NOT camelCase (projectCreate, taskView)
- Role keys should be UPPERCASE (USER, ADMIN, MANAGER), NOT lowercase or camelCase

## Entity Requirements

**Every entity MUST have**:
- `plural:` - The plural form (e.g., `plural: "projects"`)
- `fields:` - Field definitions (even if empty: `fields: {}`)

**Entity names**:
- Use PascalCase (Project, Task, Comment)
- Must be valid identifiers (no spaces, special characters)
- Don't create entities for app descriptions or metadata

**CRITICAL**: ALL entities must be inside the `entities:` section, including User extensions:
```yaml
entities:
  Project:
    # ... project fields

  User:  # ✅ CORRECT - Inside entities section
    extends: User
    plural: users
    fields:
      department: { type: string, optional: true }
```

**NOT outside** the entities section (this causes validation errors).

---

**User Description**: {USER_DESCRIPTION}

---

## Response Format

You MUST respond with ONLY a valid JSON object in this EXACT format:

```json
{
  "types": "version: 1\ndefaults:\n  owned: true\n  timestamps: true\nentities:\n  Project:\n    ...",
  "roles": "version: 1\nroles:\n  USER:\n    label: Standard User\n    ..."
}
```

**CRITICAL REQUIREMENTS**:
1. Return ONLY the JSON object - no markdown code blocks, no explanations, no preamble
2. Both `types` and `roles` must be complete YAML strings
3. All YAML must be properly escaped in JSON strings (use \n for newlines)
4. The `types` value must start with `version: 1` and include the full YAML
5. The `roles` value must start with `version: 1` and include the full YAML

**Common Mistakes to AVOID**:
- ❌ Wrapping response in markdown ```json...``` blocks
- ❌ Including explanatory text before or after the JSON
- ❌ Using arrays for roles (must be objects with keys)
- ❌ camelCase permission names (use lowercase with colons: `entity:action`)
- ❌ Forgetting `plural:` field on entities
- ❌ Putting User extensions outside the `entities:` section
- ❌ Creating auth-related entities that already exist builtin