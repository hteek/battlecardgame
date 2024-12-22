import { AttributeValue as DynamoDbAttributeValue } from '@aws-sdk/client-dynamodb';
import { NativeAttributeValue, unmarshall } from '@aws-sdk/util-dynamodb';
import middy from '@middy/core';
import { getInternal } from '@middy/util';

import { AttributeValue, DynamoDBRecord, EventBridgeEvent } from 'aws-lambda';

export const dynamoDBRecord = (): middy.MiddlewareObj => ({
  before: async (request) => {
    const { dynamodb, eventName } = (request.event as EventBridgeEvent<string, DynamoDBRecord>).detail;
    const {
      ApproximateCreationDateTime: approximateCreationDateTime,
      NewImage: newImage,
      OldImage: oldImage,
    } = dynamodb || {};

    if (!dynamodb) {
      throw new Error('no dynamo db record found');
    }

    const getImage = <T = Record<string, NativeAttributeValue>>(image?: {
      [key: string]: AttributeValue;
    }): T | undefined => (image ? (unmarshall(image as Record<string, DynamoDbAttributeValue>) as T) : undefined);

    const image = eventName === 'REMOVE' ? getImage(oldImage) : getImage(newImage);
    const entity = image ? image['_type'] : undefined;
    const id = image ? image['id'] : undefined;
    const referenceId = image ? image['referenceId'] : undefined;
    const userId = image ? image['userId'] : undefined;

    const getImages = <T = Record<string, NativeAttributeValue>>() => ({
      newImage: getImage<T>(newImage),
      oldImage: getImage<T>(oldImage),
    });

    const getNewImage = <T = Record<string, NativeAttributeValue>>() => {
      if (!newImage) {
        throw new Error('no new image found in stream record');
      }
      return getImage<T>(newImage);
    };

    const getOldImage = <T = Record<string, NativeAttributeValue>>() => {
      if (!oldImage) {
        throw new Error('no old image found in stream record');
      }
      return getImage<T>(oldImage);
    };

    Object.assign(request.internal, {
      approximateCreationDateTime,
      entity,
      eventName,
      getImages,
      getNewImage,
      getOldImage,
      id,
      referenceId,
      userId,
    });

    Object.assign(request.context, {
      dynamoDBRecord: {
        ...(await getInternal(['approximateCreationDateTime'], request)),
        ...(await getInternal(['entity'], request)),
        ...(await getInternal(['eventName'], request)),
        ...(await getInternal(['getImages'], request)),
        ...(await getInternal(['getNewImage'], request)),
        ...(await getInternal(['getOldImage'], request)),
        ...(await getInternal(['id'], request)),
        ...(await getInternal(['referenceId'], request)),
        ...(await getInternal(['userId'], request)),
      },
    });
  },
});
