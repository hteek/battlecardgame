import { Effect, PolicyStatement, Role, WebIdentityPrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface AuthIdentityPoolRolesProps {
  readonly clientId: string;
  readonly identityPoolId: string;
  readonly userPoolId: string;
}

export class AuthIdentityPoolRoles {
  public readonly authenticatedRole: Role;
  public readonly unauthenticatedRole: Role;

  constructor(scope: Construct, props: AuthIdentityPoolRolesProps) {
    const { identityPoolId } = props;
    const identityProvider = 'cognito-identity.amazonaws.com';

    this.unauthenticatedRole = new Role(scope, 'CognitoDefaultUnauthenticatedRole', {
      assumedBy: new WebIdentityPrincipal(identityProvider, {
        StringEquals: { 'cognito-identity.amazonaws.com:aud': identityPoolId },
        'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'unauthenticated' },
      }),
    });
    this.unauthenticatedRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['mobileanalytics:PutEvents', 'cognito-sync:*'],
        resources: ['*'],
      }),
    );

    this.authenticatedRole = new Role(scope, 'CognitoDefaultAuthenticatedRole', {
      assumedBy: new WebIdentityPrincipal(identityProvider, {
        StringEquals: { 'cognito-identity.amazonaws.com:aud': identityPoolId },
        'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'authenticated' },
      }),
    });
    this.authenticatedRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['mobileanalytics:PutEvents', 'cognito-sync:*', 'cognito-identity:*'],
        resources: ['*'],
      }),
    );
  }
}
