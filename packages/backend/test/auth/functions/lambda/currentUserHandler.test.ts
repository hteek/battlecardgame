import { AppSyncResolverEvent, Handler } from 'aws-lambda';
import lambdaTester from 'lambda-tester';

import { User, UserType } from '../../../../lib/auth/functions/lambda/model/index.js';
import { baseHandler } from '../../../../lib/auth/functions/lambda/currentUserHandler.js';

import { appSyncResolverEvent } from '../../../data/events.js';
import { ids, subs, users } from '../../data/user.js';

describe('currentUser handler', () => {
  const getCurrentSpy = vi.spyOn(User, 'getCurrent');

  afterEach(() => {
    vi.clearAllMocks();
  });

  const testHandler = baseHandler as unknown as Handler<AppSyncResolverEvent<void>, UserType>;

  test('get user', async () => {
    getCurrentSpy.mockResolvedValue(users[0]);

    return lambdaTester(testHandler)
      .event(
        appSyncResolverEvent({
          sub: subs[0],
          userId: ids[0],
        }),
      )
      .expectResult((result) => {
        expect(getCurrentSpy).toHaveBeenCalledTimes(1);
        expect(getCurrentSpy).toHaveBeenCalledWith(expect.anything());
        expect(result).toStrictEqual(users[0]);
      });
  });

  test('get user (error)', async () => {
    getCurrentSpy.mockRejectedValue(new Error('get error'));

    return lambdaTester(testHandler)
      .event(
        appSyncResolverEvent({
          sub: subs[1],
          userId: ids[1],
        }),
      )
      .expectReject((error: Error) => {
        expect(getCurrentSpy).toHaveBeenCalledTimes(1);
        expect(getCurrentSpy).toHaveBeenCalledWith(expect.anything());
        expect(error.message).toBe('get error');
      });
  });
});
