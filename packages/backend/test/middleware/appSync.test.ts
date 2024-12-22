import middy from '@middy/core';

import { AppSyncResolverEvent } from 'aws-lambda';
import { isFunction, isString } from 'remeda';

import {
  appSyncClient,
  appSyncResolver,
  getAppSyncFromContext,
  MiddlewareContext,
} from '../../lib/middleware/index.js';

import { emails, ids, subs } from '../auth/data/user.js';
import { appSyncEndpointUrl, awsAccessKeyId, awsSecretAccessKey } from '../data/index.js';

export const checkAppSyncClientMiddlewareContext = (context: MiddlewareContext) => {
  const { request } = getAppSyncFromContext(context);

  if (!isFunction(request)) {
    throw new Error('no request function found');
  }
};

export const checkAppSyncResolverMiddlewareContext = (context: MiddlewareContext) => {
  const { sub } = getAppSyncFromContext(context);

  if (!isString(sub)) {
    throw new Error('no sub found');
  }
};

describe('AppSync middleware handler', () => {
  const OLD_ENV = process.env;

  describe('resolver', () => {
    const handler = middy<AppSyncResolverEvent<void, void>, void, Error, MiddlewareContext>()
      .use(appSyncResolver())
      .handler(async (_, context) => checkAppSyncResolverMiddlewareContext(context));

    const event = (props?: { email?: string; sub?: string; userId?: string }) => {
      const { email, sub, userId } = props || {};
      return {
        identity: {
          claims: {
            email,
            userId,
          },
          sub,
        },
      } as AppSyncResolverEvent<void, void>;
    };

    const context = {} as MiddlewareContext;

    beforeEach(() => {
      process.env = { ...OLD_ENV }; // make a copy
    });

    afterEach(() => {
      vi.clearAllMocks();
      process.env = OLD_ENV; // restore old env
    });

    test('successful initialisation', async () =>
      expect(handler(event({ email: emails[0], sub: subs[0], userId: ids[0] }), context)).resolves.toBeUndefined());

    test('missing email', async () =>
      expect(handler(event({ sub: subs[0] }), context)).rejects.toThrowError('no email given'));

    test('missing sub', async () =>
      expect(handler(event({ email: emails[0], userId: ids[0] }), context)).rejects.toThrowError('no sub given'));

    test('missing userId', async () =>
      expect(handler(event({ email: emails[0], sub: subs[0] }), context)).rejects.toThrowError('no user id given'));
  });

  describe('client', () => {
    const handler = middy<void, void, Error, MiddlewareContext>()
      .use(appSyncClient())
      .handler(async (_, context) => checkAppSyncClientMiddlewareContext(context));

    const context = {} as MiddlewareContext;

    beforeEach(() => {
      process.env = { ...OLD_ENV }; // make a copy
      process.env['APPSYNC_ENDPOINT_URL'] = appSyncEndpointUrl;
      process.env['AWS_REGION'] = 'eu-central-1';
      process.env['AWS_ACCESS_KEY_ID'] = awsAccessKeyId;
      process.env['AWS_SECRET_ACCESS_KEY'] = awsSecretAccessKey;
    });

    afterEach(() => {
      vi.clearAllMocks();
      process.env = OLD_ENV; // restore old env
    });

    test('successful initialisation', async () => expect(handler(undefined, context)).resolves.toBeUndefined());

    test('missing endpoint', async () => {
      process.env['APPSYNC_ENDPOINT_URL'] = undefined;
      return expect(handler(undefined, context)).rejects.toThrowError('no endpoint given');
    });

    test('missing region', async () => {
      process.env['AWS_REGION'] = undefined;
      return expect(handler(undefined, context)).rejects.toThrowError('no region given');
    });

    test('missing access key', async () => {
      process.env['AWS_ACCESS_KEY_ID'] = undefined;
      return expect(handler(undefined, context)).rejects.toThrowError('no access key id given');
    });

    test('missing secret key', async () => {
      process.env['AWS_SECRET_ACCESS_KEY'] = undefined;
      return expect(handler(undefined, context)).rejects.toThrowError('no secret access key given');
    });
  });
});
