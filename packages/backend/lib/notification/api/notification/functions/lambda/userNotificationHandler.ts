import middy, { MiddyfiedHandler } from '@middy/core';

import { AppSyncResolverEvent } from 'aws-lambda';

import {
  appSyncResolver,
  getAppSyncFromContext,
  getPowertoolsFromContext,
  MiddlewareAppSyncResolverHandler,
  MiddlewareContext,
  powertools,
} from '../../../../../middleware/index.js';

const baseHandler: MiddlewareAppSyncResolverHandler<{ userId: string }, void> = async (event, context) => {
  const { userId: callerId } = getAppSyncFromContext(context);
  const { logger } = getPowertoolsFromContext(context);

  const {
    arguments: { userId },
  } = event;

  if (callerId !== userId) {
    logger.warn('access not allowed', { callerId, userId });
    throw new Error(`access not allowed for user '${callerId}'`);
  }

  logger.debug('access granted', { callerId });
};

export const handler: MiddyfiedHandler<
  AppSyncResolverEvent<{ userId: string }, Record<string, unknown> | null>,
  void,
  Error,
  MiddlewareContext
> = middy(baseHandler).use(powertools()).use(appSyncResolver());
