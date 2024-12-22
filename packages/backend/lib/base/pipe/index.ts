import { IEventBus } from 'aws-cdk-lib/aws-events';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { Construct } from 'constructs';

import { BasePipeEnrichmentFunction } from './enrichmentFunction.js';
import { BasePipeRole } from './role.js';

export interface BasePipeProps {
  readonly eventBus: IEventBus;
  readonly table: ITable;
  readonly pipeName: string;
}

export class BasePipe extends CfnPipe {
  constructor(scope: Construct, props: BasePipeProps) {
    const {
      eventBus: { eventBusArn },
      table: { tableArn, tableStreamArn },
      pipeName,
    } = props;

    if (!tableStreamArn) {
      throw new Error(`no stream found for table: ${tableArn}`);
    }

    const { functionArn } = new BasePipeEnrichmentFunction(scope);
    const { roleArn } = new BasePipeRole(scope, { eventBusArn, functionArn, pipeName, tableStreamArn });

    super(scope, 'BasePipe', {
      enrichment: functionArn,
      name: pipeName,
      source: tableStreamArn,
      sourceParameters: {
        dynamoDbStreamParameters: {
          batchSize: 10,
          maximumBatchingWindowInSeconds: 3,
          startingPosition: 'TRIM_HORIZON',
        },
      },
      roleArn,
      target: eventBusArn,
      targetParameters: {
        eventBridgeEventBusParameters: {
          detailType: 'dynamodb-stream-pipe',
          resources: [tableArn],
          source: 'aws-dynamodb-stream-eventbridge-fanout',
        },
      },
    });
  }
}
