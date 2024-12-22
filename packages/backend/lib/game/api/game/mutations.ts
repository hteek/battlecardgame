import { IGraphqlApi, MappingTemplate } from 'aws-cdk-lib/aws-appsync';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

import { CodeFirstSchema, GraphqlType, ResolvableField } from 'awscdk-appsync-utils';

import { game } from './types.js';

export const addCreateGameMutation = (api: IGraphqlApi, schema: CodeFirstSchema, lambdaFunction: IFunction) =>
  schema.addMutation(
    'createGame',
    new ResolvableField({
      args: { email: GraphqlType.awsEmail({ isRequired: true }) },
      dataSource: api.addLambdaDataSource(`CreateGameDataSource`, lambdaFunction),
      requestMappingTemplate: MappingTemplate.lambdaRequest(),
      responseMappingTemplate: MappingTemplate.lambdaResult(),
      returnType: game.attribute(),
    }),
  );
