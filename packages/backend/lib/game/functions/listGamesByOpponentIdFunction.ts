import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { BaseNodejsFunction } from '../../common/lambda.js';

export interface ListGamesByOpponentIdFunctionProps {
  table: ITable;
}

export class ListGamesByOpponentIdFunction extends BaseNodejsFunction {
  constructor(scope: Construct, props: ListGamesByOpponentIdFunctionProps) {
    const { table } = props;

    super(scope, 'ListGamesByOpponentId', {
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
