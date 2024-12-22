import middy, { MiddyfiedHandler } from '@middy/core';

import { AppSyncResolverEvent } from 'aws-lambda';

import {
  appSyncResolver,
  dynamoDB,
  MiddlewareAppSyncResolverHandler,
  MiddlewareContext,
  notification,
  powertools,
} from '../../../middleware/index.js';
import { Event, EventData, EventName, EventType, Game } from './model/index.js';

export type PlayGameInput = {
  id: string;
  name: EventName;
  data?: EventData;
};

export const baseHandler: MiddlewareAppSyncResolverHandler<PlayGameInput, EventType> = async (event, context) => {
  const { userId: currentUserId } = context.appSync ?? {};
  const { id, name, data } = event.arguments;
  const { opponentId, userId } = await Game.getById(context, id);
  return Event.createFromGameIdOpponentIdAndName(
    context,
    id,
    currentUserId === userId ? opponentId : userId,
    name,
    data,
  );
};

export const handler: MiddyfiedHandler<
  AppSyncResolverEvent<PlayGameInput, Record<string, unknown> | null>,
  EventType,
  Error,
  MiddlewareContext
> = middy(baseHandler)
  .use(powertools())
  .use(appSyncResolver())
  .use(dynamoDB())
  .use(
    notification({
      targets: ['user'],
      action: 'CREATE',
      entity: 'Event',
      userIdProp: 'opponentId',
    }),
  );
