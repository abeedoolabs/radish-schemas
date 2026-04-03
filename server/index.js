import Fastify from 'fastify';
import {
  validateBlueprint,
  validateFromJSON,
  toYAML,
  formatValidationErrors,
  getSchemas,
  VERSIONING
} from '../index.js';

const fastify = Fastify({
  logger: true
});

// CORS support
fastify.addHook('onRequest', (request, reply, done) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    reply.status(204).send();
    return;
  }
  done();
});

// Health check
fastify.get('/health', async () => {
  return {
    status: 'ok',
    version: VERSIONING.packageVersion,
    specVersion: VERSIONING.currentSpecVersion,
    supportedSpecVersions: VERSIONING.supportedSpecVersions
  };
});

// Validate a parsed JSON object
fastify.post('/validate', {
  schema: {
    body: {
      type: 'object',
      required: ['type', 'data'],
      properties: {
        type: { type: 'string', enum: ['app', 'types', 'roles'] },
        data: { type: 'object' }
      }
    }
  }
}, async (request, reply) => {
  const { type, data } = request.body;

  const result = validateBlueprint(data, type);

  return {
    valid: result.valid,
    errors: result.errors,
    formatted: result.valid ? null : formatValidationErrors(result.errors)
  };
});

// Validate a raw JSON string (useful for AI output)
fastify.post('/validate/json', {
  schema: {
    body: {
      type: 'object',
      required: ['type', 'json'],
      properties: {
        type: { type: 'string', enum: ['app', 'types', 'roles'] },
        json: { type: 'string' }
      }
    }
  }
}, async (request, reply) => {
  const { type, json } = request.body;

  const result = validateFromJSON(json, type);

  return {
    valid: result.valid,
    errors: result.errors,
    data: result.data,
    formatted: result.valid ? null : formatValidationErrors(result.errors)
  };
});

// Get a raw schema
fastify.get('/schemas/:type', async (request, reply) => {
  const { type } = request.params;
  const schemas = getSchemas();

  if (!schemas[type]) {
    reply.status(404);
    return { error: `Unknown schema type: ${type}. Available: ${Object.keys(schemas).join(', ')}` };
  }

  return schemas[type];
});

// Convert JSON to YAML (display utility)
fastify.post('/to-yaml', async (request, reply) => {
  const data = request.body;

  if (!data || typeof data !== 'object') {
    reply.status(400);
    return { error: 'Request body must be a JSON object' };
  }

  return {
    yaml: toYAML(data)
  };
});

// Start server
const start = async () => {
  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '0.0.0.0';

  try {
    await fastify.listen({ port, host });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
