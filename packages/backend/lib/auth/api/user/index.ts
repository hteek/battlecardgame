import { IGraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

import { CodeFirstSchema } from 'awscdk-appsync-utils';

import { addCurrentUserQuery } from './queries.js';
import { user } from './types.js';

export interface UserFunctions {
  readonly currentUserFunction: IFunction;
}

export const addUserQueries = (api: IGraphqlApi, schema: CodeFirstSchema, functions: UserFunctions) => {
  const { currentUserFunction } = functions;
  addCurrentUserQuery(api, schema, currentUserFunction);
};

export const addUserTypes = (schema: CodeFirstSchema) => {
  schema.addType(user);
};

export const addUserApi = (api: IGraphqlApi, schema: CodeFirstSchema, functions: UserFunctions) => {
  addUserQueries(api, schema, functions);
  addUserTypes(schema);
};
