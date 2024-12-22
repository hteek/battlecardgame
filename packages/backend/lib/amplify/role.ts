import { Effect, ManagedPolicy, Policy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class AmplifyLoggingRole extends Role {
  constructor(scope: Construct) {
    super(scope, 'AmplifyRole', {
      assumedBy: new ServicePrincipal('amplify.amazonaws.com'),
    });
    this.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('service-role/AmplifyBackendDeployFullAccess'));
    this.attachInlinePolicy(
      new Policy(this, 'AmplifyRolePolicy', {
        statements: [
          new PolicyStatement({
            actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
            effect: Effect.ALLOW,
            resources: [
              `arn:aws:logs:${Stack.of(this).region}:${Stack.of(this).account}:log-group:/aws/amplify/*:log-stream:*`,
            ],
            sid: 'PushLogs',
          }),
          new PolicyStatement({
            actions: ['logs:CreateLogGroup'],
            effect: Effect.ALLOW,
            resources: [`arn:aws:logs:${Stack.of(this).region}:${Stack.of(this).account}:log-group:/aws/amplify/*`],
            sid: 'CreateLogGroup',
          }),
          new PolicyStatement({
            actions: ['logs:DescribeLogGroups'],
            effect: Effect.ALLOW,
            resources: [`arn:aws:logs:${Stack.of(this).region}:${Stack.of(this).account}:log-group:*`],
            sid: 'DescribeLogGroups',
          }),
        ],
      }),
    );
  }
}
