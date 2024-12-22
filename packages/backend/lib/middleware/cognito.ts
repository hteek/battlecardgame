import middy, { MiddyfiedHandler } from '@middy/core';
import { getInternal } from '@middy/util';

import { CustomMessageTriggerEvent, PreTokenGenerationV2TriggerEvent } from 'aws-lambda';

import { MiddlewareContext, MiddlewareHandler } from './handler.js';

export type MiddlewarePreTokenGenerationTriggerHandler = MiddlewareHandler<PreTokenGenerationV2TriggerEvent>;
export type MiddyfiedMiddlewarePreTokenGenerationTriggerHandler = MiddyfiedHandler<
  PreTokenGenerationV2TriggerEvent,
  unknown,
  Error,
  MiddlewareContext
>;

export type MiddlewareCustomMessageTriggerHandler = MiddlewareHandler<CustomMessageTriggerEvent>;
export type MiddyfiedMiddlewareCustomMessageTriggerHandler = MiddyfiedHandler<
  CustomMessageTriggerEvent,
  unknown,
  Error,
  MiddlewareContext
>;

export const preTokenGeneration = (): middy.MiddlewareObj => ({
  before: async (request) => {
    const {
      request: {
        userAttributes: { email, sub, given_name, family_name, name },
      },
      triggerSource,
    } = request.event as PreTokenGenerationV2TriggerEvent;

    if (!email) {
      throw new Error('no email given');
    }

    if (!sub) {
      throw new Error('no sub given');
    }

    Object.assign(request.internal, {
      email,
      firstName: given_name,
      lastName: family_name,
      name,
      sub,
      triggerSource,
    });

    Object.assign(request.context, {
      cognito: {
        ...(await getInternal(['email'], request)),
        ...(await getInternal(['firstName'], request)),
        ...(await getInternal(['lastName'], request)),
        ...(await getInternal(['name'], request)),
        ...(await getInternal(['sub'], request)),
        ...(await getInternal(['triggerSource'], request)),
      },
    });
  },
});
