"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSwaggerPathForModels = generateSwaggerPathForModels;
exports.generateSwaggerSchemas = generateSwaggerSchemas;
exports.convertToSwaggerType = convertToSwaggerType;
const messages_1 = require("./enums/messages");
const actions_1 = require("./enums/actions");
const key = 'resource';
const basePaths = [
    {
        action: actions_1.Actions.READ,
        path: `/${key}s`,
        method: 'GET',
        summary: `Get all ${key}s`,
        description: `Retrieves a list of all ${key}s in the system.`,
        tags: [key.charAt(0).toUpperCase() + key.slice(1) + 's'],
        responses: {
            200: { description: `A list of ${key}s`, content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } } },
            500: { description: messages_1.Messages.SERVER_ERROR }
        }
    },
    {
        action: actions_1.Actions.CREATE,
        path: `/${key}s`,
        method: 'POST',
        summary: `Create a new ${key}`,
        description: `Creates a new ${key} in the system.`,
        tags: [key.charAt(0).toUpperCase() + key.slice(1) + 's'],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: { type: 'object' }
                }
            }
        },
        responses: {
            201: { description: messages_1.Messages.RESOURCE_CREATED },
            400: { description: messages_1.Messages.INVALID_INPUT }
        }
    },
    {
        action: actions_1.Actions.UPDATE,
        path: `/${key}s/{id}`,
        method: 'PUT',
        summary: `Update an existing ${key}`,
        description: `Updates an existing ${key} in the system.`,
        tags: [key.charAt(0).toUpperCase() + key.slice(1) + 's'],
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                description: `ID of the ${key} to update`,
                schema: { type: 'integer' }
            }
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: { type: 'object' }
                }
            }
        },
        responses: {
            200: { description: messages_1.Messages.RESOURCE_UPDATED },
            400: { description: messages_1.Messages.INVALID_INPUT },
            404: { description: messages_1.Messages.RESOURCE_NOT_FOUND }
        }
    },
    {
        action: actions_1.Actions.DELETE,
        path: `/${key}s/{id}`,
        method: 'DELETE',
        summary: `Delete a ${key}`,
        description: `Deletes a ${key} from the system.`,
        tags: [key.charAt(0).toUpperCase() + key.slice(1) + 's'],
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                description: `ID of the ${key} to delete`,
                schema: { type: 'integer' }
            }
        ],
        responses: {
            204: { description: messages_1.Messages.RESOURCE_DELETED },
            404: { description: messages_1.Messages.RESOURCE_NOT_FOUND }
        }
    }
];
const replaceKeyRegex = new RegExp(key, 'gi');
/**
 * Generates the appropriate response schema based on status code and method
 * @param status HTTP status code
 * @param method HTTP method
 * @param modelName Name of the model -> converts to schema reference
 * @param resp Original response object
 * @returns Modified response object with schema if applicable
 */
function getResponseSchema(status, method, modelName, resp) {
    const response = { description: resp.description.replaceAll(replaceKeyRegex, modelName.toLowerCase()) };
    if (status === '200' && method === 'GET') {
        return {
            ...response,
            content: {
                'application/json': {
                    schema: { type: 'array', items: { $ref: `#/components/schemas/${modelName}` } }
                }
            }
        };
    }
    if ((status === '201' && method === 'POST') || (status === '200' && method === 'PUT')) {
        return {
            ...response,
            content: {
                'application/json': {
                    schema: { $ref: `#/components/schemas/${modelName}` }
                }
            }
        };
    }
    return { ...response };
}
/**
 * Generates Swagger paths for the provided models
 * @param swaggerOptions Swagger configuration options
 * @param models Array of models to generate paths for, should extend Sequelize Model and implement extra attributes
 */
function generateSwaggerPathForModels(swaggerOptions, models) {
    for (const model of models) {
        const modelName = model.name;
        const allowedActions = Array.isArray(model.actions) && model.actions.length > 0
            ? model.actions
            : [actions_1.Actions.CREATE, actions_1.Actions.READ, actions_1.Actions.UPDATE, actions_1.Actions.DELETE];
        const paths = basePaths
            .filter(route => allowedActions.includes(route.action))
            .map(route => {
            const path = route.path.replaceAll(replaceKeyRegex, modelName.toLowerCase());
            const summary = route.summary.replaceAll(replaceKeyRegex, modelName.toLowerCase());
            const description = route.description.replaceAll(replaceKeyRegex, modelName);
            const tags = [modelName];
            const parameters = route.parameters ? route.parameters.map(param => ({
                ...param,
                description: param.description.replaceAll(replaceKeyRegex, modelName)
            })) : [];
            const responses = Object.fromEntries(Object.entries(route.responses).map(([status, resp]) => [status, getResponseSchema(status, route.method, modelName, resp)]));
            const isWrite = route.method === 'POST' || route.method === 'PUT';
            let requestBody;
            if (isWrite) {
                requestBody = { $ref: `#/components/requestBodies/${modelName}` };
            }
            // ignore _action field as its unset
            // eslint-disable-next-line no-unused-vars
            const { _action, ...rest } = route;
            return { ...rest, path, summary, description, tags, parameters, responses, requestBody };
        });
        generateSwaggerPaths(swaggerOptions, paths);
    }
}
/**
 * Adds the provided routes to the Swagger paths
 * @param swaggerOptions Swagger configuration options
 * @param routes Array of routes to generate Swagger paths for
 */
function generateSwaggerPaths(swaggerOptions, routes) {
    if (swaggerOptions.definition === undefined || !swaggerOptions.definition.paths) {
        throw new Error('Swagger definition or paths not initialized');
    }
    for (const route of routes) {
        if (!swaggerOptions.definition.paths[route.path]) {
            swaggerOptions.definition.paths[route.path] = {};
        }
        swaggerOptions.definition.paths[route.path][route.method.toLowerCase()] = Object.fromEntries(Object.entries(route).filter(([key]) => key !== 'path' && key !== 'method'));
    }
}
/**
 * Adds the provided models as Swagger schemas
 * @param swaggerOptions Swagger configuration options
 * @param models Array of models to generate schemas for, should extend Sequelize Model and implement extra attributes
 */
function generateSwaggerSchemas(swaggerOptions, models) {
    if (swaggerOptions.definition === undefined || !swaggerOptions.definition.components?.schemas || !swaggerOptions.definition.components.requestBodies) {
        throw new Error('Swagger definition or components not initialized');
    }
    for (const model of models) {
        const modelName = model.name;
        const properties = Object.fromEntries(Object.entries(model.getAttributes()).map(([key, attribute]) => [
            key,
            convertToSwaggerType(attribute.type.key, key)
        ]));
        let response = properties;
        if (model.responseBody !== undefined && Array.isArray(model.responseBody)) {
            response = Object.fromEntries(Object.entries(properties).filter(([key, _object]) => model.responseBody?.includes(key)));
        }
        swaggerOptions.definition.components.schemas[modelName] = { type: 'object', properties: response };
        if (model.postBody !== undefined && Array.isArray(model.postBody)) {
            const filteredProperties = Object.fromEntries(Object.entries(properties).filter(([key, _object]) => model.postBody && model.postBody.includes(key)));
            swaggerOptions.definition.components.requestBodies[modelName] = {
                description: `A ${modelName} object`,
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: filteredProperties
                        }
                    }
                }
            };
        }
        else {
            swaggerOptions.definition.components.requestBodies[modelName] = {
                description: `A ${modelName} object`,
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: `#/components/schemas/${modelName}` }
                    }
                }
            };
        }
    }
}
/**
 * Converts Sequelize data types to Swagger schema types
 * @param sequelizeType Data type which is returned by database
 * @param key key is column name
 * @returns Swagger schema type object
 */
function convertToSwaggerType(sequelizeType, key) {
    switch (sequelizeType) {
        case 'DATE':
            return { type: 'string', format: 'date-time' };
        case 'STRING':
            return key === 'password' ? { type: 'string', writeOnly: true, format: 'password' } : { type: 'string' };
        case 'INTEGER':
            return { type: 'integer' };
        case 'BOOLEAN':
            return { type: 'boolean' };
        default:
            return { type: 'string' };
    }
}
;
