import { CfnManagedLoginBranding } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export interface ManagedLoginBrandingProps {
  readonly clientId: string;
  readonly userPoolId: string;
}

export class ManagedLoginBranding extends CfnManagedLoginBranding {
  constructor(scope: Construct, props: ManagedLoginBrandingProps) {
    const { clientId, userPoolId } = props;
    super(scope, 'ManagedLoginBranding', {
      clientId,
      userPoolId,
      useCognitoProvidedValues: true,
    });
  }
}
