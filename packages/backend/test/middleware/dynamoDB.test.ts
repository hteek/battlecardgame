import middy from '@middy/core';
import { DynamoDBStreamEvent } from 'aws-lambda';
import { isFunction, isString } from 'remeda';

import { dynamoDB, getDynamoDBFromContext, MiddlewareContext } from '../../lib/middleware/index.js';

import { tableName } from '../data/index.js';

export const checkDynamoDBMiddlewareContext = (context: MiddlewareContext) => {
  const { getTable, tableName } = getDynamoDBFromContext(context);

  if (!isFunction(getTable)) {
    throw new Error('no getTable function found');
  }
  if (!isString(tableName)) {
    throw new Error('no table name found');
  }

  const table = getTable({
    version: '0.0.1',
    indexes: {
      primary: { hash: 'pk', sort: 'sk' },
    },
    models: {},
  });

  table.getLog().logger('data', 'data message', {});
  table.getLog().logger('error', 'error message', {});
  table.getLog().logger('exception', 'exception message', {});
  table.getLog().logger('info', 'info message', {});
  table.getLog().logger('trace', 'trace message', {});
  table.getLog().logger('warn', 'warn message', {});
  table.getLog().logger('unknown', 'unknown message', {});
};

describe('DynamoDB middleware handler', () => {
  const OLD_ENV = process.env;

  const handler = middy<DynamoDBStreamEvent, void, Error, MiddlewareContext>()
    .use(dynamoDB())
    .handler(async (_, context) => checkDynamoDBMiddlewareContext(context));

  const event = {} as DynamoDBStreamEvent;
  const context = {} as MiddlewareContext;

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // make a copy
    process.env['TABLE'] = tableName;
  });

  afterEach(() => {
    vi.clearAllMocks();
    process.env = OLD_ENV; // restore old env
  });

  test('called successfully', async () => {
    return expect(handler(event, context)).resolves.toBeUndefined();
  });

  test('missing table name', async () => {
    process.env['TABLE'] = undefined;

    return expect(handler(event, context)).rejects.toThrowError('no table name given');
  });
});
