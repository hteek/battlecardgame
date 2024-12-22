import { AppSyncResolverEvent, Handler } from 'aws-lambda';
import lambdaTester from 'lambda-tester';
import { Game, GameType } from '../../../../lib/game/functions/lambda/model/index.js';
import { baseHandler } from '../../../../lib/game/functions/lambda/listGamesHandler.js';

import { appSyncResolverEvent } from '../../../data/events.js';
import { ids as userIds, subs } from '../../../auth/data/user.js';

import { context } from '../../../data/context.js';
import { games } from '../../data/game.js';

describe('list games handler', () => {
  const findGameSpy = vi.spyOn(Game, 'findByCurrentUserId');

  afterEach(() => {
    vi.clearAllMocks();
  });

  const testHandler = baseHandler as unknown as Handler<AppSyncResolverEvent<void>, GameType[]>;

  test('list games', async () => {
    findGameSpy.mockResolvedValue([games[0]]);

    return lambdaTester(testHandler)
      .context(context)
      .event(
        appSyncResolverEvent({
          sub: subs[0],
          userId: userIds[0],
        }),
      )
      .expectResult((result) => {
        expect(findGameSpy).toHaveBeenCalledTimes(1);
        expect(findGameSpy).toHaveBeenCalledWith(expect.anything());
        expect(result).toStrictEqual([games[0]]);
      });
  });

  test('list games (error)', async () => {
    findGameSpy.mockRejectedValue(new Error('list error'));

    return lambdaTester(testHandler)
      .context(context)
      .event(
        appSyncResolverEvent({
          sub: subs[0],
          userId: userIds[0],
        }),
      )
      .expectReject((error: Error) => {
        expect(findGameSpy).toHaveBeenCalledTimes(1);
        expect(findGameSpy).toHaveBeenCalledWith(expect.anything());
        expect(error.message).toBe('list error');
      });
  });
});
