import { EventBridgeClient, PutEventsCommand, PutEventsRequestEntry } from '@aws-sdk/client-eventbridge';
import middy from '@middy/core';
import { getInternal } from '@middy/util';

import { intersection, map, pick } from 'remeda';

export type NotificationOpts = {
  action: string;
  entity: string;
  targets?: ('admin' | 'system' | 'user')[];
  referenceIdProp?: string;
  userIdProp?: string;
};

const client = new EventBridgeClient({});

export const notification = (opts: NotificationOpts): middy.MiddlewareObj => {
  const { action, entity, targets = ['admin'], referenceIdProp = 'referenceId', userIdProp = 'userId' } = opts;

  return {
    before: async (request) => {
      const eventBusName = process.env['EVENT_BUS_NAME'];

      if (!eventBusName) {
        throw new Error('no event bus name given');
      }

      Object.assign(request.internal, {
        eventBusName,
      });
    },
    after: async (request) => {
      const { response } = request;

      if (response) {
        const responses = Array.isArray(response) ? response : [response];

        const { eventBusName: EventBusName } = await getInternal(['eventBusName'], request);

        const entries = responses.flatMap((r) => {
          const responseObject = pick(r, ['id', referenceIdProp, userIdProp]);
          const { id } = responseObject;
          const referenceId = responseObject[referenceIdProp];
          const userId = responseObject[userIdProp];

          if (action && entity && id) {
            if (intersection(targets, ['user']).length > 0 && !userId) {
              throw new Error('no user id found in response');
            }

            const Detail = JSON.stringify({
              action,
              entity,
              id,
              referenceId,
              userId,
            });

            const { functionName, invokedFunctionArn } = request.context;

            return map(targets, (target) => {
              return {
                Detail,
                DetailType: `battlecardgame-${target}-notification`,
                EventBusName,
                Source: functionName,
                Resources: [invokedFunctionArn],
                Time: new Date(),
              } as PutEventsRequestEntry;
            });
          }

          return [];
        });

        if (entries.length > 0) {
          await client.send(
            new PutEventsCommand({
              Entries: entries,
            }),
          );
        }
      }
    },
  };
};
