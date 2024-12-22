import middy, { MiddyfiedHandler } from '@middy/core';

import { AppSyncResolverEvent } from 'aws-lambda';

import {
  appSyncResolver,
  dynamoDB,
  MiddlewareAppSyncResolverHandler,
  MiddlewareContext,
  powertools,
} from '../../../middleware/index.js';

import { Game, GameType } from './model/index.js';

export type GetGameByIdInput = {
  id: string;
};
export const baseHandler: MiddlewareAppSyncResolverHandler<GetGameByIdInput, GameType> = async (event, context) =>
  Game.getById(context, event.arguments.id);

export const handler: MiddyfiedHandler<
  AppSyncResolverEvent<GetGameByIdInput, Record<string, unknown> | null>,
  GameType,
  Error,
  MiddlewareContext
> = middy(baseHandler).use(powertools()).use(appSyncResolver()).use(dynamoDB());
