import { IGraphqlApi, MappingTemplate } from 'aws-cdk-lib/aws-appsync';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

import { CodeFirstSchema, Directive, Field, GraphqlType, ResolvableField } from 'awscdk-appsync-utils';

import { UserNotificationFunction } from './functions/index.js';
import { notification } from './types.js';

export const addOnNotificationSubscription = (schema: CodeFirstSchema) =>
  schema.addSubscription(
    'onNotification',
    new Field({
      directives: [Directive.subscribe('notification')],
      returnType: notification.attribute(),
    }),
  );

export const addOnUserNotificationSubscription = (api: IGraphqlApi, schema: CodeFirstSchema, table: ITable) =>
  schema.addSubscription(
    'onUserNotification',
    new ResolvableField({
      args: { userId: GraphqlType.id({ isRequired: true }) },
      dataSource: api.addLambdaDataSource(
        `OnUserNotificationUserDataSource`,
        new UserNotificationFunction(api, { table }),
      ),
      requestMappingTemplate: MappingTemplate.lambdaRequest(),
      responseMappingTemplate: MappingTemplate.lambdaResult(),
      directives: [Directive.subscribe('userNotification')],
      returnType: notification.attribute(),
    }),
  );
