import middy from '@middy/core';

import { EventBridgeEvent } from 'aws-lambda';
import { isString } from 'remeda';

import { eventBridge, getEventBridgeFromContext, MiddlewareContext } from '../../../lib/middleware/index.js';

import { eventBusName } from '../../data/index.js';

export const checkEventBridgeMiddlewareContext = (context: MiddlewareContext) => {
  const { eventBusName } = getEventBridgeFromContext(context);
  if (!isString(eventBusName)) {
    throw new Error('no event bus name found');
  }
};

describe('EventBridge middleware handler', () => {
  const OLD_ENV = process.env;

  describe('event bridge', () => {
    const handler = middy<EventBridgeEvent<'event', void>, void, Error, MiddlewareContext>()
      .use(eventBridge())
      .handler(async (_, context) => checkEventBridgeMiddlewareContext(context));

    const event = {} as EventBridgeEvent<'event', void>;
    const context = {} as MiddlewareContext;

    beforeEach(() => {
      process.env = { ...OLD_ENV }; // make a copy
      process.env['EVENT_BUS_NAME'] = eventBusName;
    });

    afterEach(() => {
      vi.clearAllMocks();
      process.env = OLD_ENV; // restore old env
    });

    test('called successfully', async () => expect(handler(event, context)).resolves.toBeUndefined());

    test('missing eventBus name', async () => {
      process.env['EVENT_BUS_NAME'] = undefined;
      return expect(handler(event, context)).rejects.toThrowError('no event bus name given');
    });
  });
});
