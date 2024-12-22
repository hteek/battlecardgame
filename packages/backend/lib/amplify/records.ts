import { IDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { ARecord, AaaaRecord, RecordTarget, IHostedZone } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

export interface RecordsProps {
  readonly distribution: IDistribution;
  readonly domainName: string;
  readonly hostedZone: IHostedZone;
}

export class Records {
  public readonly aRecord: ARecord;
  public readonly aaaaRecord: AaaaRecord;

  constructor(scope: Construct, props: RecordsProps) {
    const { distribution, domainName, hostedZone: zone } = props;

    this.aRecord = new ARecord(scope, 'ConfigARecord', {
      recordName: domainName,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone,
    });

    this.aaaaRecord = new AaaaRecord(scope, 'ConfigAaaaRecord', {
      recordName: domainName,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone,
    });
  }
}
