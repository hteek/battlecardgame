import { EventBridgeEvent, Handler } from 'aws-lambda';
import lambdaTester from 'lambda-tester';
import * as MockDate from 'mockdate';
import nock from 'nock';

import { handler, NotificationDetail } from '../../../../lib/notification/functions/lambda/onNotificationHandler.js';

import { createNotificationEvent } from '../../data/events.js';
import { apiGraphqlUrl, appSyncEndpointUrl, awsAccessKeyId, awsSecretAccessKey } from '../../../data/index.js';

describe('onNotification handler', () => {
  const OLD_ENV = process.env;

  const operationName = 'Notification';
  const query =
    'mutation Notification($action: String!, $entity: String!, $id: ID!, $referenceId: ID, $userId: ID) { notification(action: $action, entity: $entity, id: $id, referenceId: $referenceId, userId: $userId) { action, entity, id, referenceId, userId } }';

  const userOperationName = 'UserNotification';
  const userQuery =
    'mutation UserNotification($action: String!, $entity: String!, $id: ID!, $referenceId: ID, $userId: ID) { userNotification(action: $action, entity: $entity, id: $id, referenceId: $referenceId, userId: $userId) { action, entity, id, referenceId, userId } }';

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // make a copy
    process.env['APPSYNC_ENDPOINT_URL'] = apiGraphqlUrl;
    process.env['AWS_REGION'] = 'eu-central-1';
    process.env['AWS_ACCESS_KEY_ID'] = awsAccessKeyId;
    process.env['AWS_SECRET_ACCESS_KEY'] = awsSecretAccessKey;
  });

  afterEach(() => {
    vi.clearAllMocks();
    MockDate.reset();
    process.env = OLD_ENV; // restore old env
  });

  const testHandler = handler as unknown as Handler<
    EventBridgeEvent<'battlecardgame-system-notification' | 'battlecardgame-user-notification', NotificationDetail>,
    void
  >;

  test('returns successfully (insert)', async () => {
    const scope = nock(appSyncEndpointUrl)
      .post('/graphql', {
        operationName,
        query,
        variables: { action: 'INSERT', entity: 'Test', id: '1234' },
      })
      .reply(200, {
        data: {
          notification: {
            action: 'INSERT',
            entity: 'Test',
            id: '1234',
          },
        },
      });
    return lambdaTester(testHandler)
      .event(
        createNotificationEvent({
          action: 'INSERT',
          entity: 'Test',
          id: '1234',
        }),
      )
      .expectResolve(() => {
        expect(scope.isDone()).toBeTruthy();
      });
  });

  test('returns successfully (user insert)', async () => {
    const scope = nock(appSyncEndpointUrl)
      .post('/graphql', {
        operationName: userOperationName,
        query: userQuery,
        variables: { action: 'INSERT', entity: 'Test', id: '1234' },
      })
      .reply(200, {
        data: {
          notification: {
            action: 'INSERT',
            entity: 'Test',
            id: '1234',
          },
        },
      });
    return lambdaTester(testHandler)
      .event(
        createNotificationEvent({
          target: 'user',
          action: 'INSERT',
          entity: 'Test',
          id: '1234',
        }),
      )
      .expectResolve(() => {
        expect(scope.isDone()).toBeTruthy();
      });
  });

  test('returns successfully (modify)', async () => {
    const scope = nock(appSyncEndpointUrl)
      .post('/graphql', {
        operationName,
        query,
        variables: { action: 'MODIFY', entity: 'Test', id: '1234' },
      })
      .reply(200, {
        data: {
          notification: {
            action: 'MODIFY',
            entity: 'Test',
            id: '1234',
          },
        },
      });
    return lambdaTester(testHandler)
      .event(
        createNotificationEvent({
          action: 'MODIFY',
          entity: 'Test',
          id: '1234',
        }),
      )
      .expectResolve(() => {
        expect(scope.isDone()).toBeTruthy();
      });
  });

  test('returns successfully (remove)', async () => {
    const scope = nock(appSyncEndpointUrl)
      .post('/graphql', {
        operationName,
        query,
        variables: { action: 'REMOVE', entity: 'Test', id: '1234' },
      })
      .reply(200, {
        data: {
          notification: {
            action: 'REMOVE',
            entity: 'Test',
            id: '1234',
          },
        },
      });
    return lambdaTester(testHandler)
      .event(
        createNotificationEvent({
          action: 'REMOVE',
          entity: 'Test',
          id: '1234',
        }),
      )
      .expectResolve(() => {
        expect(scope.isDone()).toBeTruthy();
      });
  });

  test('returns successfully (reference id)', async () => {
    const scope = nock(appSyncEndpointUrl)
      .post('/graphql', {
        operationName,
        query,
        variables: {
          action: 'MODIFY',
          entity: 'Test',
          id: '1234',
          referenceId: '5678',
        },
      })
      .reply(200, {
        data: {
          notification: {
            action: 'MODIFY',
            entity: 'Test',
            id: '1234',
            referenceId: '5678',
          },
        },
      });
    return lambdaTester(testHandler)
      .event(
        createNotificationEvent({
          action: 'MODIFY',
          entity: 'Test',
          id: '1234',
          referenceId: '5678',
        }),
      )
      .expectResolve(() => {
        expect(scope.isDone()).toBeTruthy();
      });
  });

  test('returns successfully (user id)', async () => {
    const scope = nock(appSyncEndpointUrl)
      .post('/graphql', {
        operationName,
        query,
        variables: {
          action: 'MODIFY',
          entity: 'Test',
          id: '1234',
          userId: '5678',
        },
      })
      .reply(200, {
        data: {
          notification: {
            action: 'MODIFY',
            entity: 'Test',
            id: '1234',
            userId: '5678',
          },
        },
      });
    return lambdaTester(testHandler)
      .event(
        createNotificationEvent({
          action: 'MODIFY',
          entity: 'Test',
          id: '1234',
          userId: '5678',
        }),
      )
      .expectResolve(() => {
        expect(scope.isDone()).toBeTruthy();
      });
  });
});
