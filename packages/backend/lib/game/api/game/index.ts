import { IGraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

import { CodeFirstSchema } from 'awscdk-appsync-utils';

import { addCreateGameMutation } from './mutations.js';
import { addGetGameByIdQuery, addListGamesByOpponentIdQuery, addListGamesQuery } from './queries.js';
import { game } from './types.js';

export interface GameFunctions {
  readonly createGameFunction: IFunction;
  readonly getGameByIdFunction: IFunction;
  readonly listGamesByOpponentIdFunction: IFunction;
  readonly listGamesFunction: IFunction;
}

export const addGameMutations = (api: IGraphqlApi, schema: CodeFirstSchema, functions: GameFunctions) => {
  const { createGameFunction } = functions;
  addCreateGameMutation(api, schema, createGameFunction);
};

export const addGameQueries = (api: IGraphqlApi, schema: CodeFirstSchema, functions: GameFunctions) => {
  const { getGameByIdFunction, listGamesByOpponentIdFunction, listGamesFunction } = functions;
  addGetGameByIdQuery(api, schema, getGameByIdFunction);
  addListGamesByOpponentIdQuery(api, schema, listGamesByOpponentIdFunction);
  addListGamesQuery(api, schema, listGamesFunction);
};

export const addGameTypes = (schema: CodeFirstSchema) => {
  schema.addType(game);
};

export const addGameApi = (api: IGraphqlApi, schema: CodeFirstSchema, functions: GameFunctions) => {
  addGameMutations(api, schema, functions);
  addGameQueries(api, schema, functions);
  addGameTypes(schema);
};
