import { BaseNodejsFunction } from '../../common/lambda.js';

import { Construct } from 'constructs';

export class BasePipeEnrichmentFunction extends BaseNodejsFunction {
  constructor(scope: Construct) {
    super(scope, 'Enrichment', {
      nodejsFunctionProps: {
        environment: {
          POWERTOOLS_METRICS_NAMESPACE: 'Base',
        },
      },
    });
  }
}
