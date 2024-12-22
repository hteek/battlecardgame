import { DynamoDBRecord, EventBridgeEvent, EventBridgeHandler } from 'aws-lambda';

import middy, { MiddyfiedHandler } from '@middy/core';

import { MiddlewareContext } from '../handler.js';

export type MiddlewareEventBridgeHandler<TDetailType extends string, TDetail, TResult> =
  EventBridgeHandler<TDetailType, TDetail, TResult> extends (
    event: infer E,
    context: infer _,
    callback: infer C,
  ) => infer R
    ? (event: E, context: MiddlewareContext, callback: C) => R
    : never;

export type MiddyfiedMiddlewareEventBridgeHandler<
  TDetailType extends string,
  TDetail,
  TResult = void,
> = MiddyfiedHandler<EventBridgeEvent<TDetailType, TDetail>, TResult, Error, MiddlewareContext>;

export const createMiddlewareEventBridgeHandler = <TDetailType extends string, TDetail, TResult = void>(
  handler: MiddlewareEventBridgeHandler<TDetailType, TDetail, TResult>,
) => middy(handler);

export type MiddlewareDynamoDBRecordEventBridgeHandler<
  TDetailType extends string,
  TResult = void,
> = MiddlewareEventBridgeHandler<TDetailType, DynamoDBRecord, TResult>;

export type MiddyfiedMiddlewareDynamoDBRecordEventBridgeHandler<
  TDetailType extends string,
  TResult = void,
> = MiddyfiedHandler<EventBridgeEvent<TDetailType, DynamoDBRecord>, TResult, Error, MiddlewareContext>;

export const createMiddlewareDynamoDBRecordEventBridgeHandler = <TDetailType extends string, TResult>(
  handler: MiddlewareEventBridgeHandler<TDetailType, DynamoDBRecord, TResult>,
) => middy(handler);
