import { Construct } from 'constructs';
import { IEventBus } from 'aws-cdk-lib/aws-events';

import { BaseNodejsFunction } from '../../common/index.js';

export interface OnNotificationFunctionProperties {
  readonly apiGraphqlUrl: string;
  readonly eventBus: IEventBus;
}

export class OnNotificationFunction extends BaseNodejsFunction {
  constructor(scope: Construct, props: OnNotificationFunctionProperties) {
    const { apiGraphqlUrl, eventBus } = props;

    super(scope, 'OnNotification', {
      eventBridge: {
        eventBus,
        eventPattern: {
          detailType: ['battlecardgame-system-notification', 'battlecardgame-user-notification'],
        },
      },
      nodejsFunctionProps: {
        environment: {
          APPSYNC_ENDPOINT_URL: apiGraphqlUrl,
          POWERTOOLS_METRICS_NAMESPACE: 'Notification',
        },
      },
    });
  }
}
