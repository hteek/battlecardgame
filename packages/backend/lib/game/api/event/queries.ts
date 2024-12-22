import { IGraphqlApi, MappingTemplate } from 'aws-cdk-lib/aws-appsync';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

import { CodeFirstSchema, GraphqlType, ResolvableField } from 'awscdk-appsync-utils';

import { event } from './types.js';

export const addGetEventByIdQuery = (api: IGraphqlApi, schema: CodeFirstSchema, lambdaFunction: IFunction) =>
  schema.addQuery(
    'getEventById',
    new ResolvableField({
      args: { id: GraphqlType.id({ isRequired: true }) },
      dataSource: api.addLambdaDataSource(`GetEventByIdDataSource`, lambdaFunction),
      requestMappingTemplate: MappingTemplate.lambdaRequest(),
      responseMappingTemplate: MappingTemplate.lambdaResult(),
      returnType: event.attribute(),
    }),
  );

export const addListEventsByGameIdQuery = (api: IGraphqlApi, schema: CodeFirstSchema, lambdaFunction: IFunction) =>
  schema.addQuery(
    'listEventsByGameId',
    new ResolvableField({
      args: { gameId: GraphqlType.id({ isRequired: true }) },
      dataSource: api.addLambdaDataSource(`ListEventsByGameIdDataSource`, lambdaFunction),
      requestMappingTemplate: MappingTemplate.lambdaRequest(),
      responseMappingTemplate: MappingTemplate.lambdaResult(),
      returnType: event.attribute({ isList: true }),
    }),
  );
