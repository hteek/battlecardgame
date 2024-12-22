import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { BaseNodejsFunction } from '../../common/lambda.js';

export interface ListEventsByGameIdFunctionProps {
  table: ITable;
}

export class ListEventsByGameIdFunction extends BaseNodejsFunction {
  constructor(scope: Construct, props: ListEventsByGameIdFunctionProps) {
    const { table } = props;

    super(scope, 'ListEventsByGameId', {
      dynamodb: {
        table,
      },
      nodejsFunctionProps: {
        environment: {
          POWERTOOLS_METRICS_NAMESPACE: 'Game',
        },
      },
    });
  }
}
