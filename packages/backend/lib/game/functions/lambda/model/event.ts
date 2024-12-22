import { Entity, Model, Paged } from 'dynamodb-onetable';

import { getAppSyncFromContext, MiddlewareContext } from '../../../../middleware/index.js';
import { BaseEntity, Gsi } from '../../../../model/index.js';

import { EventName, FromLocation, schema, ToLocation } from './schema.js';

export type EventType = Entity<typeof schema.models.Event>;

export type EventData = {
  card?: string;
  from: FromLocation;
  fromPosition?: number;
  to: ToLocation;
  toPosition?: number;
};

export class Event extends BaseEntity {
  static readonly getEventModel: (
    context: MiddlewareContext,
  ) => Model<Entity<EventType extends Entity<infer X> ? X : never>> = (context: MiddlewareContext) =>
    Event.getModel<EventType>(context, schema, 'Event');

  static readonly createFromGameIdOpponentIdAndName: (
    context: MiddlewareContext,
    gameId: string,
    opponentId: string,
    name: EventName,
    data?: EventData,
  ) => Promise<Entity<EventType extends Entity<infer X> ? X : never>> = async (
    context: MiddlewareContext,
    gameId: string,
    opponentId: string,
    name: EventName,
    data?: EventData,
  ) => {
    const { userId } = getAppSyncFromContext(context);

    return Event.getEventModel(context).create({
      userId,
      opponentId,
      gameId,
      name,
      ...(data ? { data } : {}),
    });
  };

  static readonly findByGameId: (
    context: MiddlewareContext,
    gameId: string,
  ) => Promise<Paged<Entity<EventType extends Entity<infer X> ? X : never>>> = async (
    context: MiddlewareContext,
    gameId: string,
  ) => {
    return Event.getEventModel(context).find(
      {
        gs1sk: { begins: `Event#${gameId}#` },
      },
      {
        index: Gsi.Gs1Index,
        follow: true,
        log: true,
      },
    );
  };

  static readonly getById: (context: MiddlewareContext, id: string) => Promise<EventType> = async (
    context: MiddlewareContext,
    id: string,
  ) => {
    const { userId: currentUserId } = getAppSyncFromContext(context);

    return Event.getEventModel(context)
      .get(
        {
          id,
        },
        {
          index: Gsi.SkPkIndex,
          follow: true,
          log: true,
        },
      )
      .then((event?: EventType) => {
        if (!event) {
          throw new Error(`no event found with id: ${id}`);
        }

        const { userId, opponentId } = event;
        if (![userId, opponentId].find((id) => id === currentUserId)) {
          throw new Error(`no event found with id: ${id} for user id: ${currentUserId}`);
        }
        return event;
      });
  };
}
