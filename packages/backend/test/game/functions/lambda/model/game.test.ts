import { Model } from 'dynamodb-onetable';

import { ids as userIds, users } from '../../../../auth/data/user.js';
import { context } from '../../../../data/context.js';

import { games, ids } from '../../../data/game.js';

import { Game } from '../../../../../lib/game/functions/lambda/model/index.js';

describe('game model', () => {
  const createModelSpy = vi.spyOn(Model.prototype, 'create');
  const getModelSpy = vi.spyOn(Model.prototype, 'get');

  describe('create from opponentId', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    test('success', async () => {
      createModelSpy.mockReturnValue(Promise.resolve(games[0]));

      const result = await Game.createFromOpponentIdAndEmail(context, userIds[1], users[1].email);

      expect(createModelSpy).toHaveBeenCalledTimes(1);
      expect(createModelSpy).toHaveBeenCalledWith({
        opponentEmail: users[1].email,
        opponentId: userIds[1],
        userEmail: users[0].email,
        userId: userIds[0],
      });
      expect(result).toStrictEqual(games[0]);
    });

    test('error', async () => {
      createModelSpy.mockReturnValue(Promise.reject(new Error('create error')));

      expect.assertions(3);
      try {
        await Game.createFromOpponentIdAndEmail(context, userIds[1], users[1].email);
      } catch (error) {
        expect(createModelSpy).toHaveBeenCalledTimes(1);
        expect(createModelSpy).toHaveBeenCalledWith({
          opponentEmail: users[1].email,
          opponentId: userIds[1],
          userEmail: users[0].email,
          userId: userIds[0],
        });
        expect((error as Error).message).toBe('create error');
      }
    });
  });

  describe('get by id', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    test('success (user id)', async () => {
      getModelSpy.mockReturnValue(Promise.resolve(games[0]));

      const result = await Game.getById(context, ids[0]);

      expect(getModelSpy).toHaveBeenCalledTimes(1);
      expect(getModelSpy).toHaveBeenCalledWith(
        {
          id: ids[0],
        },
        {
          log: true,
        },
      );
      expect(result).toStrictEqual(games[0]);
    });

    test('success (opponent id)', async () => {
      getModelSpy.mockReturnValue(Promise.resolve(games[1]));

      const result = await Game.getById(context, ids[0]);

      expect(getModelSpy).toHaveBeenCalledTimes(1);
      expect(getModelSpy).toHaveBeenCalledWith(
        {
          id: ids[0],
        },
        {
          log: true,
        },
      );
      expect(result).toStrictEqual(games[1]);
    });

    test('error get', async () => {
      getModelSpy.mockReturnValue(Promise.reject(new Error('get error')));

      expect.assertions(3);
      try {
        await Game.getById(context, ids[0]);
      } catch (error) {
        expect(getModelSpy).toHaveBeenCalledTimes(1);
        expect(getModelSpy).toHaveBeenCalledWith(
          {
            id: ids[0],
          },
          {
            log: true,
          },
        );
        expect((error as Error).message).toBe('get error');
      }
    });

    test('error (wrong id)', async () => {
      getModelSpy.mockReturnValue(Promise.resolve(games[2]));

      expect.assertions(3);
      try {
        await Game.getById(context, ids[0]);
      } catch (error) {
        expect(getModelSpy).toHaveBeenCalledTimes(1);
        expect(getModelSpy).toHaveBeenCalledWith(
          {
            id: ids[0],
          },
          {
            log: true,
          },
        );
        expect((error as Error).message).toBe(`no game found with id: ${ids[0]} for user id: ${userIds[0]}`);
      }
    });
  });
});
