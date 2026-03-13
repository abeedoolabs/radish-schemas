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

// Test 4: Get schemas
console.log('Test 4: Get schemas');
const schemas = getSchemas();
console.log(schemas.types ? '✅ types schema loaded' : '❌ types schema missing');
console.log(schemas.roles ? '✅ roles schema loaded' : '❌ roles schema missing');
console.log('');

console.log('All tests completed!');
