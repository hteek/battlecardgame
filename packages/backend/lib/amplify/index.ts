import { CfnOutput, NestedStack, NestedStackProps, SecretValue } from 'aws-cdk-lib';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

import { App } from './app.js';
import { Branch } from './branch.js';
import { ConfigBucket } from './bucket.js';
import { ConfigDistribution } from './distribution.js';
import { Domain } from './domain.js';
import { DeployFunction } from './functions/index.js';
import { Records } from './records.js';
import { AmplifyLoggingRole } from './role.js';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

export interface AmplifyConfig {
  readonly branchName: string;
  readonly certificate: ICertificate;
  readonly domainName: string;
  readonly hostedZoneId: string;
  readonly monorepoAppRoot: string;
  readonly repository: string;
}

export interface AmplifyStackProps extends NestedStackProps {
  readonly config: AmplifyConfig;
  readonly projectId: string;
}

export class AmplifyStack extends NestedStack {
  constructor(scope: Construct, id: string, props: AmplifyStackProps) {
    super(scope, id, props);

    const { branchName, certificate, domainName, hostedZoneId, monorepoAppRoot, repository } = props.config;
    const { projectId } = props;

    const { roleArn: iamServiceRole } = new AmplifyLoggingRole(this);

    const secret = new Secret(this, 'Secret', {
      secretName: `${projectId}/amplify/github-access-token`,
      secretStringValue: SecretValue.unsafePlainText(process.env['AMPLIFY_ACCESS_TOKEN'] ?? ''),
    });

    const { attrAppId: appId } = new App(this, {
      accessToken: secret.secretValue.unsafeUnwrap(),
      iamServiceRole,
      name: projectId,
      monorepoAppRoot,
      repository,
    });

    const branch = new Branch(this, {
      appId,
      branchName,
      monorepoAppRoot,
    });

    const domain = new Domain(this, {
      appId,
      branchName,
      certificate,
      domainName,
    });
    domain.addDependency(branch);

    new DeployFunction(this, { appId, branchName, parentStack: scope });

    const bucket = new ConfigBucket(this);

    const distribution = new ConfigDistribution(this, {
      bucket,
      certificate,
      domainName: `config.${domainName}`,
    });

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'FrontendDeploymentHostedZone', {
      hostedZoneId,
      zoneName: domainName,
    });

    new Records(this, {
      distribution,
      domainName: `config.${domainName}`,
      hostedZone,
    });

    new CfnOutput(scope, 'frontendBucketName', {
      value: bucket.bucketName,
    });

    new CfnOutput(scope, 'frontendDistributionId', {
      value: distribution.distributionId,
    });

    new CfnOutput(scope, 'frontendDomainName', {
      value: domainName,
    });
  }
}
