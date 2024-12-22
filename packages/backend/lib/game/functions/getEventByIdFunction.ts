import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { BaseNodejsFunction } from '../../common/lambda.js';

export interface GetEventByIdFunctionProps {
  table: ITable;
}

export class GetEventByIdFunction extends BaseNodejsFunction {
  constructor(scope: Construct, props: GetEventByIdFunctionProps) {
    const { table } = props;

    super(scope, 'GetEventById', {
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
