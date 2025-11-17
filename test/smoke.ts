import swaggerJsdoc from 'swagger-jsdoc';
import { generateSwaggerPathForModels, generateSwaggerSchemas } from '../generation';
import { CustomModel } from '../types';

// This is a tiny smoke test to ensure the library can be imported and basic functions run without throwing.

// Minimal fake model matching CustomModel shape (for build-time sanity, not real DB access)
const FakeModel: CustomModel = {
  name: 'User',
  actions: ['create', 'read', 'update', 'delete'],
  getAttributes: () => ({
    id: { type: { key: 'INTEGER' } },
    email: { type: { key: 'STRING' } },
    password: { type: { key: 'STRING' } }
  }) as any
} as CustomModel;

const swaggerOptions: swaggerJsdoc.OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test API',
      version: '1.0.0'
    },
    paths: {},
    components: {
      schemas: {},
      requestBodies: {}
    }
  },
  apis: []
};

generateSwaggerSchemas(swaggerOptions, [FakeModel]);
generateSwaggerPathForModels(swaggerOptions, [FakeModel]);

console.log('Smoke test OK:', Object.keys(swaggerOptions.definition?.paths || {}).length > 0);
