import { Model } from 'dynamodb-onetable';

import { User } from '../../../../../lib/auth/functions/lambda/model/index.js';

import { context } from '../../../../data/context.js';
import { emails, ids, subs, users } from '../../../data/user.js';

describe('user model', () => {
  const createModelSpy = vi.spyOn(Model.prototype, 'create');
  const getModelSpy = vi.spyOn(Model.prototype, 'get');

  describe('create from sub and email', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    test('success', async () => {
      createModelSpy.mockReturnValue(Promise.resolve(users[0]));

      const result = await User.createFromEmail(context, emails[0]);

      expect(createModelSpy).toHaveBeenCalledTimes(1);
      expect(createModelSpy).toHaveBeenCalledWith({
        email: emails[0],
        sub: subs[0],
      });
      expect(result).toStrictEqual(users[0]);
    });

    test('success (optional name)', async () => {
      createModelSpy.mockReturnValue(Promise.resolve(users[0]));

      const result = await User.createFromEmail(context, emails[0], 'Max', 'Mustermann');

      expect(createModelSpy).toHaveBeenCalledTimes(1);
      expect(createModelSpy).toHaveBeenCalledWith({
        email: emails[0],
        firstName: 'Max',
        lastName: 'Mustermann',
        sub: subs[0],
      });
      expect(result).toStrictEqual(users[0]);
    });

    test('error', async () => {
      createModelSpy.mockReturnValue(Promise.reject(new Error('create error')));

      expect.assertions(3);
      try {
        await User.createFromEmail(context, emails[0]);
      } catch (error) {
        expect(createModelSpy).toHaveBeenCalledTimes(1);
        expect(createModelSpy).toHaveBeenCalledWith({
          email: emails[0],
          sub: subs[0],
        });
        expect((error as Error).message).toBe('create error');
      }
    });
  });

  describe('get by email', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    test('success', async () => {
      getModelSpy.mockReturnValue(Promise.resolve(users[0]));

      const result = await User.getByEmail(context, emails[0]);

      expect(getModelSpy).toHaveBeenCalledTimes(1);
      expect(getModelSpy).toHaveBeenCalledWith(
        {
          sub: subs[0],
        },
        {
          log: true,
        },
      );
      expect(result).toStrictEqual(users[0]);
    });

    test('error', async () => {
      getModelSpy.mockReturnValue(Promise.reject(new Error('get error')));

      expect.assertions(3);
      try {
        await User.getByEmail(context, emails[0]);
      } catch (error) {
        expect(getModelSpy).toHaveBeenCalledTimes(1);
        expect(getModelSpy).toHaveBeenCalledWith(
          {
            sub: subs[0],
          },
          {
            log: true,
          },
        );
        expect((error as Error).message).toBe('get error');
      }
    });

    test('undefined', async () => {
      getModelSpy.mockReturnValue(Promise.resolve(undefined));

      expect.assertions(3);
      try {
        await User.getByEmail(context, emails[0]);
      } catch (error) {
        expect(getModelSpy).toHaveBeenCalledTimes(1);
        expect(getModelSpy).toHaveBeenCalledWith(
          {
            sub: subs[0],
          },
          {
            log: true,
          },
        );
        expect((error as Error).message).toBe(`no user found with email: ${emails[0]}`);
      }
    });
  });

  describe('get current', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    test('success', async () => {
      getModelSpy.mockReturnValue(Promise.resolve(users[0]));

      const result = await User.getCurrent(context);

      expect(getModelSpy).toHaveBeenCalledTimes(1);
      expect(getModelSpy).toHaveBeenCalledWith(
        {
          id: ids[0],
          sub: subs[0],
        },
        {
          log: true,
        },
      );
      expect(result).toStrictEqual(users[0]);
    });

    test('error', async () => {
      getModelSpy.mockReturnValue(Promise.reject(new Error('get error')));

      expect.assertions(3);
      try {
        await User.getCurrent(context);
      } catch (error) {
        expect(getModelSpy).toHaveBeenCalledTimes(1);
        expect(getModelSpy).toHaveBeenCalledWith(
          {
            id: ids[0],
            sub: subs[0],
          },
          {
            log: true,
          },
        );
        expect((error as Error).message).toBe('get error');
      }
    });

    test('undefined', async () => {
      getModelSpy.mockReturnValue(Promise.resolve(undefined));

      expect.assertions(3);
      try {
        await User.getCurrent(context);
      } catch (error) {
        expect(getModelSpy).toHaveBeenCalledTimes(1);
        expect(getModelSpy).toHaveBeenCalledWith(
          {
            id: ids[0],
            sub: subs[0],
          },
          {
            log: true,
          },
        );
        expect((error as Error).message).toBe(`no user found with id: ${ids[0]} and email: ${emails[0]}`);
      }
    });
  });
});
