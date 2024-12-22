import { IGraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

import { CodeFirstSchema } from 'awscdk-appsync-utils';

import { addNotificationSubscriptionMutation, addUserNotificationSubscriptionMutation } from './mutations.js';
import { addListNotificationsQuery } from './queries.js';
import { addOnNotificationSubscription, addOnUserNotificationSubscription } from './subscriptions.js';
import { notification } from './types.js';

export const addNotificationApi = (api: IGraphqlApi, schema: CodeFirstSchema, table: ITable) => {
  addNotificationSubscriptionMutation(api, schema);
  addUserNotificationSubscriptionMutation(api, schema);

  addListNotificationsQuery(api, schema);

  addOnNotificationSubscription(schema);
  addOnUserNotificationSubscription(api, schema, table);

  schema.addType(notification);
};
