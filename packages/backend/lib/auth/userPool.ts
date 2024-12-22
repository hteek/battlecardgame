import { Duration, SecretValue, Stack } from 'aws-cdk-lib';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
  AccountRecovery,
  FeaturePlan,
  LambdaVersion,
  Mfa,
  OAuthScope,
  ProviderAttribute,
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
  UserPoolEmail,
  UserPoolIdentityProviderAmazon,
  UserPoolIdentityProviderFacebook,
  UserPoolIdentityProviderGoogle,
  UserPoolIdentityProviderOidc,
  UserPoolIdentityProviderSaml,
  UserPoolIdentityProviderSamlMetadata,
  UserPoolOperation,
  VerificationEmailStyle,
} from 'aws-cdk-lib/aws-cognito';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

import { forEach, isArray } from 'remeda';

import { toUpperSnakeCase } from '../common/index.js';

import { PreTokenGenerationFunction } from './functions/index.js';

export interface AuthUserPoolIdentityProviderAmazonConfig {
  readonly clientId: string;
}

export interface AuthUserPoolIdentityProviderGoogleConfig {
  readonly clientId: string;
}

export interface AuthUserPoolIdentityProviderFacebookConfig {
  readonly clientId: string;
  readonly apiVersion?: string;
}

export interface AuthUserPoolIdentityProviderSamlConfig {
  readonly idpInitiated?: boolean;
  readonly idpSignout?: boolean;
  readonly metadataUrl: string;
  readonly providerName: string;
}

export interface AuthUserPoolIdentityProviderOidcConfig {
  readonly clientId: string;
  readonly issuerUrl: string;
  readonly providerName: string;
}

export interface AuthUserPoolIdentityProviderConfig {
  readonly amazon?: AuthUserPoolIdentityProviderAmazonConfig;
  readonly facebook?: AuthUserPoolIdentityProviderFacebookConfig;
  readonly google?: AuthUserPoolIdentityProviderGoogleConfig;
  readonly oidc?: AuthUserPoolIdentityProviderOidcConfig[];
  readonly saml?: AuthUserPoolIdentityProviderSamlConfig[];
}

export interface AuthUserPoolProps {
  readonly callbackUrls?: string[];
  readonly certificate: ICertificate;
  readonly domainName: string;
  readonly identityProviders?: AuthUserPoolIdentityProviderConfig;
  readonly logoutUrls?: string[];
  readonly selfSignUpEnabled?: boolean;
  readonly table: ITable;
  readonly userPoolName: string;
  readonly useSes?: boolean;
}

export class AuthUserPool extends UserPool {
  public readonly preTokenGenerationFunction: IFunction;
  public readonly userPoolClient: UserPoolClient;

  private readonly userPoolIdentityProviders: Construct[] = [];

  constructor(scope: Construct, props: AuthUserPoolProps) {
    const {
      callbackUrls = [],
      domainName,
      identityProviders,
      logoutUrls = [],
      selfSignUpEnabled,
      table,
      userPoolName,
      useSes = false,
    } = props;
    super(scope, 'AuthUserPool', {
      autoVerify: {
        email: true,
      },
      ...(useSes
        ? {
            email: UserPoolEmail.withSES({
              sesRegion: Stack.of(scope).region,
              fromEmail: `no-reply@${domainName}`,
              sesVerifiedDomain: `${domainName}`,
            }),
          }
        : {}),
      featurePlan: FeaturePlan.ESSENTIALS,
      mfa: Mfa.OPTIONAL,
      mfaSecondFactor: {
        otp: true,
        sms: true,
      },
      passwordPolicy: {
        minLength: 12,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
        tempPasswordValidity: Duration.days(3),
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      selfSignUpEnabled,
      signInAliases: {
        email: true,
      },
      signInCaseSensitive: false,
      userPoolName,
      userVerification: {
        emailStyle: VerificationEmailStyle.CODE,
      },
    });

    const supportedIdentityProviders = identityProviders
      ? this.addIdentityProviders(identityProviders)
      : [UserPoolClientIdentityProvider.COGNITO];

    const domainUrls = [`https://${domainName}`];

    this.userPoolClient = this.addClient('AuthUserPoolClient', {
      authFlows: {
        userSrp: true,
      },
      supportedIdentityProviders,
      oAuth: {
        callbackUrls: [...domainUrls, ...callbackUrls],
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: false,
        },
        logoutUrls: [...domainUrls, ...logoutUrls],
        scopes: [OAuthScope.EMAIL, OAuthScope.PROFILE],
      },
      preventUserExistenceErrors: true,
      userPoolClientName: `${userPoolName}-client`,
    });

    this.userPoolIdentityProviders.forEach((provider) => this.userPoolClient.node.addDependency(provider));

    this.preTokenGenerationFunction = new PreTokenGenerationFunction(this, { table });
    this.addTrigger(UserPoolOperation.PRE_TOKEN_GENERATION_CONFIG, this.preTokenGenerationFunction, LambdaVersion.V2_0);
  }

  private addIdentityProviders(
    identityProviders: AuthUserPoolIdentityProviderConfig,
  ): UserPoolClientIdentityProvider[] {
    const result: UserPoolClientIdentityProvider[] = [UserPoolClientIdentityProvider.COGNITO];

    const { amazon, facebook, google, oidc, saml } = identityProviders;

    if (amazon) {
      const { clientId } = amazon;
      this.userPoolIdentityProviders.push(
        new UserPoolIdentityProviderAmazon(this, 'Amazon', {
          attributeMapping: {
            email: ProviderAttribute.AMAZON_EMAIL,
            fullname: ProviderAttribute.AMAZON_NAME,
          },
          clientId,
          clientSecret: process.env['AMAZON_CLIENT_SECRET'] ?? '',
          scopes: ['profile'],
          userPool: this,
        }),
      );
      result.push(UserPoolClientIdentityProvider.AMAZON);
    }

    if (facebook) {
      const { apiVersion, clientId } = facebook;
      this.userPoolIdentityProviders.push(
        new UserPoolIdentityProviderFacebook(this, 'Facebook', {
          attributeMapping: {
            email: ProviderAttribute.FACEBOOK_EMAIL,
            familyName: ProviderAttribute.FACEBOOK_LAST_NAME,
            givenName: ProviderAttribute.FACEBOOK_FIRST_NAME,
          },
          ...(apiVersion ? { apiVersion } : {}),
          clientId,
          clientSecret: process.env['FACEBOOK_CLIENT_SECRET'] ?? '',
          scopes: ['public_profile', 'email'],
          userPool: this,
        }),
      );
      result.push(UserPoolClientIdentityProvider.FACEBOOK);
    }

    if (google) {
      const { clientId } = google;
      this.userPoolIdentityProviders.push(
        new UserPoolIdentityProviderGoogle(this, 'Google', {
          attributeMapping: {
            email: ProviderAttribute.GOOGLE_EMAIL,
            emailVerified: ProviderAttribute.GOOGLE_EMAIL_VERIFIED,
            familyName: ProviderAttribute.GOOGLE_FAMILY_NAME,
            givenName: ProviderAttribute.GOOGLE_GIVEN_NAME,
          },
          clientId,
          clientSecretValue: SecretValue.unsafePlainText(process.env['GOOGLE_CLIENT_SECRET'] ?? ''),
          scopes: ['profile', 'email'],
          userPool: this,
        }),
      );
      result.push(UserPoolClientIdentityProvider.custom('Google'));
    }

    if (oidc && isArray(oidc)) {
      forEach(oidc, (provider: AuthUserPoolIdentityProviderOidcConfig, index) => {
        const { clientId, issuerUrl, providerName } = provider;

        const idp = new UserPoolIdentityProviderOidc(this, `Oidc${index}`, {
          attributeMapping: {
            email: ProviderAttribute.other('email'),
            familyName: ProviderAttribute.other('family_name'),
            givenName: ProviderAttribute.other('given_name'),
          },
          clientId,
          clientSecret: process.env[toUpperSnakeCase(providerName) + '_CLIENT_SECRET'] ?? '',
          issuerUrl,
          name: providerName,
          scopes: ['email', 'openid', 'profile'],
          userPool: this,
        });

        this.userPoolIdentityProviders.push(idp);
        result.push(UserPoolClientIdentityProvider.custom(idp.providerName));
      });
    }

    if (saml && isArray(saml)) {
      forEach(saml, (provider: AuthUserPoolIdentityProviderSamlConfig, index) => {
        const { idpInitiated, idpSignout, metadataUrl, providerName } = provider;

        const idp = new UserPoolIdentityProviderSaml(this, `Saml${index}`, {
          attributeMapping: {
            email: ProviderAttribute.other('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'),
            familyName: ProviderAttribute.other('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'),
            givenName: ProviderAttribute.other('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'),
          },
          idpInitiated,
          idpSignout,
          metadata: UserPoolIdentityProviderSamlMetadata.url(metadataUrl),
          name: providerName,
          userPool: this,
        });

        this.userPoolIdentityProviders.push(idp);
        result.push(UserPoolClientIdentityProvider.custom(idp.providerName));
      });
    }

    return result;
  }
}
