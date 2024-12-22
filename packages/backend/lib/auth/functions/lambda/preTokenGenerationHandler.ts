import middy from '@middy/core';

import {
  dynamoDB,
  getCognitoFromContext,
  getPowertoolsFromContext,
  MiddlewarePreTokenGenerationTriggerHandler,
  MiddyfiedMiddlewarePreTokenGenerationTriggerHandler,
  powertools,
  preTokenGeneration,
} from '../../../middleware/index.js';

import { User } from './model/index.js';

export const baseHandler: MiddlewarePreTokenGenerationTriggerHandler = async (event, context) => {
  const { email, firstName, lastName, name, sub } = getCognitoFromContext(context);
  const { logger } = getPowertoolsFromContext(context);

  const user = await User.getByEmail(context, email).catch((err0: Error) => {
    logger.debug(`no user found for user id ${sub}. creating one...`, {
      error: { message: err0.message },
    });

    //
    const [first, last] = !firstName && !lastName && name ? name.split(' ') : [undefined, undefined];
    return User.createFromEmail(context, email, firstName ?? first, lastName ?? last).catch((err1) => {
      logger.error(`user creation failed for sub: ${sub} with email: ${email}`);
      throw err1;
    });
  });

  const claimsToAddOrOverride = {
    email: user.email,
    userId: user.id,
  };

  event.response = {
    claimsAndScopeOverrideDetails: {
      accessTokenGeneration: {
        claimsToAddOrOverride,
      },
      idTokenGeneration: {
        claimsToAddOrOverride,
      },
    },
  };

  return event;
};

export const handler: MiddyfiedMiddlewarePreTokenGenerationTriggerHandler = middy(baseHandler)
  .use(powertools())
  .use(dynamoDB())
  .use(preTokenGeneration());
