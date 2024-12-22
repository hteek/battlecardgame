import { AppSyncResolverEvent, Handler } from 'aws-lambda';
import lambdaTester from 'lambda-tester';
import { Event, EventName, EventType, Game } from '../../../../lib/game/functions/lambda/model/index.js';
import { baseHandler, JoinGameInput } from '../../../../lib/game/functions/lambda/joinGameHandler.js';

import { appSyncResolverEvent } from '../../../data/events.js';
import { ids as userIds, subs } from '../../../auth/data/user.js';

import { context } from '../../../data/context.js';

import { events } from '../../data/event.js';
import { games, ids as gameIds } from '../../data/game.js';

describe('join game handler', () => {
  const createEventSpy = vi.spyOn(Event, 'createFromGameIdOpponentIdAndName');
  const getGameSpy = vi.spyOn(Game, 'getById');

  afterEach(() => {
    vi.clearAllMocks();
  });

  const testHandler = baseHandler as unknown as Handler<AppSyncResolverEvent<JoinGameInput>, EventType>;

  test('join game', async () => {
    createEventSpy.mockResolvedValue(events[0]);
    getGameSpy.mockResolvedValue(games[1]);

    return lambdaTester(testHandler)
      .context(context)
      .event(
        appSyncResolverEvent(
          {
            sub: subs[0],
            userId: userIds[0],
          },
          {
            id: gameIds[1],
          },
        ),
      )
      .expectResult((result) => {
        expect(getGameSpy).toHaveBeenCalledTimes(1);
        expect(getGameSpy).toHaveBeenCalledWith(expect.anything(), gameIds[1]);
        expect(createEventSpy).toHaveBeenCalledTimes(1);
        expect(createEventSpy).toHaveBeenCalledWith(expect.anything(), gameIds[1], userIds[1], EventName.Join);
        expect(result).toStrictEqual(events[0]);
      });
  });

  test('join game (error)', async () => {
    createEventSpy.mockRejectedValue(new Error('create error'));
    getGameSpy.mockResolvedValue(games[1]);

    return lambdaTester(testHandler)
      .context(context)
      .event(
        appSyncResolverEvent(
          {
            sub: subs[0],
            userId: userIds[0],
          },
          {
            id: gameIds[1],
          },
        ),
      )
      .expectReject((error: Error) => {
        expect(getGameSpy).toHaveBeenCalledTimes(1);
        expect(getGameSpy).toHaveBeenCalledWith(expect.anything(), gameIds[1]);
        expect(createEventSpy).toHaveBeenCalledTimes(1);
        expect(createEventSpy).toHaveBeenCalledWith(expect.anything(), gameIds[1], userIds[1], EventName.Join);
        expect(error.message).toBe('create error');
      });
  });
});
