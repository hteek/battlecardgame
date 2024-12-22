import { CfnUserPoolDomain } from 'aws-cdk-lib/aws-cognito';
import { AliasRecordTargetConfig, IAliasRecordTarget, IHostedZone, IRecordSet } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';

/**
 * Use a user pool domain as an alias record target
 */
export class CfnUserPoolDomainTarget implements IAliasRecordTarget {
  constructor(private readonly cfnUserPoolDomain: CfnUserPoolDomain) {}

  public bind(_record: IRecordSet, _zone?: IHostedZone): AliasRecordTargetConfig {
    return {
      dnsName: this.cfnUserPoolDomain.attrCloudFrontDistribution,
      hostedZoneId: CloudFrontTarget.getHostedZoneId(this.cfnUserPoolDomain),
    };
  }
}
