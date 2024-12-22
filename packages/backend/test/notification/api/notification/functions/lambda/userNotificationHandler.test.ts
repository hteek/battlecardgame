import { AppSyncResolverEvent, Handler } from 'aws-lambda';
import lambdaTester from 'lambda-tester';

import { handler } from '../../../../../../lib/notification/api/notification/functions/lambda/userNotificationHandler.js';

import { emails, ids, subs } from '../../../../../auth/data/user.js';

import { appSyncResolverEvent } from '../../../../data/events.js';

describe('userNotification handler', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterEach(() => {
    vi.clearAllMocks();
    process.env = OLD_ENV; // restore old env
  });

  const testHandler = handler as unknown as Handler<AppSyncResolverEvent<{ userId: string }>, void>;

  test('success', async () =>
    lambdaTester(testHandler)
      .event(appSyncResolverEvent({ email: emails[0], sub: subs[0], userId: ids[0] }, { userId: ids[0] }))
      .expectResolve(() => {
        console.log('success');
      }));

  test('error', async () =>
    lambdaTester(testHandler)
      .event(appSyncResolverEvent({ email: emails[0], sub: subs[0], userId: ids[0] }, { userId: ids[1] }))
      .expectReject((error: Error) => {
        expect(error.message).toBe(`access not allowed for user '${ids[0]}'`);
      }));
});
