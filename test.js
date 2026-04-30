import { validateBlueprint, validateFromJSON, toYAML, formatValidationErrors, getSchemas } from './index.js';

// Test data - valid blueprint
const validBlueprint = {
  version: 1,
  defaults: {
    owned: true
  },
  entities: {
    Post: {
      plural: 'posts',
      fields: {
        title: { type: 'string', required: true },
        content: { type: 'string' },
        published: { type: 'boolean', default: false }
      }
    }
  }
};

// Test data - invalid blueprint (missing plural)
const invalidBlueprint = {
  version: 1,
  entities: {
    Post: {
      // Missing plural field - should fail validation
      fields: {
        title: { type: 'string' }
      }
    }
  }
};

console.log('🧪 Testing @radish/schemas\n');

// Test 1: Valid blueprint
console.log('Test 1: Valid types blueprint');
const result1 = validateBlueprint(validBlueprint, 'types');
console.log(result1.valid ? '✅ PASS' : '❌ FAIL');
if (!result1.valid) {
  console.log('Errors:', formatValidationErrors(result1.errors));
}
console.log('');

// Test 2: Invalid blueprint
console.log('Test 2: Invalid types blueprint (should fail)');
const result2 = validateBlueprint(invalidBlueprint, 'types');
console.log(!result2.valid ? '✅ PASS' : '❌ FAIL');
if (!result2.valid) {
  console.log('Expected errors:', formatValidationErrors(result2.errors));
}
console.log('');

// Test 3: Missing version field
console.log('Test 3: Missing version field (should fail)');
const noVersionBlueprint = {
  entities: {
    Post: {
      plural: 'posts',
      fields: {
        title: { type: 'string' }
      }
    }
  }
};
const result3 = validateBlueprint(noVersionBlueprint, 'types');
console.log(!result3.valid ? '✅ PASS' : '❌ FAIL');
if (!result3.valid) {
  console.log('Expected errors:', formatValidationErrors(result3.errors));
}
console.log('');

// Test 4: Valid types blueprint with scope
console.log('Test 4: Types blueprint with scope');
const scopedBlueprint = {
  version: 1,
  entities: {
    Subscription: {
      plural: 'subscriptions',
      ownership: 'system',
      scope: {
        field: 'appId',
        through: 'App',
        ownerField: 'ownerId'
      },
      fields: {
        appId: { type: 'objectId', ref: 'App', required: true },
        plan: { type: 'string', required: true }
      }
    }
  }
};
const resultScope = validateBlueprint(scopedBlueprint, 'types');
console.log(resultScope.valid ? '✅ PASS' : '❌ FAIL');
if (!resultScope.valid) {
  console.log('Errors:', formatValidationErrors(resultScope.errors));
}
console.log('');

// Test 4a2: Types blueprint with scope direct-match mode
console.log('Test 4a2: Types blueprint with scope direct-match');
const directMatchBlueprint = {
  version: 1,
  entities: {
    Invoice: {
      plural: 'invoices',
      ownership: 'system',
      scope: {
        field: 'orgId',
        matchUserField: 'orgIds'
      },
      fields: {
        orgId: { type: 'objectId', required: true },
        amount: { type: 'float', required: true }
      }
    }
  }
};
const resultDirect = validateBlueprint(directMatchBlueprint, 'types');
console.log(resultDirect.valid ? '✅ PASS' : '❌ FAIL');
if (!resultDirect.valid) {
  console.log('Errors:', formatValidationErrors(resultDirect.errors));
}
console.log('');

// Test 4b: Types blueprint with field-level access control
console.log('Test 4b: Types blueprint with field-level access');
const accessBlueprint = {
  version: 1,
  entities: {
    Product: {
      plural: 'products',
      fields: {
        name: { type: 'string', required: true },
        price: { type: 'float', required: true },
        costPrice: {
          type: 'float',
          access: { read: ['ADMIN', 'MANAGER'] }
        },
        supplierNotes: {
          type: 'string',
          access: { read: ['ADMIN', 'MANAGER'], write: ['ADMIN'] }
        }
      }
    }
  }
};
const resultAccess = validateBlueprint(accessBlueprint, 'types');
console.log(resultAccess.valid ? '✅ PASS' : '❌ FAIL');
if (!resultAccess.valid) {
  console.log('Errors:', formatValidationErrors(resultAccess.errors));
}
console.log('');

// Test 4c: Types blueprint with search index
console.log('Test 4c: Types blueprint with search index');
const searchBlueprint = {
  version: 1,
  entities: {
    Product: {
      plural: 'products',
      search: {
        enabled: true,
        engine: 'typesense',
        indexName: 'products',
        fields: {
          searchable: ['name', 'description', 'brand'],
          filterable: ['brand', 'price', 'categories'],
          sortable: ['price', 'name', 'createdAt'],
          facetable: ['brand', 'categories']
        },
        sync: 'inline',
        vector: {
          enabled: false,
          sourceFields: ['name', 'description']
        }
      },
      fields: {
        name: { type: 'string', required: true },
        description: { type: 'string' },
        brand: { type: 'string' },
        price: { type: 'float' },
        categories: { type: 'string[]' }
      }
    }
  }
};
const resultSearch = validateBlueprint(searchBlueprint, 'types');
console.log(resultSearch.valid ? '✅ PASS' : '❌ FAIL');
if (!resultSearch.valid) {
  console.log('Errors:', formatValidationErrors(resultSearch.errors));
}
console.log('');

// Test 5: Valid app blueprint
console.log('Test 4: Valid app blueprint');
const validApp = {
  version: 1,
  app: {
    name: 'TestApp',
    displayName: 'Test Application',
    description: 'A test application for validation',
    version: '0.1.0',
    domain: 'testing',
    tags: ['test', 'sample']
  },
  audience: {
    primary: 'Developers testing the schema',
    secondary: 'QA engineers',
    admin: 'Platform administrators'
  },
  workflows: [
    {
      name: 'Create Item',
      actor: 'user',
      description: 'User creates a new item, fills in details, saves'
    }
  ],
  categories: [
    {
      name: 'General',
      subcategories: ['Sub1', 'Sub2']
    }
  ],
  style: {
    theme: 'radish-admin',
    tone: 'professional',
    palette: 'blues and grays'
  },
  features: {
    auth: true,
    roles: true,
    adminPanel: true,
    api: true,
    search: false,
    pagination: true,
    fileUploads: false,
    notifications: false,
    analytics: false,
    scheduling: false,
    logging: true
  },
  entityOverview: {
    core: [
      { Item: 'Basic content unit. Owned by creator.' }
    ]
  },
  accessPatterns: {
    public: ['View items'],
    authenticated: ['Create items', 'Edit own items'],
    admin: ['Manage all items', 'Manage users']
  },
  database: {
    type: 'mongodb',
    name: 'testapp'
  }
};
const result4 = validateBlueprint(validApp, 'app');
console.log(result4.valid ? '✅ PASS' : '❌ FAIL');
if (!result4.valid) {
  console.log('Errors:', formatValidationErrors(result4.errors));
}
console.log('');

// Test 5: Invalid app blueprint (missing app.name)
console.log('Test 5: Invalid app blueprint (missing app.name)');
const invalidApp = {
  version: 1,
  app: {
    description: 'An app without a name'
  }
};
const result5 = validateBlueprint(invalidApp, 'app');
console.log(!result5.valid ? '✅ PASS' : '❌ FAIL');
if (!result5.valid) {
  console.log('Expected errors:', formatValidationErrors(result5.errors));
}
console.log('');

// Test 6: Minimal valid app blueprint
console.log('Test 6: Minimal valid app blueprint');
const minimalApp = {
  version: 1,
  app: {
    name: 'MinimalApp',
    description: 'Just the basics'
  }
};
const result6 = validateBlueprint(minimalApp, 'app');
console.log(result6.valid ? '✅ PASS' : '❌ FAIL');
if (!result6.valid) {
  console.log('Errors:', formatValidationErrors(result6.errors));
}
console.log('');

// Test 7: validateFromJSON - valid JSON string
console.log('Test 7: validateFromJSON with valid JSON string');
const jsonString = JSON.stringify(validBlueprint);
const result7 = validateFromJSON(jsonString, 'types');
console.log(result7.valid && result7.data ? '✅ PASS' : '❌ FAIL');
console.log('');

// Test 8: validateFromJSON - invalid JSON string
console.log('Test 8: validateFromJSON with invalid JSON string');
const result8 = validateFromJSON('{ not valid json }}}', 'types');
console.log(!result8.valid && result8.data === null ? '✅ PASS' : '❌ FAIL');
if (!result8.valid) {
  console.log('Expected errors:', formatValidationErrors(result8.errors));
}
console.log('');

// Test 9: toYAML conversion
console.log('Test 9: toYAML conversion');
const yamlOutput = toYAML(minimalApp);
console.log(typeof yamlOutput === 'string' && yamlOutput.includes('MinimalApp') ? '✅ PASS' : '❌ FAIL');
console.log('Output preview:');
console.log(yamlOutput);
console.log('');

// Test 10: Valid UI blueprint
console.log('Test 10: Valid UI blueprint');
const validUI = {
  version: 1,
  app: {
    name: 'TestApp',
    description: 'A test app'
  },
  routes: [
    { path: '/', page: 'home', access: 'public' },
    { path: '/items', page: 'items-list', access: 'authenticated' },
    { path: '/items/[id]', page: 'item-detail', access: 'authenticated' },
    { path: '/items/create', page: 'item-create', access: { roles: ['ADMIN'], permissions: ['item:create'] } }
  ],
  pages: {
    'home': {
      layout: { header: true, navigation: true, footer: true },
      content: [
        { type: 'hero', title: 'Welcome to {app.name}', subtitle: '{app.description}' },
        { type: 'entity-list', entity: 'Item', display: 'grid', limit: 6 }
      ]
    },
    'items-list': {
      layout: { header: true, navigation: true, footer: true },
      content: [
        { type: 'entity-list', entity: 'Item', display: 'table', title: 'All Items', fields: ['name', 'status', 'createdAt'] }
      ]
    },
    'item-detail': {
      content: [
        { type: 'entity-detail', entity: 'Item', actions: ['edit', 'delete'] },
        { type: 'entity-list', entity: 'Comment', filter: { field: 'itemId', value: '{item.id}' }, sort: { field: 'createdAt', direction: 'desc' } }
      ]
    },
    'item-create': {
      content: [
        { type: 'entity-form', entity: 'Item', action: 'create', fields: ['name', 'description', 'status'] }
      ]
    }
  }
};
const result10 = validateBlueprint(validUI, 'ui');
console.log(result10.valid ? '✅ PASS' : '❌ FAIL');
if (!result10.valid) {
  console.log('Errors:', formatValidationErrors(result10.errors));
}
console.log('');

// Test 11: Invalid UI blueprint (missing routes)
console.log('Test 11: Invalid UI blueprint (missing routes)');
const invalidUI = {
  version: 1,
  pages: {
    'home': {
      content: [{ type: 'hero', title: 'Hello' }]
    }
  }
};
const result11 = validateBlueprint(invalidUI, 'ui');
console.log(!result11.valid ? '✅ PASS' : '❌ FAIL');
if (!result11.valid) {
  console.log('Expected errors:', formatValidationErrors(result11.errors));
}
console.log('');

// Test 12: Validate real EduHub UI blueprint from file
console.log('Test 12: Validate real EduHub UI blueprint');
import { readFileSync } from 'fs';
try {
  const eduUI = JSON.parse(readFileSync('/Users/ctmeece/Projects/radish-cli/testapp/blueprints/testapp.ui.json', 'utf8'));
  const result12 = validateBlueprint(eduUI, 'ui');
  console.log(result12.valid ? '✅ PASS' : '❌ FAIL');
  if (!result12.valid) {
    console.log('Errors:', formatValidationErrors(result12.errors));
  }
} catch (err) {
  console.log('⚠️  SKIP (file not found)');
}
console.log('');

// Test 13: Valid components blueprint
console.log('Test 13: Valid components blueprint');
const validComponents = {
  version: 1,
  components: {
    HeroSection: {
      base: 'Hero',
      props: { title: 'Welcome', subtitle: 'Build something' }
    },
    ItemCard: {
      base: 'Card',
      entity: 'Item',
      fields: { title: 'name', body: 'description', badge: 'status' },
      actions: [
        { label: 'View', href: '/items/{id}', variant: 'primary' }
      ]
    },
    ItemTable: {
      base: 'DataTable',
      entity: 'Item',
      display: 'table',
      columns: ['name', 'status', 'createdAt']
    },
    ItemGrid: {
      base: 'DataTable',
      entity: 'Item',
      display: 'grid',
      cardComponent: 'ItemCard'
    },
    AboutBlock: {
      base: 'ContentBlock',
      editable: true,
      defaultContent: '<h2>About</h2><p>Learn more.</p>'
    }
  }
};
const result13 = validateBlueprint(validComponents, 'components');
console.log(result13.valid ? '✅ PASS' : '❌ FAIL');
if (!result13.valid) {
  console.log('Errors:', formatValidationErrors(result13.errors));
}
console.log('');

// Test 14: Invalid components blueprint (missing base)
console.log('Test 14: Invalid components blueprint (missing base)');
const invalidComponents = {
  version: 1,
  components: {
    BadComponent: {
      entity: 'Item'
    }
  }
};
const result14 = validateBlueprint(invalidComponents, 'components');
console.log(!result14.valid ? '✅ PASS' : '❌ FAIL');
if (!result14.valid) {
  console.log('Expected errors:', formatValidationErrors(result14.errors));
}
console.log('');

// Test 15: Valid theme blueprint
console.log('Test 15: Valid theme blueprint');
const validTheme = {
  version: 1,
  theme: {
    name: 'test-theme',
    colorScheme: 'light',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#f59e0b',
      neutral: '#1e293b',
      base100: '#ffffff',
      base200: '#f8fafc',
      base300: '#e2e8f0',
      info: '#3b82f6',
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444'
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      headingFont: 'Poppins, sans-serif'
    },
    radius: {
      box: '0.5rem',
      button: '0.375rem',
      badge: '1rem'
    },
    backgrounds: {
      hero: {
        type: 'gradient',
        gradient: 'linear-gradient(135deg, #2563eb, #1e40af)'
      },
      page: {
        type: 'solid',
        color: '#ffffff'
      }
    }
  }
};
const result15 = validateBlueprint(validTheme, 'theme');
console.log(result15.valid ? '✅ PASS' : '❌ FAIL');
if (!result15.valid) {
  console.log('Errors:', formatValidationErrors(result15.errors));
}
console.log('');

// Test 16: Invalid theme blueprint (bad hex color)
console.log('Test 16: Invalid theme blueprint (bad hex color)');
const invalidTheme = {
  version: 1,
  theme: {
    name: 'bad-theme',
    colorScheme: 'light',
    colors: {
      primary: 'red',
      secondary: '#1e40af',
      accent: '#f59e0b',
      neutral: '#1e293b',
      base100: '#ffffff',
      base200: '#f8fafc',
      base300: '#e2e8f0',
      info: '#3b82f6',
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444'
    }
  }
};
const result16 = validateBlueprint(invalidTheme, 'theme');
console.log(!result16.valid ? '✅ PASS' : '❌ FAIL');
if (!result16.valid) {
  console.log('Expected errors:', formatValidationErrors(result16.errors));
}
console.log('');

// Test 17: Get schemas
console.log('Test 17: Get schemas');
const schemas = getSchemas();
console.log(schemas.types ? '✅ types schema loaded' : '❌ types schema missing');
console.log(schemas.roles ? '✅ roles schema loaded' : '❌ roles schema missing');
console.log(schemas.app ? '✅ app schema loaded' : '❌ app schema missing');
console.log(schemas.ui ? '✅ ui schema loaded' : '❌ ui schema missing');
console.log(schemas.components ? '✅ components schema loaded' : '❌ components schema missing');
console.log(schemas.theme ? '✅ theme schema loaded' : '❌ theme schema missing');
console.log('');

console.log('All tests completed!');
