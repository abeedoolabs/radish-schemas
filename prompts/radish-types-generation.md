# AI Types Blueprint Generation Prompt

You are an expert data architect. Generate a JSON types blueprint for a data layer based on the user's description.

**Generate ONLY the types blueprint. Do NOT include roles.**

## IMPORTANT: Built-in Entities Available

The following entities are already provided by the system. DO NOT recreate them - you can reference them with `ref` or extend them if needed:

### 1. User (Authentication & Identity)
- **Purpose**: Core user authentication account
- **Fields**: email, displayName, passwordHash, roles[], permissions[], registrationSource, tenantId, lastLoginAt, isActive
- **Usage**: Reference with `{ "type": "objectId", "ref": "User" }` for user relationships
- **Extend**: You can extend User with additional fields using `"extends": "User"`

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

1. **Return ONLY valid JSON** - No markdown, explanations, or code blocks
2. **Use this exact structure**:
   ```json
   {
     "version": 1,
     "defaults": {
       "owned": true,
       "timestamps": true
     },
     "entities": {
       "Project": {
         "label": "Project",
         "description": "A project container",
         "plural": "projects",
         "fields": {
           "title": { "type": "string", "required": true, "label": "Title" },
           "description": { "type": "string", "optional": true, "label": "Description" }
         }
       }
     }
   }
   ```

3. **Field Types**: string, int, float, boolean, isoDate, objectId, string[], int[], float[], boolean[], objectId[], url[], enum, object, array, url, secretKey, encryptedKey

4. **Field Exposure** (optional): Control field visibility in generated APIs/contracts:
   ```json
   {
     "type": "string",
     "expose": {
       "contracts": true,
       "create": true,
       "update": false,
       "read": true
     }
   }
   ```

5. **Field-Level Access Control** (optional): Restrict which roles can read or write specific fields:
   ```json
   {
     "costPrice": {
       "type": "float",
       "access": { "read": ["ADMIN", "MANAGER"] }
     },
     "supplierNotes": {
       "type": "string",
       "access": { "read": ["ADMIN", "MANAGER"], "write": ["ADMIN"] }
     }
   }
   ```
   If `access` is omitted, the field is visible/writable to anyone with entity access. ADMIN with `system:admin` bypasses all field restrictions.

6. **Required Entity Properties**:
   - `label`: Human-readable name
   - `description`: What this entity represents
   - `plural`: Plural form for collections
   - `fields`: Object defining all fields

7. **Relationships**: Use `{ "type": "objectId", "ref": "EntityName" }` for references

8. **Scope** (optional): Scoped access control with two modes:

   **Through-entity** — access if user owns a related entity:
   ```json
   {
     "Subscription": {
       "ownership": "system",
       "scope": { "field": "appId", "through": "App", "ownerField": "ownerId" },
       "fields": { ... }
     }
   }
   ```

   **Direct-match** — access when record's field matches a user field (multi-tenant):
   ```json
   {
     "Invoice": {
       "ownership": "system",
       "scope": { "field": "orgId", "matchUserField": "orgIds" },
       "fields": { ... }
     }
   }
   ```
   `matchUserField` supports array match — if `user.orgIds` is an array, checks if `record.orgId` is in that array.

9. **Enhanced Enums**: Use key-value pairs for better UX:
   ```json
   {
     "type": "enum",
     "values": [
       { "key": "ACTIVE", "label": "Active" },
       { "key": "INACTIVE", "label": "Inactive" }
     ],
     "default": "ACTIVE"
   }
   ```

10. **Performance**: Add `filters` array for searchable fields and `indexes` for performance

11. **Nested Objects**: Use `"type": "object"` with `"fields"` for nested structures:
   ```json
   {
     "type": "object",
     "label": "Location",
     "fields": {
       "latitude": { "type": "float" },
       "longitude": { "type": "float" }
     }
   }
   ```

12. **Search Index** (optional): Enable full-text search with engine-specific adapters:
    ```json
    {
      "Product": {
        "plural": "products",
        "search": {
          "enabled": true,
          "engine": "typesense",
          "indexName": "products",
          "fields": {
            "searchable": ["name", "description", "brand"],
            "filterable": ["brand", "price", "categories"],
            "sortable": ["price", "name", "createdAt"],
            "facetable": ["brand", "categories"]
          },
          "sync": "inline",
          "vector": {
            "enabled": false,
            "sourceFields": ["name", "description"]
          }
        },
        "fields": { ... }
      }
    }
    ```
    - **engine**: `typesense`, `elastic`, `opensearch`, `meilisearch`, `mongoAtlas`
    - **indexName**: Custom index name (defaults to entity plural)
    - **sync**: `inline` (immediate) or `background` (via jobs)
    - **vector**: Enable vector/embedding search with `sourceFields` to generate embeddings from

13. **Automatic Fields** (DO NOT add these manually):
    - When `"defaults": { "timestamps": true }` is set, `createdAt` and `updatedAt` are added automatically
    - When `"defaults": { "owned": true }` is set, `ownerId` is added automatically
    - Adding these fields manually causes duplication

## Extension Examples

**Extend User with custom fields**:
```json
{
  "User": {
    "extends": "User",
    "plural": "users",
    "fields": {
      "department": { "type": "string", "optional": true, "label": "Department" },
      "employeeId": { "type": "string", "optional": true, "label": "Employee ID" }
    }
  }
}
```

**Reference builtin entities**:
```json
{
  "Project": {
    "plural": "projects",
    "fields": {
      "ownerId": { "type": "objectId", "ref": "User", "required": true, "label": "Owner" },
      "assignedUsers": { "type": "objectId[]", "ref": "User", "default": [], "label": "Assigned Users" }
    }
  }
}
```

## What NOT to create:
- User authentication/login entities (User exists)
- Role/permission management (Role, Permission exist)
- User profile/contact info (Profile exists)
- API key management (ApiKey exists)
- System settings (Setting exists)

## Focus on:
- Business-specific entities for your domain
- Domain workflows and processes
- Content, inventory, transactions, etc.
- Relationships between business entities
- Extending builtin entities when needed

## Entity Requirements

**Every entity MUST have**:
- `plural` - The plural form (e.g., `"plural": "projects"`)
- `fields` - Field definitions (even if empty: `"fields": {}`)

**Entity names**:
- Use PascalCase (Project, Task, Comment)
- Must be valid identifiers (no spaces, special characters)
- Don't create entities for app descriptions or metadata

**CRITICAL**: ALL entities must be inside the `entities` object, including User extensions.

---

**User Description**: {{USER_DESCRIPTION}}

---

## Response Format

You MUST respond with ONLY a valid JSON object starting with `{ "version": 1, "entities": { ... } }`.

```json
{
  "version": 1,
  "defaults": {
    "owned": true,
    "timestamps": true
  },
  "entities": {
    "Project": {
      "label": "Project",
      "description": "A project container",
      "plural": "projects",
      "fields": {
        "title": { "type": "string", "required": true, "label": "Title" }
      }
    }
  }
}
```

**CRITICAL REQUIREMENTS**:
1. Return ONLY the JSON object - no markdown code blocks, no explanations, no preamble
2. Must include `"version": 1`
3. Must include `"entities"` with at least one entity
4. Do NOT include roles - this is types only
5. All keys and string values must be properly quoted

**Common Mistakes to AVOID**:
- Wrapping response in markdown ```json...``` blocks
- Including explanatory text before or after the JSON
- Including a "roles" section (generate types ONLY)
- Forgetting `"plural"` field on entities
- Putting User extensions outside the `entities` object
- Creating auth-related entities that already exist builtin
- Adding `createdAt`/`updatedAt` fields when `timestamps: true` is set (they're automatic)
- Adding `ownerId` fields when `owned: true` is set (it's automatic)
- Using `"shape"` instead of `"fields"` for nested object definitions
- Inventing field types that don't exist (e.g., `"date"` — use `"isoDate"`)
