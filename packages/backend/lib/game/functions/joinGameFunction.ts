import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { IEventBus } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

import { BaseNodejsFunction } from '../../common/lambda.js';

export interface JoinGameFunctionProps {
  eventBus: IEventBus;
  table: ITable;
}

export class JoinGameFunction extends BaseNodejsFunction {
  constructor(scope: Construct, props: JoinGameFunctionProps) {
    const { eventBus, table } = props;

    super(scope, 'JoinGame', {
      dynamodb: {
        table,
        grantWriteData: true,
      },
      eventBridge: {
        eventBus,
        grantPutEvents: true,
      },
      nodejsFunctionProps: {
        environment: {
          POWERTOOLS_METRICS_NAMESPACE: 'Game',
        },
      },
    });
  }
}
