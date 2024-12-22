import { Stack } from 'aws-cdk-lib';
import { Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';

import { Construct } from 'constructs';

import { BaseNodejsFunction } from '../../common/index.js';

export interface AccountConfirmationFunctionProps {
  appId: string;
  branchName: string;
  parentStack: Construct;
}

export class DeployFunction extends BaseNodejsFunction {
  constructor(scope: Construct, props: AccountConfirmationFunctionProps) {
    const { appId, branchName, parentStack } = props;

    super(scope, 'Deploy', {
      nodejsFunctionProps: {
        environment: {
          APP_ID: appId,
          BRANCH_NAME: branchName,
          POWERTOOLS_METRICS_NAMESPACE: 'Amplify',
        },
      },
    });

    this.role?.attachInlinePolicy(
      new Policy(this, 'AmplifyDeployPolicy', {
        statements: [
          new PolicyStatement({
            sid: 'StartJob',
            actions: ['amplify:StartJob'],
            effect: Effect.ALLOW,
            resources: [
              `arn:aws:amplify:${Stack.of(this).region}:${
                Stack.of(this).account
              }:apps/${appId}/branches/${branchName}/jobs/*`,
            ],
          }),
        ],
      }),
    );

    new Rule(this, 'AmplifyDeployTriggerRule', {
      enabled: true,
      description: 'Rule to trigger Amplify deploy',
      eventPattern: {
        detail: {
          'status-details': {
            status: ['CREATE_COMPLETE', 'UPDATE_COMPLETE'],
          },
          'stack-id': [Stack.of(parentStack).stackId],
        },
        detailType: ['CloudFormation Stack Status Change'],
        resources: [Stack.of(parentStack).stackId],
        source: ['aws.cloudformation'],
      },
    }).addTarget(new LambdaFunction(this));
  }
}
