import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import middy from '@middy/core';

import { mockClient } from 'aws-sdk-client-mock';

import { MiddlewareContext, notification, NotificationOpts } from '../../../lib/middleware/index.js';

import { eventBusName } from '../../data/index.js';

type TestEntity = {
  id: string;
  _type: string;
  referenceId?: string;
  userId?: string;
  customId?: string;
};

describe('Notification middleware handler', () => {
  const OLD_ENV = process.env;

  const eventBridgeClientMock = mockClient(EventBridgeClient);
  const context = {} as MiddlewareContext;

  describe('notification', () => {
    const handler = (opts: NotificationOpts, response?: TestEntity) =>
      middy<void, TestEntity | undefined, Error, MiddlewareContext>()
        .use(notification(opts))
        .handler(async () => response);

    const handlerMultiple = (opts: NotificationOpts, response: TestEntity[]) =>
      middy<void, TestEntity[], Error, MiddlewareContext>()
        .use(notification(opts))
        .handler(async () => response);

    beforeEach(() => {
      process.env = { ...OLD_ENV }; // make a copy
      process.env['EVENT_BUS_NAME'] = eventBusName;
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2000-02-20T23:00:00.000Z'));
    });

    afterEach(() => {
      vi.clearAllMocks();
      vi.useRealTimers();
      eventBridgeClientMock.reset();
      process.env = OLD_ENV; // restore old env
    });

    test('called successfully (default)', async () => {
      eventBridgeClientMock.on(PutEventsCommand).resolves({});

      const opts: NotificationOpts = { action: 'INSERT', entity: 'TestEntity' };
      const response: TestEntity = { id: 'id', _type: 'TestEntity' };

      await expect(handler(opts, response)(undefined, context)).resolves.toStrictEqual(response);

      expect(eventBridgeClientMock.calls()).toHaveLength(1);
      expect(eventBridgeClientMock.call(0).args).toHaveLength(1);
      expect(eventBridgeClientMock.call(0).args[0].input).toEqual({
        Entries: [
          {
            Detail: JSON.stringify({
              action: 'INSERT',
              entity: 'TestEntity',
              id: 'id',
            }),
            DetailType: 'battlecardgame-admin-notification',
            EventBusName: eventBusName,
            Resources: [undefined],
            Source: undefined,
            Time: new Date('2000-02-20T23:00:00.000Z'),
          },
        ],
      });
    });

    test('called successfully (multiple)', async () => {
      eventBridgeClientMock.on(PutEventsCommand).resolves({});

      const opts: NotificationOpts = { action: 'INSERT', entity: 'TestEntity' };
      const response: TestEntity[] = [
        { id: 'id', _type: 'TestEntity' },
        { id: 'id1', _type: 'TestEntity' },
      ];

      await expect(handlerMultiple(opts, response)(undefined, context)).resolves.toStrictEqual(response);

      expect(eventBridgeClientMock.calls()).toHaveLength(1);
      expect(eventBridgeClientMock.call(0).args).toHaveLength(1);
      expect(eventBridgeClientMock.call(0).args[0].input).toEqual({
        Entries: [
          {
            Detail: JSON.stringify({
              action: 'INSERT',
              entity: 'TestEntity',
              id: 'id',
            }),
            DetailType: 'battlecardgame-admin-notification',
            EventBusName: eventBusName,
            Resources: [undefined],
            Source: undefined,
            Time: new Date('2000-02-20T23:00:00.000Z'),
          },
          {
            Detail: JSON.stringify({
              action: 'INSERT',
              entity: 'TestEntity',
              id: 'id1',
            }),
            DetailType: 'battlecardgame-admin-notification',
            EventBusName: eventBusName,
            Resources: [undefined],
            Source: undefined,
            Time: new Date('2000-02-20T23:00:00.000Z'),
          },
        ],
      });
    });

    test('called successfully (no events)', async () => {
      eventBridgeClientMock.on(PutEventsCommand).resolves({});

      const opts: NotificationOpts = { action: 'INSERT', entity: 'TestEntity' };

      await expect(handler(opts)(undefined, context)).resolves.toBeUndefined();

      expect(eventBridgeClientMock.calls()).toHaveLength(0);
    });

    test('called successfully (user custom user id)', async () => {
      eventBridgeClientMock.on(PutEventsCommand).resolves({});

      const opts: NotificationOpts = {
        action: 'INSERT',
        entity: 'TestEntity',
        targets: ['user'],
        userIdProp: 'customId',
      };
      const response: TestEntity = {
        id: 'id',
        customId: 'customId',
        _type: 'TestEntity',
      };

      await expect(handler(opts, response)(undefined, context)).resolves.toStrictEqual(response);

      expect(eventBridgeClientMock.calls()).toHaveLength(1);
      expect(eventBridgeClientMock.call(0).args).toHaveLength(1);
      expect(eventBridgeClientMock.call(0).args[0].input).toEqual({
        Entries: [
          {
            Detail: JSON.stringify({
              action: 'INSERT',
              entity: 'TestEntity',
              id: 'id',
              userId: 'customId',
            }),
            DetailType: 'battlecardgame-user-notification',
            EventBusName: eventBusName,
            Resources: [undefined],
            Source: undefined,
            Time: new Date('2000-02-20T23:00:00.000Z'),
          },
        ],
      });
    });

    test('called successfully (admin, user)', async () => {
      eventBridgeClientMock.on(PutEventsCommand).resolves({});

      const opts: NotificationOpts = {
        action: 'INSERT',
        entity: 'TestEntity',
        targets: ['admin', 'user'],
      };
      const response: TestEntity = {
        id: 'id',
        _type: 'TestEntity',
        userId: '12345',
      };

      await expect(handler(opts, response)(undefined, context)).resolves.toStrictEqual(response);

      expect(eventBridgeClientMock.calls()).toHaveLength(1);
      expect(eventBridgeClientMock.call(0).args).toHaveLength(1);
      expect(eventBridgeClientMock.call(0).args[0].input).toEqual({
        Entries: [
          {
            Detail: JSON.stringify({
              action: 'INSERT',
              entity: 'TestEntity',
              id: 'id',
              userId: '12345',
            }),
            DetailType: 'battlecardgame-admin-notification',
            EventBusName: eventBusName,
            Resources: [undefined],
            Source: undefined,
            Time: new Date('2000-02-20T23:00:00.000Z'),
          },
          {
            Detail: JSON.stringify({
              action: 'INSERT',
              entity: 'TestEntity',
              id: 'id',
              userId: '12345',
            }),
            DetailType: 'battlecardgame-user-notification',
            EventBusName: eventBusName,
            Resources: [undefined],
            Source: undefined,
            Time: new Date('2000-02-20T23:00:00.000Z'),
          },
        ],
      });
    });

    test('called successfully (admin, user, system)', async () => {
      eventBridgeClientMock.on(PutEventsCommand).resolves({});

      const opts: NotificationOpts = {
        action: 'INSERT',
        entity: 'TestEntity',
        targets: ['admin', 'user', 'system'],
      };
      const response: TestEntity = { id: 'id', _type: 'type', userId: '12345' };

      await expect(handler(opts, response)(undefined, context)).resolves.toStrictEqual(response);

      expect(eventBridgeClientMock.calls()).toHaveLength(1);
      expect(eventBridgeClientMock.call(0).args).toHaveLength(1);
      expect(eventBridgeClientMock.call(0).args[0].input).toEqual({
        Entries: [
          {
            Detail: JSON.stringify({
              action: 'INSERT',
              entity: 'TestEntity',
              id: 'id',
              userId: '12345',
            }),
            DetailType: 'battlecardgame-admin-notification',
            EventBusName: eventBusName,
            Resources: [undefined],
            Source: undefined,
            Time: new Date('2000-02-20T23:00:00.000Z'),
          },
          {
            Detail: JSON.stringify({
              action: 'INSERT',
              entity: 'TestEntity',
              id: 'id',
              userId: '12345',
            }),
            DetailType: 'battlecardgame-user-notification',
            EventBusName: eventBusName,
            Resources: [undefined],
            Source: undefined,
            Time: new Date('2000-02-20T23:00:00.000Z'),
          },
          {
            Detail: JSON.stringify({
              action: 'INSERT',
              entity: 'TestEntity',
              id: 'id',
              userId: '12345',
            }),
            DetailType: 'battlecardgame-system-notification',
            EventBusName: eventBusName,
            Resources: [undefined],
            Source: undefined,
            Time: new Date('2000-02-20T23:00:00.000Z'),
          },
        ],
      });
    });

    test('error (user)', async () => {
      eventBridgeClientMock.on(PutEventsCommand).resolves({});

      const opts: NotificationOpts = {
        action: 'INSERT',
        entity: 'TestEntity',
        targets: ['user'],
      };
      const response: TestEntity = { id: 'id', _type: 'type' };

      return expect(handler(opts, response)(undefined, context)).rejects.toThrowError('no user id found in response');
    });

    test('missing eventBus name', async () => {
      process.env['EVENT_BUS_NAME'] = undefined;

      const opts: NotificationOpts = { action: 'INSERT', entity: 'TestEntity' };
      const response: TestEntity = { id: 'id', _type: 'type' };

      return expect(handler(opts, response)(undefined, context)).rejects.toThrowError('no event bus name given');
    });
  });
});
