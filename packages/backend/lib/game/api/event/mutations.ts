import { IGraphqlApi, MappingTemplate } from 'aws-cdk-lib/aws-appsync';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

import { CodeFirstSchema, GraphqlType, ResolvableField } from 'awscdk-appsync-utils';

import { event, eventDataInput } from './types.js';

export const addJoinGameMutation = (api: IGraphqlApi, schema: CodeFirstSchema, lambdaFunction: IFunction) =>
  schema.addMutation(
    'joinGame',
    new ResolvableField({
      args: { id: GraphqlType.id({ isRequired: true }) },
      dataSource: api.addLambdaDataSource(`JoinGameDataSource`, lambdaFunction),
      requestMappingTemplate: MappingTemplate.lambdaRequest(),
      responseMappingTemplate: MappingTemplate.lambdaResult(),
      returnType: event.attribute(),
    }),
  );

export const addPlayGameMutation = (api: IGraphqlApi, schema: CodeFirstSchema, lambdaFunction: IFunction) =>
  schema.addMutation(
    'playGame',
    new ResolvableField({
      args: {
        id: GraphqlType.id({ isRequired: true }),
        name: GraphqlType.string({ isRequired: true }),
        data: GraphqlType.intermediate({ intermediateType: eventDataInput }),
      },
      dataSource: api.addLambdaDataSource(`PlayGameDataSource`, lambdaFunction),
      requestMappingTemplate: MappingTemplate.lambdaRequest(),
      responseMappingTemplate: MappingTemplate.lambdaResult(),
      returnType: event.attribute(),
    }),
  );
