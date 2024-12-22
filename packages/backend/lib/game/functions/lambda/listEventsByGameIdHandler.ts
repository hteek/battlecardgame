import middy, { MiddyfiedHandler } from '@middy/core';

import { AppSyncResolverEvent } from 'aws-lambda';

import {
  appSyncResolver,
  dynamoDB,
  MiddlewareAppSyncResolverHandler,
  MiddlewareContext,
  powertools,
} from '../../../middleware/index.js';

import { Event, EventType, Game } from './model/index.js';

export type ListEventsByGameIdInput = {
  gameId: string;
};
export const baseHandler: MiddlewareAppSyncResolverHandler<ListEventsByGameIdInput, EventType[]> = async (
  event,
  context,
) => {
  const { id } = await Game.getById(context, event.arguments.gameId);
  return Event.findByGameId(context, id);
};

export const handler: MiddyfiedHandler<
  AppSyncResolverEvent<ListEventsByGameIdInput, Record<string, unknown> | null>,
  EventType[],
  Error,
  MiddlewareContext
> = middy(baseHandler).use(powertools()).use(appSyncResolver()).use(dynamoDB());
