import { CfnOutput, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

import { join as joinPaths } from 'path';

import { FrontendBucket } from './bucket.js';
import { FrontendBucketDeployment } from './deployment.js';
import { ClientSideRenderingDistribution } from './distribution.js';
import { Records } from './records.js';

export interface FrontendDeploymentConfig {
  readonly certificate: ICertificate;
  readonly domainName: string;
  readonly hostedZoneId: string;
  readonly source: string;
}

export interface FrontendDeploymentStackProps extends NestedStackProps {
  readonly config: FrontendDeploymentConfig;
}

export class FrontendDeploymentStack extends NestedStack {
  constructor(scope: Construct, id: string, props: FrontendDeploymentStackProps) {
    super(scope, id, props);

    const { certificate, domainName, hostedZoneId, source } = props.config;

    const bucket = new FrontendBucket(this, 'Bucket');

    const distribution = new ClientSideRenderingDistribution(this, {
      bucket,
      certificate,
      domainName,
    });

    new FrontendBucketDeployment(this, {
      destinationBucket: bucket,
      distribution,
      source: joinPaths(source, 'public'),
    });

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId,
      zoneName: domainName,
    });

    new Records(this, {
      distribution,
      domainName,
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
