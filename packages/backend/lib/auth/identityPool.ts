import { CfnIdentityPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export interface AuthIdentityPoolProps {
  readonly clientId: string;
  readonly identityPoolName: string;
  readonly providerName: string;
}

export class AuthIdentityPool extends CfnIdentityPool {
  constructor(scope: Construct, props: AuthIdentityPoolProps) {
    const { clientId, identityPoolName, providerName } = props;

    super(scope, 'AuthIdentityPool', {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId,
          providerName,
          serverSideTokenCheck: true,
        },
      ],
      identityPoolName,
    });
  }
}
