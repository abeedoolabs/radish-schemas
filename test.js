import { validateBlueprint, formatValidationErrors, getSchemas } from './index.js';

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
        content: { type: 'string' }, // Changed from 'text' to 'string'
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
console.log('Test 1: Valid blueprint');
const result1 = validateBlueprint(validBlueprint, 'types');
console.log(result1.valid ? '✅ PASS' : '❌ FAIL');
if (!result1.valid) {
  console.log('Errors:', formatValidationErrors(result1.errors));
}
console.log('');

// Test 2: Invalid blueprint
console.log('Test 2: Invalid blueprint (should fail)');
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

// Test 4: Valid app blueprint
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

// Test 5: Invalid app blueprint (missing required app.name)
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

// Test 7: Get schemas
console.log('Test 7: Get schemas');
const schemas = getSchemas();
console.log(schemas.types ? '✅ types schema loaded' : '❌ types schema missing');
console.log(schemas.roles ? '✅ roles schema loaded' : '❌ roles schema missing');
console.log(schemas.app ? '✅ app schema loaded' : '❌ app schema missing');
console.log('');

console.log('All tests completed!');
