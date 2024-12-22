import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { BaseNodejsFunction } from '../../common/lambda.js';

export interface ListGamesFunctionProps {
  table: ITable;
}

export class ListGamesFunction extends BaseNodejsFunction {
  constructor(scope: Construct, props: ListGamesFunctionProps) {
    const { table } = props;

    super(scope, 'ListGames', {
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
