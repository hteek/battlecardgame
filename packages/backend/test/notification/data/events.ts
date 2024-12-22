import { AppSyncResolverEvent, EventBridgeEvent } from 'aws-lambda';

import { NotificationDetail } from '../../../lib/notification/functions/lambda/onNotificationHandler.js';

export const appSyncResolverEvent = <T>(
  props?: { email?: string; roles?: string[]; sub?: string; userId?: string },
  args?: T,
) => {
  const { email, roles, sub, userId } = props || {};
  return {
    ...(args ? { arguments: args } : {}),
    identity: {
      claims: {
        email,
        ...(roles ? { roles: JSON.stringify(roles) } : {}),
        userId,
      },
      sub,
    },
  } as AppSyncResolverEvent<T>;
};

export const createNotificationEvent = (props: {
  target?: 'system' | 'user';
  action: 'INSERT' | 'MODIFY' | 'REMOVE';
  entity: string;
  id: string;
  referenceId?: string;
  userId?: string;
}) => {
  const { target = 'system', action, entity, id, referenceId, userId } = props;
  return {
    version: '0',
    id: 'ee8716cb-b97c-5e23-62ee-ec216bd4a583',
    'detail-type': `battlecardgame-${target}-notification`,
    source: 'custom',
    account: '469901899619',
    time: '2021-11-02T14:18:46Z',
    region: 'eu-central-1',
    resources: ['lambda'],
    detail: {
      action,
      entity,
      id,
      referenceId,
      userId,
    },
  } as EventBridgeEvent<`battlecardgame-${typeof target}-notification`, NotificationDetail>;
};
