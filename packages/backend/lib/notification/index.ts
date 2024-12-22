import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { IGraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { IEventBus } from 'aws-cdk-lib/aws-events';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

import { BattleCardGameGraphqlApi } from '../api/index.js';

import { addApi } from './api/index.js';
import { OnNotificationFunction } from './functions/index.js';

/**
 * Configuration options for {@linkcode NotificationApiStack}.
 */
export interface NotificationApiConfig {
  readonly table: ITable;
  readonly userPool: IUserPool;
}

/**
 * Wrapper for {@linkcode NestedStackProps} to provide additional attributes.
 */
export interface NotificationApiStackProps extends NestedStackProps {
  /**
   * Configuration of the {@linkcode NotificationApiStack}.
   */
  readonly config: NotificationApiConfig;
  readonly projectId: string;
}

export class NotificationApiStack extends NestedStack {
  public readonly notificationGraphqlApi: BattleCardGameGraphqlApi;

  constructor(scope: Construct, id: string, props: NotificationApiStackProps) {
    super(scope, id, props);

    const { table, userPool } = props.config;
    const { projectId } = props;

    this.notificationGraphqlApi = addApi(this, {
      name: `${projectId}-notification`,
      table,
      userPool,
    });
  }
}

export interface NotificationConfig {
  readonly api: IGraphqlApi;
  readonly apiGraphqlUrl: string;
  readonly eventBus: IEventBus;
}

/**
 * Wrapper for {@linkcode NestedStackProps} to provide additional attributes.
 */
export interface NotificationStackProps extends NestedStackProps {
  /**
   * Configuration of the {@linkcode NotificationApiStack}.
   */
  readonly config: NotificationConfig;
  readonly projectId: string;
}

export class NotificationStack extends NestedStack {
  public readonly onNotificationFunction: IFunction;

  constructor(scope: Construct, id: string, props: NotificationStackProps) {
    super(scope, id, props);

    const { api, apiGraphqlUrl, eventBus } = props.config;

    this.onNotificationFunction = new OnNotificationFunction(this, { apiGraphqlUrl, eventBus });
    api.grantMutation(this.onNotificationFunction);
  }
}
