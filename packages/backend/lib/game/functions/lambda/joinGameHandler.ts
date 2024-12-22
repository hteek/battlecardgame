import middy, { MiddyfiedHandler } from '@middy/core';

import { AppSyncResolverEvent } from 'aws-lambda';

import {
  appSyncResolver,
  dynamoDB,
  getAppSyncFromContext,
  MiddlewareAppSyncResolverHandler,
  MiddlewareContext,
  notification,
  powertools,
} from '../../../middleware/index.js';
import { Event, EventName, EventType, Game } from './model/index.js';

export type JoinGameInput = {
  id: string;
};

export const baseHandler: MiddlewareAppSyncResolverHandler<JoinGameInput, EventType> = async (event, context) => {
  const { userId: currentUser } = getAppSyncFromContext(context);
  const { id, opponentId, userId } = await Game.getById(context, event.arguments.id);
  if (currentUser !== opponentId) {
    throw new Error('only the opponent can join the game');
  }
  return Event.createFromGameIdOpponentIdAndName(context, id, userId, EventName.Join);
};

export const handler: MiddyfiedHandler<
  AppSyncResolverEvent<JoinGameInput, Record<string, unknown> | null>,
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
