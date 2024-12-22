import middy, { MiddyfiedHandler } from '@middy/core';

import { AppSyncResolverEvent } from 'aws-lambda';

import {
  appSyncResolver,
  dynamoDB,
  MiddlewareAppSyncResolverHandler,
  MiddlewareContext,
  powertools,
} from '../../../middleware/index.js';

import { User, UserType } from './model/index.js';

export const baseHandler: MiddlewareAppSyncResolverHandler<void, UserType> = async (_event, context) =>
  User.getCurrent(context);

export const handler: MiddyfiedHandler<
  AppSyncResolverEvent<void, Record<string, unknown> | null>,
  UserType,
  Error,
  MiddlewareContext
> = middy(baseHandler).use(powertools()).use(appSyncResolver()).use(dynamoDB());
