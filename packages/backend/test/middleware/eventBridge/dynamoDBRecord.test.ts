import middy from '@middy/core';

import { DynamoDBRecord, EventBridgeEvent } from 'aws-lambda';
import { dynamoDBRecord, getDynamoDBRecordFromContext, MiddlewareContext } from '../../../lib/middleware/index.js';
import { isFunction, isNumber, isString } from 'remeda';
import { dynamoDbRecordEvent, dynamoDbTest } from '../data/events.js';

export const checkEventBridgeDynamoDBRecordMiddlewareContext = (context: MiddlewareContext) => {
  const { approximateCreationDateTime, entity, getNewImage, getImages, getOldImage, id } =
    getDynamoDBRecordFromContext(context);

  if (!isNumber(approximateCreationDateTime)) {
    throw new Error('no approximate creation datetime found');
  }
  if (!isString(entity)) {
    throw new Error('no entity found');
  }
  if (!isFunction(getNewImage)) {
    throw new Error('no get new image function found');
  }
  if (!isFunction(getNewImage)) {
    throw new Error('no get new image function found');
  }
  if (!isFunction(getImages)) {
    throw new Error('no get images function found');
  }
  if (!isFunction(getOldImage)) {
    throw new Error('no get old image function found');
  }
  if (!isString(id)) {
    throw new Error('no id found');
  }

  console.log(getNewImage());
  console.log(getOldImage());
};

describe('EventBridge middleware handler', () => {
  const OLD_ENV = process.env;
  const context = {} as MiddlewareContext;

  describe('dynamo db record', () => {
    const handler = middy<EventBridgeEvent<'test', DynamoDBRecord>, void, Error, MiddlewareContext>()
      .use(dynamoDBRecord())
      .handler(async (_, context) => checkEventBridgeDynamoDBRecordMiddlewareContext(context));

    beforeEach(() => {
      process.env = { ...OLD_ENV }; // make a copy
    });

    afterEach(() => {
      vi.clearAllMocks();
      process.env = OLD_ENV; // restore old env
    });

    test('called successfully', async () =>
      expect(
        middy(handler).use(dynamoDBRecord())(dynamoDbRecordEvent(dynamoDbTest, 'MODIFY'), context),
      ).resolves.toBeUndefined());

    test('no new image', async () =>
      expect(
        middy(handler).use(dynamoDBRecord())(dynamoDbRecordEvent(dynamoDbTest, 'REMOVE'), context),
      ).rejects.toThrowError('no new image found in stream record'));

    test('no old image', async () =>
      expect(
        middy(handler).use(dynamoDBRecord())(dynamoDbRecordEvent(dynamoDbTest, 'INSERT'), context),
      ).rejects.toThrowError('no old image found in stream record'));

    test('no entity image', async () =>
      expect(middy(handler).use(dynamoDBRecord())(dynamoDbRecordEvent(), context)).rejects.toThrowError(
        'no dynamo db record found',
      ));
  });
});
