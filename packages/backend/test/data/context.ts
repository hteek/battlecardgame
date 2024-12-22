import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { OneSchema, Table } from 'dynamodb-onetable';
import Dynamo from 'dynamodb-onetable/Dynamo';
import { vi } from 'vitest';

import { MiddlewareContext } from '../../lib/middleware/index.js';

import { users } from '../auth/data/user.js';

import { clientId, codeParameter, eventBusName, tableName } from './index.js';

const { email, sub, id: userId } = users[0];
export const context = {
  appSync: {
    email,
    sub,
    userId,
  },
  dynamoDB: {
    getTable: (schema: OneSchema) =>
      new Table({
        client: new Dynamo({ client: new DynamoDBClient({}) }),
        name: tableName,
        partial: false,
        schema,
      }),
    tableName,
  },
  eventBridge: {
    eventBusName,
  },
} as MiddlewareContext;

export const createTestContext = ({
  appSyncEmail = users[0].email,
  appSyncSub = users[0].sub,
  appSyncUserId = users[0].id,
  cognitoClientId = clientId,
  cognitoCodeParameter = codeParameter,
  cognitoEmail = users[0].email,
  cognitoFirstName = users[0].firstName,
  cognitoLastName = users[0].lastName,
  cognitoSub = users[0].sub,
  cognitoTriggerSource = '',
  cognitoUsername = users[0].sub,
  powertoolsLoggerDebug = vi.fn(() => undefined),
  powertoolsLoggerError = vi.fn(() => undefined),
  powertoolsLoggerInfo = vi.fn(() => undefined),
  powertoolsTracerPutAnnotation = vi.fn(() => undefined),
  powertoolsMetricsAddMetric = vi.fn(() => undefined),
}) => ({
  context: {
    appSync: {
      email: appSyncEmail,
      sub: appSyncSub,
      userId: appSyncUserId,
    },
    cognito: {
      clientId: cognitoClientId,
      codeParameter: cognitoCodeParameter,
      email: cognitoEmail,
      firstName: cognitoFirstName,
      lastName: cognitoLastName,
      sub: cognitoSub,
      triggerSource: cognitoTriggerSource,
      username: cognitoUsername,
    },

    powertools: {
      logger: { debug: powertoolsLoggerDebug, error: powertoolsLoggerError, info: powertoolsLoggerInfo },
      tracer: { putAnnotation: powertoolsTracerPutAnnotation },
      metrics: { addMetric: powertoolsMetricsAddMetric },
    },
  } as unknown as MiddlewareContext,
  mocks: {
    powertoolsLoggerDebug,
    powertoolsLoggerError,
    powertoolsLoggerInfo,
    powertoolsTracerPutAnnotation,
    powertoolsMetricsAddMetric,
  },
});
