import { AppSyncResolverEvent, Handler } from 'aws-lambda';
import lambdaTester from 'lambda-tester';

import { Game, GameType } from '../../../../lib/game/functions/lambda/model/index.js';
import { baseHandler, GetGameByIdInput } from '../../../../lib/game/functions/lambda/getGameByIdHandler.js';

import { appSyncResolverEvent } from '../../../data/events.js';
import { ids as userIds, subs } from '../../../auth/data/user.js';

import { context } from '../../../data/context.js';
import { games, ids as gameIds } from '../../data/game.js';

describe('get game by id handler', () => {
  const getGameSpy = vi.spyOn(Game, 'getById');

  afterEach(() => {
    vi.clearAllMocks();
  });

  const testHandler = baseHandler as unknown as Handler<AppSyncResolverEvent<GetGameByIdInput>, GameType>;

  test('get game', async () => {
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
        expect(result).toStrictEqual(games[1]);
      });
  });

  test('get game (error)', async () => {
    getGameSpy.mockRejectedValue(new Error('get error'));

    return lambdaTester(testHandler)
      .context(context)
      .event(
        appSyncResolverEvent(
          {
            sub: subs[0],
            userId: userIds[0],
          },
          {
            id: gameIds[2],
          },
        ),
      )
      .expectReject((error: Error) => {
        expect(getGameSpy).toHaveBeenCalledTimes(1);
        expect(getGameSpy).toHaveBeenCalledWith(expect.anything(), gameIds[2]);
        expect(error.message).toBe('get error');
      });
  });
});
