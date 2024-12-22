import { CfnOutput, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { IDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { IBucket } from 'aws-cdk-lib/aws-s3';
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
  public readonly bucket: IBucket;
  public readonly distribution: IDistribution;

  constructor(scope: Construct, id: string, props: FrontendDeploymentStackProps) {
    super(scope, id, props);

    const { certificate, domainName, hostedZoneId, source } = props.config;

    this.bucket = new FrontendBucket(this, 'Bucket');

    this.distribution = new ClientSideRenderingDistribution(this, {
      bucket: this.bucket,
      certificate,
      domainName,
    });

    new FrontendBucketDeployment(this, {
      destinationBucket: this.bucket,
      distribution: this.distribution,
      source: joinPaths(source, 'public'),
    });

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId,
      zoneName: domainName,
    });

    new Records(this, {
      distribution: this.distribution,
      domainName,
      hostedZone,
    });

    new CfnOutput(this, 'distributionDomainName', {
      value: domainName,
    });
  }
}
