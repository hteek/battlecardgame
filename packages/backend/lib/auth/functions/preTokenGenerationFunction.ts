import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { BaseNodejsFunction } from '../../common/lambda.js';

export interface PreTokenGenerationFunctionProperties {
  table: ITable;
}

export class PreTokenGenerationFunction extends BaseNodejsFunction {
  constructor(scope: Construct, props: PreTokenGenerationFunctionProperties) {
    const { table } = props;

    super(scope, 'PreTokenGeneration', {
      dynamodb: {
        table,
        grantWriteData: true,
      },
      nodejsFunctionProps: {
        environment: {
          POWERTOOLS_METRICS_NAMESPACE: 'Auth',
        },
      },
    });
  }
}
