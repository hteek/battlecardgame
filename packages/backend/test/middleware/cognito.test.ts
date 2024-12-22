import middy from '@middy/core';

import { PreTokenGenerationTriggerEvent } from 'aws-lambda';
import { isString } from 'remeda';

import { getCognitoFromContext, MiddlewareContext, preTokenGeneration } from '../../lib/middleware/index.js';

import { emails, subs } from '../auth/data/user.js';

export const checkCognitoPreTokenGenerationMiddlewareContext = (context: MiddlewareContext) => {
  const { email, firstName, lastName, sub } = getCognitoFromContext(context);

  if (!isString(email)) {
    throw new Error('no email found');
  }
  if (firstName && !isString(firstName)) {
    throw new Error('firstName is not a string');
  }
  if (lastName && !isString(lastName)) {
    throw new Error('lastName is not a string');
  }
  if (!isString(sub)) {
    throw new Error('no sub found');
  }
};

describe('Cognito middleware', () => {
  const OLD_ENV = process.env;
  const context = {} as MiddlewareContext;

  describe('Pre token generation', () => {
    const handler = middy<PreTokenGenerationTriggerEvent, void, Error, MiddlewareContext>()
      .use(preTokenGeneration())
      .handler(async (_, context) => checkCognitoPreTokenGenerationMiddlewareContext(context));

    const event = (props?: { email?: string; firstName?: string; lastName?: string; sub?: string }) => {
      const { email, firstName, lastName, sub } = props || {};
      return {
        version: '1',
        triggerSource: 'TokenGeneration_NewPasswordChallenge',
        region: 'eu-central-1',
        userPoolId: 'eu-central-1_in5hxzdbq',
        userName: 'r1234567890',
        callerContext: {
          awsSdkVersion: 'aws-sdk-unknown-unknown',
          clientId: '4im5lrbj1d8s3tle82iaa1tf44',
        },
        request: {
          userAttributes: {
            ...(sub ? { sub } : {}),
            'cognito:user_status': 'CONFIRMED',
            ...(email ? { email } : {}),
            ...(firstName ? { given_name: firstName } : {}),
            ...(lastName ? { family_name: lastName } : {}),
          },
          groupConfiguration: {
            groupsToOverride: [],
            iamRolesToOverride: [],
          },
        },
        response: {
          claimsOverrideDetails: {},
        },
      } as PreTokenGenerationTriggerEvent;
    };

    beforeEach(() => {
      process.env = { ...OLD_ENV }; // make a copy
    });

    afterEach(() => {
      vi.clearAllMocks();
      process.env = OLD_ENV; // restore old env
    });

    test('successful initialisation', async () =>
      expect(handler(event({ email: emails[0], sub: subs[0] }), context)).resolves.toBeUndefined());

    test('successful initialisation with name', async () =>
      expect(
        handler(
          event({
            email: emails[0],
            firstName: 'Max',
            lastName: 'Mustermann',
            sub: subs[0],
          }),
          context,
        ),
      ).resolves.toBeUndefined());

    test('missing email', async () =>
      expect(handler(event({ sub: subs[0] }), context)).rejects.toThrowError('no email given'));

    test('missing sub', async () =>
      expect(handler(event({ email: emails[0] }), context)).rejects.toThrowError('no sub given'));
  });
});
