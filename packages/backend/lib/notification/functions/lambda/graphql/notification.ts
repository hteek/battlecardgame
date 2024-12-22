import { getAppSyncFromContext, MiddlewareContext } from '../../../../middleware/index.js';

export const notifySystem = (
  context: MiddlewareContext,
  variables: {
    action: string;
    entity: string;
    id: string;
    referenceId?: string;
    userId?: string;
  },
) => {
  const { request } = getAppSyncFromContext(context);

  return request({
    operationName: 'Notification',
    query:
      'mutation Notification($action: String!, $entity: String!, $id: ID!, $referenceId: ID, $userId: ID) { notification(action: $action, entity: $entity, id: $id, referenceId: $referenceId, userId: $userId) { action, entity, id, referenceId, userId } }',
    variables,
  });
};

export const notifyUser = (
  context: MiddlewareContext,
  variables: {
    action: string;
    entity: string;
    id: string;
    referenceId?: string;
    userId?: string;
  },
) => {
  const { request } = getAppSyncFromContext(context);

  return request({
    operationName: 'UserNotification',
    query:
      'mutation UserNotification($action: String!, $entity: String!, $id: ID!, $referenceId: ID, $userId: ID) { userNotification(action: $action, entity: $entity, id: $id, referenceId: $referenceId, userId: $userId) { action, entity, id, referenceId, userId } }',
    variables,
  });
};
