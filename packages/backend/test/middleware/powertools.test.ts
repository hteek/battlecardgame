import middy from '@middy/core';

import { isObjectType } from 'remeda';

import { getPowertoolsFromContext, MiddlewareContext, powertools } from '../../lib/middleware/index.js';

export const checkPowertoolsMiddlewareContext = (context: MiddlewareContext) => {
  const { logger, metrics, tracer } = getPowertoolsFromContext(context);

  if (!isObjectType(logger)) {
    throw new Error('no logger found');
  }
  if (!isObjectType(metrics)) {
    throw new Error('no metrics found');
  }
  if (!isObjectType(tracer)) {
    throw new Error('no tracer found');
  }
};

describe('Powertools middleware', () => {
  const OLD_ENV = process.env;

  const handler = middy<void, void, Error, MiddlewareContext>()
    .use(powertools())
    .handler(async (_, context) => checkPowertoolsMiddlewareContext(context));

  const context = {} as MiddlewareContext;

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterEach(() => {
    vi.clearAllMocks();
    process.env = OLD_ENV; // restore old env
  });

  test('successful initialisation', async () => {
    return expect(handler(undefined, context)).resolves.toBeUndefined();
  });
});
