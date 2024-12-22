import { CfnIdentityPoolRoleAttachment } from 'aws-cdk-lib/aws-cognito';
import { Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { Stack } from 'aws-cdk-lib';

export interface AuthIdentityPoolRoleAttachmentProps {
  readonly authenticatedRole: Role;
  readonly clientId: string;
  readonly identityPoolId: string;
  readonly unauthenticatedRole: Role;
  readonly userPoolId: string;
}

export class AuthIdentityPoolRoleAttachment extends CfnIdentityPoolRoleAttachment {
  constructor(scope: Construct, props: AuthIdentityPoolRoleAttachmentProps) {
    const { authenticatedRole, clientId, identityPoolId, unauthenticatedRole, userPoolId } = props;

    super(scope, 'AuthRoleAttachment', {
      identityPoolId,
      roles: {
        unauthenticated: unauthenticatedRole.roleArn,
        authenticated: authenticatedRole.roleArn,
      },
      roleMappings: {
        default: {
          ambiguousRoleResolution: 'AuthenticatedRole',
          identityProvider: `cognito-idp.${Stack.of(scope).region}.amazonaws.com/${userPoolId}:${clientId}`,
          type: 'Token',
        },
      },
    });
  }
}
