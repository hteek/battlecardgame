import { CfnOutput, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { CnameRecord, HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

import { BattleCardGameGraphqlApi, BattleCardGameMergedGraphqlApi } from './api.js';

export * from './api.js';

/**
 * Configuration options for {@linkcode AuthStack}.
 */
export interface ApiConfig {
  readonly apiName: string;
  readonly certificate: ICertificate;
  readonly domainName: string;
  readonly hostedZoneId: string;
  readonly sourceApis: BattleCardGameGraphqlApi[];
  readonly userPool: IUserPool;
}

export interface ApiStackProps extends NestedStackProps {
  readonly config: ApiConfig;
}

export class ApiStack extends NestedStack {
  public readonly api: BattleCardGameMergedGraphqlApi;
  public readonly apiGraphqlUrl: string;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { apiName: name, certificate, domainName, hostedZoneId, sourceApis, userPool } = props.config;

    const {
      customAppSyncDomainName: { attrAppSyncDomainName: apiAppSyncDomainName, domainName: apiDomainName },
    } = (this.api = new BattleCardGameMergedGraphqlApi(this, 'MergedGraphqlApi', {
      certificate,
      domainName,
      name,
      sourceApis,
      userPool,
    }));

    this.apiGraphqlUrl = `https://${apiDomainName}/graphql`;

    const zone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId,
      zoneName: domainName,
    });

    new CnameRecord(this, `CnameRecord`, {
      domainName: apiAppSyncDomainName,
      recordName: 'api',
      zone,
    });

    new CfnOutput(scope, 'graphqlEndpoint', {
      value: this.apiGraphqlUrl,
    });
  }
}
