import { Logger } from '@aws-lambda-powertools/logger';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { InjectLambdaContextOptions } from '@aws-lambda-powertools/logger/types';

import { Metrics } from '@aws-lambda-powertools/metrics';
import { logMetrics } from '@aws-lambda-powertools/metrics/middleware';
import { ExtraOptions } from '@aws-lambda-powertools/metrics/types';

import { Tracer } from '@aws-lambda-powertools/tracer';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';
import { CaptureLambdaHandlerOptions } from '@aws-lambda-powertools/tracer/types';

import middy from '@middy/core';
import { getInternal } from '@middy/util';

const logger = new Logger();
const metrics = new Metrics();
const tracer = new Tracer();

export type PowertoolsOptions = {
  logger?: InjectLambdaContextOptions;
  tracer?: CaptureLambdaHandlerOptions;
  metrics?: ExtraOptions;
};

const defaults: PowertoolsOptions = {
  logger: { resetKeys: true },
  metrics: { captureColdStartMetric: true },
};

export const powertools = (options?: PowertoolsOptions): middy.MiddlewareObj[] => {
  const optionsWithDefaults = { ...defaults, ...options };
  return [
    captureLambdaHandler(tracer, optionsWithDefaults.tracer),
    injectLambdaContext(logger, optionsWithDefaults.logger),
    logMetrics(metrics, optionsWithDefaults.metrics),
    {
      before: async (request) => {
        Object.assign(request.internal, {
          logger,
          metrics,
          tracer,
        });

        Object.assign(request.context, {
          powertools: {
            ...(await getInternal(['logger'], request)),
            ...(await getInternal(['metrics'], request)),
            ...(await getInternal(['tracer'], request)),
          },
        });
      },
    },
  ];
};
