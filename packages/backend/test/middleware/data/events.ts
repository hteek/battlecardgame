import { marshall } from '@aws-sdk/util-dynamodb';

import { AttributeValue, DynamoDBRecord, EventBridgeEvent } from 'aws-lambda';
import { pick } from 'remeda';

export type DynamoDBTestEntity = {
  pk: string;
  sk: string;
  _type: string;
  id: string;
  value: string;
};

export const dynamoDbTest: DynamoDBTestEntity = {
  pk: 'pk',
  sk: 'sk',
  _type: 'testEntity',
  id: 'testId',
  value: 'test',
};
export const dynamoDbRecordEvent = (entity?: DynamoDBTestEntity, eventName?: 'INSERT' | 'MODIFY' | 'REMOVE') => {
  const image = entity ? marshall(entity) : undefined;
  return {
    version: '0',
    id: 'ee8716cb-b97c-5e23-62ee-ec216bd4a583',
    'detail-type': 'test',
    source: 'aws-dynamodb-stream-eventbridge-fanout',
    account: '469901899619',
    time: '2021-11-02T14:18:46Z',
    region: 'eu-central-1',
    resources: ['testTable'],
    detail: {
      eventID: '256499a8e55356fd5f7764ea0d1a4bfd',
      eventName,
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'eu-central-1',
      ...(image
        ? {
            dynamodb: {
              ApproximateCreationDateTime: 1635862726000,
              Keys: pick(image, ['pk', 'sk']) as { [key: string]: AttributeValue },
              ...(eventName !== 'REMOVE' ? { NewImage: image as { [key: string]: AttributeValue } } : {}),
              ...(eventName !== 'INSERT' ? { OldImage: image as { [key: string]: AttributeValue } } : {}),
              SequenceNumber: '265480500000000039031411270',
              SizeBytes: 270,
              StreamViewType: 'NEW_AND_OLD_IMAGES',
            },
          }
        : {}),
      eventSourceARN: 'arn:aws:dynamodb:eu-central-1:469901899619:table/testTable/stream/2021-09-07T19:06:54.962',
    },
  } as EventBridgeEvent<'test', DynamoDBRecord>;
};
