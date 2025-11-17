import { DataType } from 'sequelize';
import swaggerJsdoc from 'swagger-jsdoc';
import { CustomModel } from './types';
/**
 * Generates Swagger paths for the provided models
 * @param swaggerOptions Swagger configuration options
 * @param models Array of models to generate paths for, should extend Sequelize Model and implement extra attributes
 */
export declare function generateSwaggerPathForModels(swaggerOptions: swaggerJsdoc.OAS3Options, models: CustomModel[]): void;
/**
 * Adds the provided models as Swagger schemas
 * @param swaggerOptions Swagger configuration options
 * @param models Array of models to generate schemas for, should extend Sequelize Model and implement extra attributes
 */
export declare function generateSwaggerSchemas(swaggerOptions: swaggerJsdoc.OAS3Options, models: CustomModel[]): void;
/**
 * Converts Sequelize data types to Swagger schema types
 * @param sequelizeType Data type which is returned by database
 * @param key key is column name
 * @returns Swagger schema type object
 */
export declare function convertToSwaggerType(sequelizeType: DataType, key: string): {
    type: string;
    format: string;
    writeOnly?: undefined;
} | {
    type: string;
    writeOnly: boolean;
    format: string;
} | {
    type: string;
    format?: undefined;
    writeOnly?: undefined;
};
