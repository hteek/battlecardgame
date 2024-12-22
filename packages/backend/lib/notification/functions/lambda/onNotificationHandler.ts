import middy from '@middy/core';

import {
  appSyncClient,
  MiddlewareEventBridgeHandler,
  MiddyfiedMiddlewareEventBridgeHandler,
  powertools,
} from '../../../middleware/index.js';

import { notifySystem, notifyUser } from './graphql/index.js';

export type NotificationDetail = {
  action: string;
  entity: string;
  id: string;
  referenceId?: string;
  userId?: string;
};

const baseHandler: MiddlewareEventBridgeHandler<
  'battlecardgame-system-notification' | 'battlecardgame-user-notification',
  NotificationDetail,
  unknown
> = async (event, context) => {
  switch (event['detail-type']) {
    case 'battlecardgame-system-notification':
      await notifySystem(context, event.detail);
      break;
    case 'battlecardgame-user-notification':
      await notifyUser(context, event.detail);
      break;
  }
};

export const handler: MiddyfiedMiddlewareEventBridgeHandler<
  'battlecardgame-system-notification' | 'battlecardgame-user-notification',
  NotificationDetail,
  unknown
> = middy(baseHandler).use(powertools()).use(appSyncClient());
