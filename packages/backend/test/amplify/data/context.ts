import { MiddlewareContext } from '../../../lib/middleware/index.js';

import { vi } from 'vitest';

export const createTestContext = ({
  amplifyStartJob = vi.fn(() =>
    Promise.resolve({
      $metadata: {
        httpStatusCode: 200,
      },
      jobSummary: undefined,
    }),
  ),
  powertoolsLoggerDebug = vi.fn(() => undefined),
  powertoolsLoggerError = vi.fn(() => undefined),
  powertoolsLoggerInfo = vi.fn(() => undefined),
  powertoolsTracerPutAnnotation = vi.fn(() => undefined),
  powertoolsMetricsAddMetric = vi.fn(() => undefined),
}) => ({
  context: {
    amplify: {
      startJob: amplifyStartJob,
    },
    powertools: {
      logger: { debug: powertoolsLoggerDebug, error: powertoolsLoggerError, info: powertoolsLoggerInfo },
      tracer: { putAnnotation: powertoolsTracerPutAnnotation },
      metrics: { addMetric: powertoolsMetricsAddMetric },
    },
  } as unknown as MiddlewareContext,
  mocks: {
    amplifyStartJob,
    powertoolsLoggerDebug,
    powertoolsLoggerError,
    powertoolsLoggerInfo,
    powertoolsTracerPutAnnotation,
    powertoolsMetricsAddMetric,
  },
});
