import { AppSyncResolverEvent, Handler } from 'aws-lambda';
import lambdaTester from 'lambda-tester';
import { Event, EventType, Game } from '../../../../lib/game/functions/lambda/model/index.js';
import {
  baseHandler,
  ListEventsByGameIdInput,
} from '../../../../lib/game/functions/lambda/listEventsByGameIdHandler.js';

import { appSyncResolverEvent } from '../../../data/events.js';
import { ids as userIds, subs } from '../../../auth/data/user.js';

import { context } from '../../../data/context.js';

import { events } from '../../data/event.js';
import { games, ids as gameIds } from '../../data/game.js';

describe('list events by game id handler', () => {
  const findEventSpy = vi.spyOn(Event, 'findByGameId');
  const getGameSpy = vi.spyOn(Game, 'getById');

  afterEach(() => {
    vi.clearAllMocks();
  });

  const testHandler = baseHandler as unknown as Handler<AppSyncResolverEvent<ListEventsByGameIdInput>, EventType[]>;

  test('list events', async () => {
    findEventSpy.mockResolvedValue([events[0]]);
    getGameSpy.mockResolvedValue(games[0]);

    return lambdaTester(testHandler)
      .context(context)
      .event(
        appSyncResolverEvent(
          {
            sub: subs[0],
            userId: userIds[0],
          },
          {
            gameId: gameIds[0],
          },
        ),
      )
      .expectResult((result) => {
        expect(getGameSpy).toHaveBeenCalledTimes(1);
        expect(getGameSpy).toHaveBeenCalledWith(expect.anything(), gameIds[0]);
        expect(findEventSpy).toHaveBeenCalledTimes(1);
        expect(findEventSpy).toHaveBeenCalledWith(expect.anything(), gameIds[0]);
        expect(result).toStrictEqual([events[0]]);
      });
  });

  test('join game (error)', async () => {
    findEventSpy.mockRejectedValue(new Error('create error'));
    getGameSpy.mockResolvedValue(games[0]);

    return lambdaTester(testHandler)
      .context(context)
      .event(
        appSyncResolverEvent(
          {
            sub: subs[0],
            userId: userIds[0],
          },
          {
            gameId: gameIds[0],
          },
        ),
      )
      .expectReject((error: Error) => {
        expect(getGameSpy).toHaveBeenCalledTimes(1);
        expect(getGameSpy).toHaveBeenCalledWith(expect.anything(), gameIds[0]);
        expect(findEventSpy).toHaveBeenCalledTimes(1);
        expect(findEventSpy).toHaveBeenCalledWith(expect.anything(), gameIds[0]);
        expect(error.message).toBe('create error');
      });
  });
});
