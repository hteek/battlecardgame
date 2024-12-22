import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { IEventBus } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

import { BaseNodejsFunction } from '../../common/lambda.js';

export interface PlayGameFunctionProps {
  eventBus: IEventBus;
  table: ITable;
}

export class PlayGameFunction extends BaseNodejsFunction {
  constructor(scope: Construct, props: PlayGameFunctionProps) {
    const { eventBus, table } = props;

    super(scope, 'PlayGame', {
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
