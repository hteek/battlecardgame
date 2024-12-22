import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { StartJobCommandOutput } from '@aws-sdk/client-amplify';
import { PutEventsCommandOutput } from '@aws-sdk/client-eventbridge';
import { NativeAttributeValue } from '@aws-sdk/util-dynamodb';
import middy, { MiddyfiedHandler } from '@middy/core';

import { Context, Handler } from 'aws-lambda';
import { OneSchema, Table } from 'dynamodb-onetable';

import { AppSyncRequest } from './appSync.js';

export type AmplifyContext = { startJob: () => Promise<StartJobCommandOutput> };

export type AppSyncContext = {
  email: string;
  request: <T>(req: AppSyncRequest) => Promise<T>;
  sub: string;
  userId: string;
};

export type CognitoContext = {
  clientId: string;
  codeParameter: string;
  email: string;
  firstName?: string;
  lastName?: string;
  locale: string;
  name?: string;
  triggerSource: string;
  sub: string;
  username: string;
};

export type DynamoDBContext = { getTable: (schema: OneSchema) => Table; tableName: string };

export type DynamoDBRecordContext = {
  approximateCreationDateTime: number | undefined;
  entity: string | undefined;
  eventName: 'INSERT' | 'MODIFY' | 'REMOVE' | undefined;
  getImages: <T = Record<string, NativeAttributeValue>>() => { newImage: T | undefined; oldImage: T | undefined };
  getNewImage: <T>() => T;
  getOldImage: <T>() => T;
  id: string | undefined;
  referenceId: string | undefined;
  userId: string | undefined;
};

export type EventBridgeContext = {
  eventBusName: string;
  notify: (action: 'INSERT' | 'MODIFY' | 'REMOVE', entity: string, id: string) => Promise<PutEventsCommandOutput>;
};

export type PowertoolsContext = { logger: Logger; metrics: Metrics; tracer: Tracer };

export type SnsContext = { topicArn: string };

export interface MiddlewareContext extends Context {
  amplify?: AmplifyContext;
  appSync?: AppSyncContext;
  cognito?: CognitoContext;
  dynamoDB?: DynamoDBContext;
  dynamoDBRecord?: DynamoDBRecordContext;
  eventBridge?: EventBridgeContext;
  powertools?: PowertoolsContext;
}

const getFromContext = <T>(context: MiddlewareContext, key: keyof MiddlewareContext): T => {
  const result = context[key];
  if (!result) {
    throw new Error(`${key} not found in context`);
  }
  return result as T;
};

export const getAmplifyFromContext = (context: MiddlewareContext) => getFromContext<AmplifyContext>(context, 'amplify');
export const getAppSyncFromContext = (context: MiddlewareContext) => getFromContext<AppSyncContext>(context, 'appSync');
export const getCognitoFromContext = (context: MiddlewareContext) => getFromContext<CognitoContext>(context, 'cognito');
export const getDynamoDBFromContext = (context: MiddlewareContext) =>
  getFromContext<DynamoDBContext>(context, 'dynamoDB');
export const getDynamoDBRecordFromContext = (context: MiddlewareContext) =>
  getFromContext<DynamoDBRecordContext>(context, 'dynamoDBRecord');
export const getEventBridgeFromContext = (context: MiddlewareContext) =>
  getFromContext<EventBridgeContext>(context, 'eventBridge');
export const getPowertoolsFromContext = (context: MiddlewareContext) =>
  getFromContext<PowertoolsContext>(context, 'powertools');

export type MiddlewareHandler<TEvent = unknown, TResult = unknown> = Handler<TEvent, TResult> extends (
  event: infer E,
  context: infer _,
  callback: infer C,
) => infer R
  ? (event: E, context: MiddlewareContext, callback: C) => R
  : never;

export type MiddyfiedMiddlewareHandler<TEvent = unknown, TResult = unknown> = MiddyfiedHandler<
  TEvent,
  TResult,
  Error,
  MiddlewareContext
>;

export const createMiddlewareHandler = <TEvent, TResult>(handler: MiddlewareHandler<TEvent, TResult>) => middy(handler);
