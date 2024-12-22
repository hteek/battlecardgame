import { Entity, Model, Paged } from 'dynamodb-onetable';

import { getAppSyncFromContext, MiddlewareContext } from '../../../../middleware/index.js';
import { BaseEntity, Gsi } from '../../../../model/index.js';

import { schema } from './schema.js';

export type GameType = Entity<typeof schema.models.Game>;

export class Game extends BaseEntity {
  static readonly getGameModel: (
    context: MiddlewareContext,
  ) => Model<Entity<GameType extends Entity<infer X> ? X : never>> = (context: MiddlewareContext) =>
    Game.getModel<GameType>(context, schema, 'Game');

  static readonly createFromOpponentIdAndEmail: (
    context: MiddlewareContext,
    opponentId: string,
    opponentEmail: string,
  ) => Promise<Entity<GameType extends Entity<infer X> ? X : never>> = async (
    context: MiddlewareContext,
    opponentId: string,
    opponentEmail: string,
  ) => {
    const { email: userEmail, userId } = getAppSyncFromContext(context);

    return Game.getGameModel(context).create({
      userId,
      userEmail,
      opponentId,
      opponentEmail,
    });
  };

  static readonly getById: (context: MiddlewareContext, id: string) => Promise<GameType> = async (
    context: MiddlewareContext,
    id: string,
  ) => {
    const { userId: currentUserId } = getAppSyncFromContext(context);

    return Game.getGameModel(context)
      .get(
        {
          id,
        },
        {
          log: true,
        },
      )
      .then((game?: GameType) => {
        if (!game) {
          throw new Error(`no game found with id: ${id}`);
        }

        const { userId, opponentId } = game;
        if (![userId, opponentId].find((id) => id === currentUserId)) {
          throw new Error(`no game found with id: ${id} for user id: ${currentUserId}`);
        }
        return game;
      });
  };

  static readonly findByCurrentUserId: (
    context: MiddlewareContext,
  ) => Promise<Paged<Entity<GameType extends Entity<infer X> ? X : never>>> = async (context: MiddlewareContext) => {
    const { userId } = getAppSyncFromContext(context);

    return Game.getGameModel(context).find(
      {
        gs1sk: `Game#${userId}`,
      },
      {
        index: Gsi.Gs1Index,
        follow: true,
        log: true,
      },
    );
  };

  static readonly findByCurrentOpponentId: (
    context: MiddlewareContext,
  ) => Promise<Paged<Entity<GameType extends Entity<infer X> ? X : never>>> = async (context: MiddlewareContext) => {
    const { userId: opponentId } = getAppSyncFromContext(context);

    return Game.getGameModel(context).find(
      {
        gs2sk: `Game#${opponentId}`,
      },
      {
        index: Gsi.Gs2Index,
        follow: true,
        log: true,
      },
    );
  };
}
