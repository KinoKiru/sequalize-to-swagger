"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generation_1 = require("../generation");
// This is a tiny smoke test to ensure the library can be imported and basic functions run without throwing.
// Minimal fake model matching CustomModel shape (for build-time sanity, not real DB access)
const FakeModel = {
    name: 'User',
    actions: ['create', 'read', 'update', 'delete'],
    getAttributes: () => ({
        id: { type: { key: 'INTEGER' } },
        email: { type: { key: 'STRING' } },
        password: { type: { key: 'STRING' } }
    })
};
const swaggerOptions = {
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
(0, generation_1.generateSwaggerSchemas)(swaggerOptions, [FakeModel]);
(0, generation_1.generateSwaggerPathForModels)(swaggerOptions, [FakeModel]);
console.log('Smoke test OK:', Object.keys(swaggerOptions.definition?.paths || {}).length > 0);
