import { Handler, PreTokenGenerationV2TriggerEvent } from 'aws-lambda';
import lambdaTester from 'lambda-tester';
import { expect } from 'vitest';

import { User } from '../../../../lib/auth/functions/lambda/model/index.js';
import { baseHandler } from '../../../../lib/auth/functions/lambda/preTokenGenerationHandler.js';

import { createTestContext } from '../../../data/context.js';
import { preTokenGenerationTriggerEvent } from '../../data/events.js';
import { triggerSourceTokenGenerationNewPasswordChallenge } from '../../../data/index.js';
import { emails, ids, subs, users } from '../../data/user.js';

describe('preTokenGeneration handler', () => {
  const createFromEmailSpy = vi.spyOn(User, 'createFromEmail');
  const getByEmail = vi.spyOn(User, 'getByEmail');

  afterEach(() => {
    vi.clearAllMocks();
  });

  const testHandler = baseHandler as unknown as Handler<
    PreTokenGenerationV2TriggerEvent,
    PreTokenGenerationV2TriggerEvent
  >;

  test('get user (user)', async () => {
    const {
      context,
      mocks: { powertoolsLoggerDebug, powertoolsLoggerError },
    } = createTestContext({
      cognitoTriggerSource: triggerSourceTokenGenerationNewPasswordChallenge,
    });

    getByEmail.mockReturnValue(Promise.resolve(users[0]));

    return lambdaTester(testHandler)
      .context(context)
      .event(
        preTokenGenerationTriggerEvent({
          email: emails[0],
          sub: subs[0],
          userId: ids[0],
        }),
      )
      .expectResult((result: PreTokenGenerationV2TriggerEvent) => {
        expect(powertoolsLoggerDebug).not.toHaveBeenCalled();
        expect(powertoolsLoggerError).not.toHaveBeenCalled();
        expect(getByEmail).toHaveBeenCalledTimes(1);
        expect(getByEmail).toHaveBeenCalledWith(expect.anything(), emails[0]);
        expect(createFromEmailSpy).not.toHaveBeenCalled();
        expect(result).toStrictEqual(
          preTokenGenerationTriggerEvent({
            email: emails[0],
            sub: subs[0],
            userId: ids[0],
          }),
        );
      });
  });

  test('create user (user)', async () => {
    const {
      context,
      mocks: { powertoolsLoggerDebug, powertoolsLoggerError },
    } = createTestContext({
      cognitoTriggerSource: triggerSourceTokenGenerationNewPasswordChallenge,
    });

    getByEmail.mockRejectedValue(new Error('get error'));
    createFromEmailSpy.mockReturnValue(Promise.resolve(users[0]));

    return lambdaTester(testHandler)
      .context(context)
      .event(
        preTokenGenerationTriggerEvent({
          email: emails[0],
          sub: subs[0],
          userId: ids[0],
        }),
      )
      .expectResult((result: PreTokenGenerationV2TriggerEvent) => {
        expect(powertoolsLoggerDebug).toHaveBeenCalledWith(`no user found for user id ${subs[0]}. creating one...`, {
          error: { message: 'get error' },
        });
        expect(powertoolsLoggerError).not.toHaveBeenCalled();
        expect(getByEmail).toHaveBeenCalledWith(expect.anything(), emails[0]);
        expect(createFromEmailSpy).toHaveBeenCalledWith(
          expect.anything(),
          emails[0],
          users[0].firstName,
          users[0].lastName,
        );
        expect(result).toStrictEqual(
          preTokenGenerationTriggerEvent({
            email: emails[0],
            sub: subs[0],
            userId: ids[0],
          }),
        );
      });
  });

  test('create user (create error) (user)', async () => {
    const {
      context,
      mocks: { powertoolsLoggerDebug, powertoolsLoggerError },
    } = createTestContext({
      cognitoTriggerSource: triggerSourceTokenGenerationNewPasswordChallenge,
    });

    getByEmail.mockReturnValue(Promise.reject(new Error('get error')));
    createFromEmailSpy.mockReturnValue(Promise.reject(new Error('create error')));

    return lambdaTester(testHandler)
      .context(context)
      .event(
        preTokenGenerationTriggerEvent({
          email: emails[0],
          sub: subs[0],
          userId: ids[0],
        }),
      )
      .expectReject((error: Error) => {
        expect(powertoolsLoggerDebug).toHaveBeenCalledWith(`no user found for user id ${subs[0]}. creating one...`, {
          error: { message: 'get error' },
        });
        expect(powertoolsLoggerError).toHaveBeenCalledWith(
          `user creation failed for sub: ${subs[0]} with email: ${emails[0]}`,
        );
        expect(getByEmail).toHaveBeenCalledWith(expect.anything(), emails[0]);
        expect(createFromEmailSpy).toHaveBeenCalledWith(
          expect.anything(),
          emails[0],
          users[0].firstName,
          users[0].lastName,
        );
        expect(error.message).toBe('create error');
      });
  });

  test('get user (admin)', async () => {
    const {
      context,
      mocks: { powertoolsLoggerDebug, powertoolsLoggerError },
    } = createTestContext({
      cognitoEmail: emails[1],
      cognitoFirstName: users[1].firstName,
      cognitoLastName: users[1].lastName,
      cognitoSub: subs[1],
      cognitoTriggerSource: triggerSourceTokenGenerationNewPasswordChallenge,
    });

    getByEmail.mockReturnValue(Promise.resolve(users[1]));

    return lambdaTester(testHandler)
      .context(context)
      .event(
        preTokenGenerationTriggerEvent({
          email: emails[1],
          sub: subs[1],
          userId: ids[1],
        }),
      )
      .expectResult((result: PreTokenGenerationV2TriggerEvent) => {
        expect(powertoolsLoggerDebug).not.toHaveBeenCalled();
        expect(powertoolsLoggerError).not.toHaveBeenCalled();
        expect(getByEmail).toHaveBeenCalledWith(expect.anything(), emails[1]);
        expect(createFromEmailSpy).not.toHaveBeenCalled();
        expect(result).toStrictEqual(
          preTokenGenerationTriggerEvent({
            email: emails[1],
            sub: subs[1],
            userId: ids[1],
          }),
        );
      });
  });
});
