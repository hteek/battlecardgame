import { Sha256 } from '@aws-crypto/sha256-js';
import { Logger } from '@aws-lambda-powertools/logger';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { HttpRequest } from '@smithy/protocol-http';
import { SignatureV4 } from '@smithy/signature-v4';
import { MiddlewareObj, MiddyfiedHandler } from '@middy/core';
import { getInternal } from '@middy/util';

import { AppSyncIdentityCognito, AppSyncResolverEvent, AppSyncResolverHandler } from 'aws-lambda';
import axios from 'axios';

import { MiddlewareContext } from './handler.js';

export type MiddlewareAppSyncResolverHandler<
  TArguments,
  TResult,
  TSource = Record<string, unknown> | null,
> = AppSyncResolverHandler<TArguments, TResult, TSource> extends (
  event: infer E,
  context: infer _,
  callback: infer C,
) => infer R
  ? (event: E, context: MiddlewareContext, callback: C) => R
  : never;

export type MiddyfiedMiddlewareAppSyncResolverHandler<
  TArguments,
  TResult,
  TSource = Record<string, unknown> | null,
> = MiddyfiedHandler<AppSyncResolverEvent<TArguments, TSource>, TResult, Error, MiddlewareContext>;

const logger = new Logger();

export const appSyncResolver = (): MiddlewareObj => ({
  before: async (request) => {
    const { identity } = request.event as AppSyncResolverEvent<unknown>;
    const {
      claims: { email, userId },
      sub,
    } = identity as AppSyncIdentityCognito;

    if (!email) {
      throw new Error('no email given');
    }

    if (!userId) {
      throw new Error('no user id given');
    }

    if (!sub) {
      throw new Error('no sub given');
    }

    Object.assign(request.internal, {
      email,
      sub,
      userId,
    });

    Object.assign(request.context, {
      appSync: {
        ...(await getInternal(['email'], request)),
        ...(await getInternal(['sub'], request)),
        ...(await getInternal(['userId'], request)),
      },
    });
  },
});

export type AppSyncRequest = {
  query: string;
  operationName: string;
  variables: { [key: string]: unknown };
};

export const appSyncClient = (): MiddlewareObj => ({
  before: async (request) => {
    const apiUrl = process.env['APPSYNC_ENDPOINT_URL'];

    if (!apiUrl) {
      throw new Error('no endpoint given');
    }

    const region = process.env['AWS_REGION'];

    if (!region) {
      throw new Error('no region given');
    }

    const accessKeyId = process.env['AWS_ACCESS_KEY_ID'];

    if (!accessKeyId) {
      throw new Error('no access key id given');
    }

    const secretAccessKey = process.env['AWS_SECRET_ACCESS_KEY'];

    if (!secretAccessKey) {
      throw new Error('no secret access key given');
    }

    const { host, pathname } = new URL(apiUrl);

    const signer = new SignatureV4({
      credentials: defaultProvider(),
      service: 'appsync',
      region,
      sha256: Sha256,
    });

    Object.assign(request.internal, {
      request: async (req: AppSyncRequest) => {
        logger.debug('appsync request', req);
        const { headers, body } = await signer.sign(
          new HttpRequest({
            hostname: host,
            path: pathname,
            body: JSON.stringify(req),
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              host,
            },
          }),
        );

        return axios
          .post(apiUrl, body, { headers })
          .then((res) => {
            logger.debug('appsync response', JSON.stringify(res.data));
            return res.data;
          })
          .catch((err) => logger.error('appsync error', err));
      },
    });

    Object.assign(request.context, {
      appSync: {
        ...(await getInternal(['request'], request)),
      },
    });
  },
});
