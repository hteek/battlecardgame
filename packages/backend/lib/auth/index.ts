import { CfnOutput, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { AaaaRecord, ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

import { addApi } from './api/index.js';
import { CurrentUserFunction } from './functions/index.js';
import { AuthIdentityPool } from './identityPool.js';
import { ManagedLoginBranding } from './managedLoginBranding.js';
import { AuthIdentityPoolRoles } from './roles.js';
import { AuthIdentityPoolRoleAttachment } from './roleAttachment.js';
import { AuthUserPool, AuthUserPoolIdentityProviderConfig } from './userPool.js';
import { ManagedUserPoolDomain } from './userPoolDomain.js';

import { BattleCardGameGraphqlApi } from '../api/index.js';
import { CfnUserPoolDomainTarget } from './cfnUserPoolDomainTarget.js';

export * from './userPool.js';

/**
 * Configuration options for {@linkcode AuthStack}.
 */
export interface AuthConfig {
  readonly callbackUrls?: string[];
  readonly certificate: ICertificate;
  readonly domainName: string;
  readonly hostedZoneId: string;
  readonly identityProviders?: AuthUserPoolIdentityProviderConfig;
  readonly logoutUrls?: string[];
  readonly selfSignUpEnabled?: boolean;
  readonly table: ITable;
  readonly useSes?: boolean;
}

/**
 * Wrapper for {@linkcode NestedStackProps} to provide additional attributes.
 */
export interface AuthStackProps extends NestedStackProps {
  /**
   * Configuration of the {@linkcode AuthStack}.
   */
  readonly config: AuthConfig;
  readonly projectId: string;
}

export class AuthStack extends NestedStack {
  public readonly authGraphqlApi: BattleCardGameGraphqlApi;
  public readonly userPool: UserPool;

  /**
   * @param scope The scope in which to define this construct.
   * @param id The scoped construct ID.
   * @param props The base stack properties.
   */
  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    const {
      callbackUrls,
      certificate,
      domainName,
      hostedZoneId,
      identityProviders,
      logoutUrls,
      selfSignUpEnabled,
      table,
      useSes,
    } = props.config;
    const { projectId } = props;

    const {
      userPoolClient: { userPoolClientId },
      userPoolId,
      userPoolProviderName,
    } = (this.userPool = new AuthUserPool(this, {
      callbackUrls,
      certificate,
      domainName,
      identityProviders,
      logoutUrls,
      selfSignUpEnabled,
      table,
      userPoolName: projectId,
      useSes,
    }));

    new ManagedLoginBranding(this, {
      clientId: userPoolClientId,
      userPoolId,
    });

    const domain = `id.${domainName}`;

    const userPoolDomain = new ManagedUserPoolDomain(this, {
      certificateArn: certificate.certificateArn,
      domain,
      userPoolId,
    });

    const identityPool = new AuthIdentityPool(this, {
      clientId: userPoolClientId,
      identityPoolName: projectId,
      providerName: userPoolProviderName,
    });

    const { ref: identityPoolId } = identityPool;
    const { authenticatedRole, unauthenticatedRole } = new AuthIdentityPoolRoles(this, {
      clientId: userPoolClientId,
      identityPoolId,
      userPoolId,
    });

    new AuthIdentityPoolRoleAttachment(this, {
      authenticatedRole,
      clientId: userPoolClientId,
      identityPoolId,
      unauthenticatedRole,
      userPoolId,
    });

    const currentUserFunction = new CurrentUserFunction(this, { table });

    const zone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId,
      zoneName: domainName,
    });

    new ARecord(this, 'ARecord', {
      recordName: 'id',
      target: RecordTarget.fromAlias(new CfnUserPoolDomainTarget(userPoolDomain)),
      zone,
    });

    new AaaaRecord(this, 'AaaaRecord', {
      recordName: 'id',
      target: RecordTarget.fromAlias(new CfnUserPoolDomainTarget(userPoolDomain)),
      zone,
    });

    this.authGraphqlApi = addApi(this, {
      name: `${projectId}-auth`,
      userFunctions: {
        currentUserFunction,
      },
      userPool: this.userPool,
    });

    if (identityProviders) {
      const custom: string[] = [];
      const { oidc, saml } = identityProviders;
      (oidc ?? []).map((value) => custom.push(value.providerName));
      (saml ?? []).map((value) => custom.push(value.providerName));

      const social = Object.keys(identityProviders).filter((provider) => provider !== 'saml' && provider !== 'oidc');

      new CfnOutput(scope, 'identityProviders', {
        value: JSON.stringify({ custom, social }),
      });
    }

    new CfnOutput(scope, 'identityPoolId', {
      value: identityPool.ref,
    });

    new CfnOutput(scope, 'userPoolDomainName', {
      value: userPoolDomain.domain,
    });

    new CfnOutput(scope, 'userPoolId', {
      value: this.userPool.userPoolId,
    });

    new CfnOutput(scope, 'userPoolWebClientId', {
      value: userPoolClientId,
    });
  }
}
