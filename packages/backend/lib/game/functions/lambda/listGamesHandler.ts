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

export const baseHandler: MiddlewareAppSyncResolverHandler<void, GameType[]> = async (event, context) => {
  return Game.findByCurrentUserId(context);
};

export const handler: MiddyfiedHandler<
  AppSyncResolverEvent<void, Record<string, unknown> | null>,
  GameType[],
  Error,
  MiddlewareContext
> = middy(baseHandler).use(powertools()).use(appSyncResolver()).use(dynamoDB());
