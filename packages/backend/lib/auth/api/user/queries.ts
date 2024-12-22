import { IGraphqlApi, MappingTemplate } from 'aws-cdk-lib/aws-appsync';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

import { CodeFirstSchema, ResolvableField } from 'awscdk-appsync-utils';

import { user } from './types.js';

export const addCurrentUserQuery = (api: IGraphqlApi, schema: CodeFirstSchema, lambdaFunction: IFunction) =>
  schema.addQuery(
    'currentUser',
    new ResolvableField({
      dataSource: api.addLambdaDataSource(`CurrentUserDataSource`, lambdaFunction),
      requestMappingTemplate: MappingTemplate.lambdaRequest(),
      responseMappingTemplate: MappingTemplate.lambdaResult(),
      returnType: user.attribute(),
    }),
  );
