import { Model } from 'dynamodb-onetable';

import { ids as userIds } from '../../../../auth/data/user.js';
import { context } from '../../../../data/context.js';

import { events, ids } from '../../../data/event.js';
import { ids as gameIds } from '../../../data/game.js';

import { Event, EventName } from '../../../../../lib/game/functions/lambda/model/index.js';
import { Gsi } from '../../../../../lib/model/index.js';

describe('event model', () => {
  const createModelSpy = vi.spyOn(Model.prototype, 'create');
  const getModelSpy = vi.spyOn(Model.prototype, 'get');

  describe('create from game id, opponent id and name', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    test('success', async () => {
      createModelSpy.mockReturnValue(Promise.resolve(events[0]));

      const result = await Event.createFromGameIdOpponentIdAndName(context, gameIds[0], userIds[1], EventName.Join);

      expect(createModelSpy).toHaveBeenCalledTimes(1);
      expect(createModelSpy).toHaveBeenCalledWith({
        gameId: gameIds[0],
        name: EventName.Join,
        opponentId: userIds[1],
        userId: userIds[0],
      });
      expect(result).toStrictEqual(events[0]);
    });

    test('error', async () => {
      createModelSpy.mockReturnValue(Promise.reject(new Error('create error')));

      expect.assertions(3);
      try {
        await Event.createFromGameIdOpponentIdAndName(context, gameIds[0], userIds[1], EventName.Join);
      } catch (error) {
        expect(createModelSpy).toHaveBeenCalledTimes(1);
        expect(createModelSpy).toHaveBeenCalledWith({
          gameId: gameIds[0],
          name: EventName.Join,
          opponentId: userIds[1],
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
      getModelSpy.mockReturnValue(Promise.resolve(events[0]));

      const result = await Event.getById(context, ids[0]);

      expect(getModelSpy).toHaveBeenCalledTimes(1);
      expect(getModelSpy).toHaveBeenCalledWith(
        {
          id: ids[0],
        },
        {
          follow: true,
          index: Gsi.SkPkIndex,
          log: true,
        },
      );
      expect(result).toStrictEqual(events[0]);
    });

    test('success (opponent id)', async () => {
      getModelSpy.mockReturnValue(Promise.resolve(events[1]));

      const result = await Event.getById(context, ids[1]);

      expect(getModelSpy).toHaveBeenCalledTimes(1);
      expect(getModelSpy).toHaveBeenCalledWith(
        {
          id: ids[1],
        },
        {
          follow: true,
          index: Gsi.SkPkIndex,
          log: true,
        },
      );
      expect(result).toStrictEqual(events[1]);
    });

    test('error get', async () => {
      getModelSpy.mockReturnValue(Promise.reject(new Error('get error')));

      expect.assertions(3);
      try {
        await Event.getById(context, ids[0]);
      } catch (error) {
        expect(getModelSpy).toHaveBeenCalledTimes(1);
        expect(getModelSpy).toHaveBeenCalledWith(
          {
            id: ids[0],
          },
          {
            follow: true,
            index: Gsi.SkPkIndex,
            log: true,
          },
        );
        expect((error as Error).message).toBe('get error');
      }
    });

    test('error (wrong id)', async () => {
      getModelSpy.mockReturnValue(Promise.resolve(events[2]));

      expect.assertions(3);
      try {
        await Event.getById(context, ids[2]);
      } catch (error) {
        expect(getModelSpy).toHaveBeenCalledTimes(1);
        expect(getModelSpy).toHaveBeenCalledWith(
          {
            id: ids[2],
          },
          {
            follow: true,
            index: Gsi.SkPkIndex,
            log: true,
          },
        );
        expect((error as Error).message).toBe(`no event found with id: ${ids[2]} for user id: ${userIds[0]}`);
      }
    });
  });
});
