import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import middy from '@middy/core';
import { getInternal } from '@middy/util';

export * from './dynamoDBRecord.js';
export * from './handler.js';
export * from './notification.js';

const client = new EventBridgeClient({});

export const eventBridge = (): middy.MiddlewareObj => ({
  before: async (request) => {
    const eventBusName = process.env['EVENT_BUS_NAME'];

    if (!eventBusName) {
      throw new Error('no event bus name given');
    }

    const { functionName, invokedFunctionArn } = request.context;

    Object.assign(request.internal, {
      eventBusName,
      notify: async (action: 'INSERT' | 'MODIFY' | 'REMOVE', entity: string, id: string) =>
        client.send(
          new PutEventsCommand({
            Entries: [
              {
                Detail: JSON.stringify({ action, entity, id }),
                DetailType: 'battlecardgame-system-notification',
                EventBusName: eventBusName,
                Source: functionName,
                Resources: [invokedFunctionArn],
                Time: new Date(),
              },
            ],
          }),
        ),
    });

    Object.assign(request.context, {
      eventBridge: {
        ...(await getInternal(['eventBusName'], request)),
        ...(await getInternal(['notify'], request)),
      },
    });
  },
});
