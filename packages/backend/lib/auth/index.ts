import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { CfnIdentityPool, UserPool, UserPoolDomain } from 'aws-cdk-lib/aws-cognito';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Role } from 'aws-cdk-lib/aws-iam';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { AaaaRecord, ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { UserPoolDomainTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

import { addApi } from './api/index.js';
import { CurrentUserFunction } from './functions/index.js';
import { AuthIdentityPool } from './identityPool.js';
import { AuthIdentityPoolRoles } from './roles.js';
import { AuthIdentityPoolRoleAttachment } from './roleAttachment.js';
import { AuthUserPool, AuthUserPoolIdentityProviderConfig } from './userPool.js';
import { BattleCardGameGraphqlApi } from '../api/index.js';

export * from './userPool.js';

/**
 * Configuration options for {@linkcode AuthStack}.
 */
export interface AuthConfig {
  readonly callbackUrls?: string[];
  readonly certificate: ICertificate;
  readonly domainName: string;
  readonly hostedZoneId: string;
  /** Configuration options for identity provider {@linkcode AuthIdentityProviderConfig}. */
  readonly identityProviders?: AuthUserPoolIdentityProviderConfig;
  readonly logoutUrls?: string[];
  readonly selfSignUpEnabled?: boolean;
  readonly table: ITable;
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

  public readonly currentUserFunction: IFunction;

  public readonly identityPool: CfnIdentityPool;
  public readonly userPoolWebClientId: string;
  public readonly userPool: UserPool;
  public readonly userPoolDomain: UserPoolDomain;

  public readonly unauthenticatedRole: Role;

  /**
   * @param scope The scope in which to define this construct.
   * @param id The scoped construct ID.
   * @param props The base stack properties.
   */
  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    const { callbackUrls, certificate, domainName, hostedZoneId, identityProviders, logoutUrls, table } = props.config;
    const { projectId } = props;

    const {
      userPoolClient: { userPoolClientId },
      userPoolDomain,
      userPoolId,
      userPoolProviderName,
    } = (this.userPool = new AuthUserPool(this, {
      callbackUrls,
      certificate,
      domainName,
      identityProviders,
      logoutUrls,
      table,
      userPoolName: projectId,
    }));
    this.userPoolWebClientId = userPoolClientId;
    this.userPoolDomain = userPoolDomain;

    const { ref: identityPoolId } = (this.identityPool = new AuthIdentityPool(this, {
      clientId: userPoolClientId,
      identityPoolName: projectId,
      providerName: userPoolProviderName,
    }));

    const { authenticatedRole, unauthenticatedRole } = new AuthIdentityPoolRoles(this, {
      clientId: userPoolClientId,
      identityPoolId,
      userPoolId,
    });
    this.unauthenticatedRole = unauthenticatedRole;

    new AuthIdentityPoolRoleAttachment(this, {
      authenticatedRole,
      clientId: userPoolClientId,
      identityPoolId,
      unauthenticatedRole,
      userPoolId,
    });

    this.currentUserFunction = new CurrentUserFunction(this, { table });

    const zone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId,
      zoneName: domainName,
    });

    new ARecord(this, 'ARecord', {
      recordName: 'auth',
      target: RecordTarget.fromAlias(new UserPoolDomainTarget(userPoolDomain)),
      zone,
    });

    new AaaaRecord(this, 'AaaaRecord', {
      recordName: 'auth',
      target: RecordTarget.fromAlias(new UserPoolDomainTarget(userPoolDomain)),
      zone,
    });

    this.authGraphqlApi = addApi(this, {
      name: `${projectId}-auth`,
      userFunctions: {
        currentUserFunction: this.currentUserFunction,
      },
      userPool: this.userPool,
    });
  }
}
