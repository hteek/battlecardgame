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

import { User } from '../../../auth/functions/lambda/model/index.js';
import { Game, GameType } from './model/index.js';

export type CreateGameInput = {
  email: string;
};
export const baseHandler: MiddlewareAppSyncResolverHandler<CreateGameInput, GameType> = async (event, context) => {
  const { id, email } = await User.getByEmail(context, event.arguments.email);
  return Game.createFromOpponentIdAndEmail(context, id, email);
};

export const handler: MiddyfiedHandler<
  AppSyncResolverEvent<CreateGameInput, Record<string, unknown> | null>,
  GameType,
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
      entity: 'Game',
      userIdProp: 'opponentId',
    }),
  );
