import { AppSyncResolverEvent, Handler } from 'aws-lambda';
import lambdaTester from 'lambda-tester';

import { User } from '../../../../lib/auth/functions/lambda/model/index.js';
import { Game, GameType } from '../../../../lib/game/functions/lambda/model/index.js';
import { baseHandler, CreateGameInput } from '../../../../lib/game/functions/lambda/createGameHandler.js';

import { appSyncResolverEvent } from '../../../data/events.js';
import { ids as userIds, subs, users } from '../../../auth/data/user.js';

import { context } from '../../../data/context.js';
import { games } from '../../data/game.js';

describe('create game handler', () => {
  const createGameSpy = vi.spyOn(Game, 'createFromOpponentIdAndEmail');
  const getUserSpy = vi.spyOn(User, 'getByEmail');

  afterEach(() => {
    vi.clearAllMocks();
  });

  const testHandler = baseHandler as unknown as Handler<AppSyncResolverEvent<CreateGameInput>, GameType>;

  test('create game', async () => {
    createGameSpy.mockResolvedValue(games[0]);
    getUserSpy.mockResolvedValue(users[1]);

    return lambdaTester(testHandler)
      .context(context)
      .event(
        appSyncResolverEvent(
          {
            sub: subs[0],
            userId: userIds[0],
          },
          {
            email: users[1].email,
          },
        ),
      )
      .expectResult((result) => {
        expect(getUserSpy).toHaveBeenCalledTimes(1);
        expect(getUserSpy).toHaveBeenCalledWith(expect.anything(), users[1].email);
        expect(createGameSpy).toHaveBeenCalledTimes(1);
        expect(createGameSpy).toHaveBeenCalledWith(expect.anything(), userIds[1], users[1].email);
        expect(result).toStrictEqual(games[0]);
      });
  });

  test('create game (error)', async () => {
    getUserSpy.mockResolvedValue(users[1]);
    createGameSpy.mockRejectedValue(new Error('create error'));

    return lambdaTester(testHandler)
      .context(context)
      .event(
        appSyncResolverEvent(
          {
            sub: subs[0],
            userId: userIds[0],
          },
          {
            email: users[1].email,
          },
        ),
      )
      .expectReject((error: Error) => {
        expect(getUserSpy).toHaveBeenCalledTimes(1);
        expect(getUserSpy).toHaveBeenCalledWith(expect.anything(), users[1].email);
        expect(createGameSpy).toHaveBeenCalledTimes(1);
        expect(createGameSpy).toHaveBeenCalledWith(expect.anything(), userIds[1], users[1].email);
        expect(error.message).toBe('create error');
      });
  });
});
