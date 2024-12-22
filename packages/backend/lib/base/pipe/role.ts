import { Stack } from 'aws-cdk-lib';
import { Effect, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface BasePipeRoleProps {
  readonly eventBusArn: string;
  readonly functionArn: string;
  readonly tableStreamArn: string;
  readonly pipeName: string;
}

export class BasePipeRole extends Role {
  constructor(scope: Construct, props: BasePipeRoleProps) {
    const { eventBusArn, functionArn, pipeName, tableStreamArn } = props;
    super(scope, 'BasePipeRole', {
      assumedBy: new ServicePrincipal('pipes.amazonaws.com', {
        conditions: {
          StringEquals: {
            'aws:SourceAccount': Stack.of(scope).account,
            'aws:SourceArn': `arn:aws:pipes:${Stack.of(scope).region}:${Stack.of(scope).account}:pipe/${pipeName}`,
          },
        },
      }),
    });

    this.addToPolicy(
      new PolicyStatement({
        actions: [
          'dynamodb:DescribeStream',
          'dynamodb:GetRecords',
          'dynamodb:GetShardIterator',
          'dynamodb:ListStreams',
        ],
        effect: Effect.ALLOW,
        resources: [tableStreamArn],
      }),
    );

    this.addToPolicy(
      new PolicyStatement({
        actions: ['lambda:InvokeFunction'],
        effect: Effect.ALLOW,
        resources: [functionArn],
      }),
    );

    this.addToPolicy(
      new PolicyStatement({
        actions: ['events:PutEvents'],
        effect: Effect.ALLOW,
        resources: [eventBusArn],
      }),
    );
  }
}
