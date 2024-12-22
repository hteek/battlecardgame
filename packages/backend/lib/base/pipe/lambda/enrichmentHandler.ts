import middy, { MiddyfiedHandler } from '@middy/core';

import { DynamoDBRecord } from 'aws-lambda';
import { map } from 'remeda';

import { MiddlewareContext, MiddlewareHandler, powertools } from '../../../middleware/index.js';

export type Authored = {
  id: string;
  name: string;
};

export type Entity = {
  pk: string;
  sk: string;
  _type: string;
  created: string;
  createdAt?: number;
  createdBy?: Authored;
  updatedAt?: number;
  updatedBy?: Authored;
};

const baseHandler: MiddlewareHandler<DynamoDBRecord[], DynamoDBRecord[]> = async (event) =>
  map(event, (record) => {
    const { dynamodb, eventName, eventSource } = record;

    if (dynamodb) {
      const { OldImage, NewImage } = dynamodb;
      const image = eventName === 'REMOVE' ? OldImage : NewImage;

      if (image) {
        record.eventSource = `${eventSource}:${image['_type']['S']}`;
      }
    }

    return record;
  });

export const handler: MiddyfiedHandler<DynamoDBRecord[], DynamoDBRecord[], Error, MiddlewareContext> = middy(
  baseHandler,
).use(powertools());
