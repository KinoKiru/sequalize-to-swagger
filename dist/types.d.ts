import { Model, ModelStatic } from "sequelize";
/**
 * Extra fields added to Sequelize Model for Swagger generation
 * @var actions - List of actions supported by the model (e.g., 'CREATE', 'READ', etc.)
 * @var postBody - Optional list of fields to include in the POST request body
 * @var responseBody - Optional list of fields to include in the response body
 */
export type ExtraModelFields = {
    actions: string[];
    postBody?: string[];
    responseBody?: string[];
};
/**
 * CustomModel type combining Sequelize Model with ExtraModelFields
 */
export type CustomModel = ModelStatic<Model> & ExtraModelFields;
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type Route = {
    _action?: string;
    action: string;
    method: Method;
    path: string;
    summary: string;
    description: string;
    tags: string[];
    parameters?: Array<{
        name: string;
        in: 'path' | 'query' | 'header' | 'cookie';
        required: boolean;
        description: string;
        schema: {
            type: string;
        };
    }>;
    requestBody?: any;
    responses: {
        [status: number]: {
            description: string;
            content?: any;
        };
    };
};
