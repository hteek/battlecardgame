import { IGraphqlApi, MappingTemplate } from 'aws-cdk-lib/aws-appsync';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

import { CodeFirstSchema, GraphqlType, ResolvableField } from 'awscdk-appsync-utils';

import { game } from './types.js';

export const addGetGameByIdQuery = (api: IGraphqlApi, schema: CodeFirstSchema, lambdaFunction: IFunction) =>
  schema.addQuery(
    'getGameById',
    new ResolvableField({
      args: { id: GraphqlType.id({ isRequired: true }) },
      dataSource: api.addLambdaDataSource(`GetGameByIdDataSource`, lambdaFunction),
      requestMappingTemplate: MappingTemplate.lambdaRequest(),
      responseMappingTemplate: MappingTemplate.lambdaResult(),
      returnType: game.attribute(),
    }),
  );

export const addListGamesByOpponentIdQuery = (api: IGraphqlApi, schema: CodeFirstSchema, lambdaFunction: IFunction) =>
  schema.addQuery(
    'listGamesByOpponentId',
    new ResolvableField({
      dataSource: api.addLambdaDataSource(`ListGamesByOpponentIdDataSource`, lambdaFunction),
      requestMappingTemplate: MappingTemplate.lambdaRequest(),
      responseMappingTemplate: MappingTemplate.lambdaResult(),
      returnType: game.attribute({ isList: true }),
    }),
  );

export const addListGamesQuery = (api: IGraphqlApi, schema: CodeFirstSchema, lambdaFunction: IFunction) =>
  schema.addQuery(
    'listGames',
    new ResolvableField({
      dataSource: api.addLambdaDataSource(`ListGamesDataSource`, lambdaFunction),
      requestMappingTemplate: MappingTemplate.lambdaRequest(),
      responseMappingTemplate: MappingTemplate.lambdaResult(),
      returnType: game.attribute({ isList: true }),
    }),
  );
