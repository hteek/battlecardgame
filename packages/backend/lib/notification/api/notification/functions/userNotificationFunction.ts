import { Construct } from 'constructs';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

import { BaseNodejsFunction } from '../../../../common/index.js';

export interface UserNotificationFunctionProps {
  table: ITable;
}

export class UserNotificationFunction extends BaseNodejsFunction {
  constructor(scope: Construct, props: UserNotificationFunctionProps) {
    const { table } = props;
    super(scope, 'UserNotification', {
      dynamodb: {
        table,
      },
      nodejsFunctionProps: {
        environment: {
          POWERTOOLS_METRICS_NAMESPACE: 'Notification',
        },
      },
    });
  }
}
