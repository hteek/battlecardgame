import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import middy from '@middy/core';
import { getInternal } from '@middy/util';

import { DynamoDBStreamEvent } from 'aws-lambda';
import { Table, OneSchema } from 'dynamodb-onetable';
import Dynamo from 'dynamodb-onetable/Dynamo';

import { MiddlewareHandler } from './handler.js';

export type MiddlewareDynamoDBStreamHandler = MiddlewareHandler<DynamoDBStreamEvent, void>;

const logger = new Logger();
const client = new DynamoDBClient({});

export const dynamoDB = (): middy.MiddlewareObj => ({
  before: async (request) => {
    const tableName = process.env['TABLE'];

    if (!tableName) {
      throw new Error('no table name given');
    }

    const getTable = (schema: OneSchema) =>
      new Table({
        client: new Dynamo({ client }),
        logger: (level, message, context) => {
          switch (level) {
            case 'data':
            case 'trace':
              logger.debug(message, context);
              break;
            case 'error':
            case 'exception':
              logger.error(message, context);
              break;
            case 'warn':
              logger.warn(message, context);
              break;
            default:
              logger.info(message, context);
          }
        },
        name: tableName,
        partial: false,
        schema,
      });

    Object.assign(request.internal, {
      getTable,
      tableName,
    });

    Object.assign(request.context, {
      dynamoDB: {
        ...(await getInternal(['getTable'], request)),
        ...(await getInternal(['tableName'], request)),
      },
    });
  },
});
