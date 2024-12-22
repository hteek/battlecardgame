import { IGraphqlApi } from 'aws-cdk-lib/aws-appsync';

import { CodeFirstSchema } from 'awscdk-appsync-utils';

import { addIamSubscriptionMutation } from '../util.js';

import { notification } from './types.js';

export const addNotificationSubscriptionMutation = (api: IGraphqlApi, schema: CodeFirstSchema) =>
  addIamSubscriptionMutation(api, schema, 'notification', notification);

export const addUserNotificationSubscriptionMutation = (api: IGraphqlApi, schema: CodeFirstSchema) =>
  addIamSubscriptionMutation(api, schema, 'userNotification', notification);
