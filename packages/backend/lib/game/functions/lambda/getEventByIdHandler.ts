import middy, { MiddyfiedHandler } from '@middy/core';

import { AppSyncResolverEvent } from 'aws-lambda';

import {
  appSyncResolver,
  dynamoDB,
  MiddlewareAppSyncResolverHandler,
  MiddlewareContext,
  powertools,
} from '../../../middleware/index.js';

import { Event, EventType } from './model/index.js';

export type GetEventByIdInput = {
  id: string;
};
export const baseHandler: MiddlewareAppSyncResolverHandler<GetEventByIdInput, EventType> = async (event, context) =>
  Event.getById(context, event.arguments.id);

export const handler: MiddyfiedHandler<
  AppSyncResolverEvent<GetEventByIdInput, Record<string, unknown> | null>,
  EventType,
  Error,
  MiddlewareContext
> = middy(baseHandler).use(powertools()).use(appSyncResolver()).use(dynamoDB());
