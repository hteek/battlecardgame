import { IGraphqlApi, MappingTemplate } from 'aws-cdk-lib/aws-appsync';

import { CodeFirstSchema, ResolvableField } from 'awscdk-appsync-utils';

import { notification } from './types.js';

export const addListNotificationsQuery = (api: IGraphqlApi, schema: CodeFirstSchema) =>
  schema.addQuery(
    'listNotifications',
    new ResolvableField({
      dataSource: api.addNoneDataSource('ListNotificationsDataSource'),
      requestMappingTemplate: MappingTemplate.fromString(
        '{"version": "2018-05-29", "payload": $util.toJson($context.arguments)}',
      ),
      responseMappingTemplate: MappingTemplate.fromString('$util.toJson($context.result)'),
      returnType: notification.attribute({ isList: true }),
    }),
  );
