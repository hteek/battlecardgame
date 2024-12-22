import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { BaseNodejsFunction } from '../../common/lambda.js';

export interface CurrentUserFunctionProperties {
  table: ITable;
}

export class CurrentUserFunction extends BaseNodejsFunction {
  constructor(scope: Construct, props: CurrentUserFunctionProperties) {
    const { table } = props;

    super(scope, 'CurrentUser', {
      dynamodb: {
        table,
      },
      nodejsFunctionProps: {
        environment: {
          POWERTOOLS_METRICS_NAMESPACE: 'Auth',
        },
      },
    });
  }
}
