import { EventPattern } from 'aws-cdk-lib/aws-events';

export type DynamodbStreamEventActions = 'INSERT' | 'MODIFY' | 'REMOVE';

export const dynamodbStreamEventBridgePattern = (
  entity?: string,
  action?: DynamodbStreamEventActions[],
): EventPattern => ({
  detailType: ['dynamodb-stream-pipe'],
  ...(entity || action
    ? {
        detail: {
          ...(action ? { eventName: action } : {}),
          ...(entity ? { eventSource: [`aws:dynamodb:${entity}`] } : {}),
        },
      }
    : {}),
});

export const dynamodbStreamEventBridgeInsertPattern = (entity: string) =>
  dynamodbStreamEventBridgePattern(entity, ['INSERT']);
export const dynamodbStreamEventBridgeInsertOrModifyPattern = (entity: string) =>
  dynamodbStreamEventBridgePattern(entity, ['INSERT', 'MODIFY']);
export const dynamodbStreamEventBridgeModifyPattern = (entity: string) =>
  dynamodbStreamEventBridgePattern(entity, ['MODIFY']);
export const dynamodbStreamEventBridgeRemovePattern = (entity: string) =>
  dynamodbStreamEventBridgePattern(entity, ['REMOVE']);
