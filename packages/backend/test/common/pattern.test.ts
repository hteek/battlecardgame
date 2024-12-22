import {
  dynamodbStreamEventBridgeInsertOrModifyPattern,
  dynamodbStreamEventBridgeInsertPattern,
  dynamodbStreamEventBridgeModifyPattern,
  dynamodbStreamEventBridgePattern,
  dynamodbStreamEventBridgeRemovePattern,
} from '../../lib/common/index.js';

describe('dynamodb stream eventbridge pattern', () => {
  test('insert', () => {
    expect(dynamodbStreamEventBridgeInsertPattern('Test')).toStrictEqual({
      detail: {
        eventName: ['INSERT'],
        eventSource: ['aws:dynamodb:Test'],
      },
      detailType: ['dynamodb-stream-pipe'],
    });
  });

  test('insert or modify', () => {
    expect(dynamodbStreamEventBridgeInsertOrModifyPattern('Test')).toStrictEqual({
      detail: {
        eventName: ['INSERT', 'MODIFY'],
        eventSource: ['aws:dynamodb:Test'],
      },
      detailType: ['dynamodb-stream-pipe'],
    });
  });

  test('modify', () => {
    expect(dynamodbStreamEventBridgeModifyPattern('Test')).toStrictEqual({
      detail: {
        eventName: ['MODIFY'],
        eventSource: ['aws:dynamodb:Test'],
      },
      detailType: ['dynamodb-stream-pipe'],
    });
  });

  test('remove', () => {
    expect(dynamodbStreamEventBridgeRemovePattern('Test')).toStrictEqual({
      detail: {
        eventName: ['REMOVE'],
        eventSource: ['aws:dynamodb:Test'],
      },
      detailType: ['dynamodb-stream-pipe'],
    });
  });

  test('custom entity only', () => {
    expect(dynamodbStreamEventBridgePattern('Test')).toStrictEqual({
      detail: {
        eventSource: ['aws:dynamodb:Test'],
      },
      detailType: ['dynamodb-stream-pipe'],
    });
  });

  test('custom event name only', () => {
    expect(dynamodbStreamEventBridgePattern(undefined, ['INSERT'])).toStrictEqual({
      detail: {
        eventName: ['INSERT'],
      },
      detailType: ['dynamodb-stream-pipe'],
    });
  });

  test('custom no detail', () => {
    expect(dynamodbStreamEventBridgePattern()).toStrictEqual({
      detailType: ['dynamodb-stream-pipe'],
    });
  });
});
