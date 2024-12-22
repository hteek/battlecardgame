import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { BaseNodejsFunction } from '../../common/lambda.js';

export interface GetGameByIdFunctionProps {
  table: ITable;
}

export class GetGameByIdFunction extends BaseNodejsFunction {
  constructor(scope: Construct, props: GetGameByIdFunctionProps) {
    const { table } = props;

    super(scope, 'GetGameById', {
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
