import { baseSchema } from '../../../../model/index.js';

export enum EntityKey {
  Event = 'event',
  Game = 'game',
  User = 'user',
}

export enum EventName {
  Join = 'join',
  DrawInitial = 'draw-initial',
  Draw = 'draw',
  Play = 'play',
  Won = 'won',
  Lost = 'lost',
}

export enum FromLocation {
  Army = 'army',
  Hand = 'hand',
  Stack = 'stack',
}

export enum ToLocation {
  Army = 'army',
  Chest = 'chest',
}

export const schema = {
  ...baseSchema,
  models: {
    Game: {
      pk: { type: String, value: `${EntityKey.Game}#\${id}` },
      sk: { type: String, value: `${EntityKey.User}#\${userId}` },
      id: {
        type: String,
        generate: 'ulid',
        required: true,
        validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i,
      },
      userId: {
        type: String,
        required: true,
        validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i,
      },
      userEmail: {
        type: String,
        required: true,
      },
      opponentId: {
        type: String,
        required: true,
        validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i,
      },
      opponentEmail: {
        type: String,
        required: true,
      },
      //  Search by user id or by type
      gs1pk: { type: String, value: '${_type}#' },
      gs1sk: { type: String, value: '${_type}#${userId}' },
      //  Search by opponent id or by type
      gs2pk: { type: String, value: '${_type}#' },
      gs2sk: { type: String, value: '${_type}#${opponentId}' },
    },
    Event: {
      pk: { type: String, value: `${EntityKey.Game}#\${gameId}` },
      sk: { type: String, value: `${EntityKey.Event}#\${id}` },
      id: {
        type: String,
        generate: 'ulid',
        required: true,
        validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i,
      },
      gameId: {
        type: String,
        required: true,
        validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i,
      },
      userId: {
        type: String,
        required: true,
        validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i,
      },
      opponentId: {
        type: String,
        required: true,
        validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i,
      },
      name: {
        type: String,
        enum: Object.values(EventName),
        required: true,
      },
      data: {
        type: Object,
        schema: {
          card: { type: String },
          from: { type: String, enum: Object.values(FromLocation), required: true },
          fromPosition: { type: Number, default: 0 },
          to: { type: String, enum: Object.values(ToLocation), required: true },
          toPosition: { type: Number, default: 0 },
        },
      },
      //  Search by game id, player id or by type
      gs1pk: { type: String, value: '${_type}#' },
      gs1sk: { type: String, value: '${_type}#${gameId}#${userId}' },
    },
  } as const,
} as const;
