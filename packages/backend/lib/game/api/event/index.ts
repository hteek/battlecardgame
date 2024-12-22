import { IGraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

import { CodeFirstSchema } from 'awscdk-appsync-utils';

import { addJoinGameMutation, addPlayGameMutation } from './mutations.js';
import { addGetEventByIdQuery, addListEventsByGameIdQuery } from './queries.js';
import { event, eventData, eventDataInput } from './types.js';

export interface EventFunctions {
  readonly getEventByIdFunction: IFunction;
  readonly joinGameFunction: IFunction;
  readonly listEventsByGameIdFunction: IFunction;
  readonly playGameFunction: IFunction;
}

export const addEventMutations = (api: IGraphqlApi, schema: CodeFirstSchema, functions: EventFunctions) => {
  const { joinGameFunction, playGameFunction } = functions;
  addJoinGameMutation(api, schema, joinGameFunction);
  addPlayGameMutation(api, schema, playGameFunction);
};

export const addEventQueries = (api: IGraphqlApi, schema: CodeFirstSchema, functions: EventFunctions) => {
  const { getEventByIdFunction, listEventsByGameIdFunction } = functions;
  addGetEventByIdQuery(api, schema, getEventByIdFunction);
  addListEventsByGameIdQuery(api, schema, listEventsByGameIdFunction);
};

export const addEventTypes = (schema: CodeFirstSchema) => {
  schema.addType(event);
  schema.addType(eventData);
  schema.addType(eventDataInput);
};

export const addEventApi = (api: IGraphqlApi, schema: CodeFirstSchema, functions: EventFunctions) => {
  addEventMutations(api, schema, functions);
  addEventQueries(api, schema, functions);
  addEventTypes(schema);
};
