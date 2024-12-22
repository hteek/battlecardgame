import { marshall } from '@aws-sdk/util-dynamodb';

import { AttributeValue, DynamoDBRecord, Handler } from 'aws-lambda';

import lambdaTester from 'lambda-tester';

import MockDate from 'mockdate';
import { times } from 'remeda';

import { Entity, handler } from '../../../../lib/base/pipe/lambda/enrichmentHandler.js';

describe('Enrichment handler', () => {
  const OLD_ENV = process.env;
  const testHandler = handler as unknown as Handler<DynamoDBRecord[], DynamoDBRecord[]>;

  const inputEntity = (): Entity => {
    return {
      pk: 'TEST#1234',
      sk: 'METADATA#1234',
      created: '2019-05-14T11:01:58.135Z',
      _type: 'Test',
    };
  };

  const createRecordDummy = (props?: {
    approximateCreationDateTime?: number;
    eventName: 'MODIFY' | 'INSERT' | 'REMOVE';
    entity?: string;
    newImage?: Entity;
    oldImage?: Entity;
  }): DynamoDBRecord => {
    const {
      eventName,
      newImage,
      oldImage,
      approximateCreationDateTime: ApproximateCreationDateTime,
      entity,
    } = props || {};
    return {
      eventName,
      eventSource: `aws:dynamodb${entity ? ':' + entity : ''}`,
      ...(newImage || oldImage
        ? {
            dynamodb: {
              NewImage: newImage
                ? (marshall(newImage) as {
                    [key: string]: AttributeValue;
                  })
                : undefined,
              OldImage: oldImage
                ? (marshall(oldImage) as {
                    [key: string]: AttributeValue;
                  })
                : undefined,
              ApproximateCreationDateTime,
            },
          }
        : {}),
    };
  };

  const createRecordsDummy = (props?: {
    amount?: number;
    approximateCreationDateTime?: boolean;
    eventName?: 'MODIFY' | 'INSERT' | 'REMOVE';
    entity?: string;
    newImage?: Entity;
    oldImage?: Entity;
  }): DynamoDBRecord[] => {
    const {
      amount = 1,
      eventName = 'MODIFY',
      entity,
      newImage,
      oldImage,
      approximateCreationDateTime = true,
    } = props || {};
    return times(amount, () =>
      createRecordDummy({
        eventName,
        entity,
        newImage,
        oldImage,
        approximateCreationDateTime: approximateCreationDateTime ? 1618226795 : undefined,
      }),
    );
  };

  describe('functionality', () => {
    beforeEach(() => {
      process.env = { ...OLD_ENV }; // make a copy
      MockDate.set(new Date('2000-02-20T23:00:00.000Z'));
    });

    afterEach(() => {
      MockDate.reset();
      process.env = OLD_ENV; // restore old env
    });

    test('adds entity to event source (modify)', async () => {
      return lambdaTester(testHandler)
        .event(createRecordsDummy({ newImage: inputEntity(), oldImage: inputEntity() }))
        .expectResult((result) => {
          expect(result).toStrictEqual(
            createRecordsDummy({ entity: 'Test', newImage: inputEntity(), oldImage: inputEntity() }),
          );
        });
    });

    test('adds entity to event source (insert)', async () => {
      return lambdaTester(testHandler)
        .event(createRecordsDummy({ eventName: 'INSERT', newImage: inputEntity() }))
        .expectResult((result) => {
          expect(result).toStrictEqual(
            createRecordsDummy({ entity: 'Test', eventName: 'INSERT', newImage: inputEntity() }),
          );
        });
    });

    test('adds entity to event source (remove)', async () => {
      return lambdaTester(testHandler)
        .event(createRecordsDummy({ eventName: 'REMOVE', oldImage: inputEntity() }))
        .expectResult((result) => {
          expect(result).toStrictEqual(
            createRecordsDummy({ entity: 'Test', eventName: 'REMOVE', oldImage: inputEntity() }),
          );
        });
    });

    test('no image ', async () => {
      return lambdaTester(testHandler)
        .event(createRecordsDummy())
        .expectResult((result) => {
          expect(result).toStrictEqual(createRecordsDummy());
        });
    });
  });
});
