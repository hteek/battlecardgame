import { CfnUserPoolDomain } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export interface ManagedUserPoolDomainProps {
  readonly certificateArn: string;
  readonly domain: string;
  readonly userPoolId: string;
}

export class ManagedUserPoolDomain extends CfnUserPoolDomain {
  constructor(scope: Construct, props: ManagedUserPoolDomainProps) {
    const { certificateArn, domain, userPoolId } = props;
    super(scope, 'ManagedUserPoolCustomDomain', {
      customDomainConfig: {
        certificateArn,
      },
      domain,
      managedLoginVersion: 2,
      userPoolId,
    });
  }
}
