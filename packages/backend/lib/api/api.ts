import {
  AuthorizationType,
  CfnDomainName,
  CfnDomainNameApiAssociation,
  Definition,
  FieldLogLevel,
  GraphqlApi,
  MergeType,
  UserPoolDefaultAction,
  Visibility,
} from 'aws-cdk-lib/aws-appsync';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export interface BattleCardGameBaseGraphqlApiProps {
  definition: Definition;
  name: string;
  userPool: IUserPool;
  visibility?: Visibility;
}

export abstract class BattleCardGameBaseGraphqlApi extends GraphqlApi {
  constructor(scope: Construct, id: string, props: BattleCardGameBaseGraphqlApiProps) {
    const { definition, name, visibility, userPool } = props;
    super(scope, id, {
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
            defaultAction: UserPoolDefaultAction.ALLOW,
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: AuthorizationType.IAM,
          },
        ],
      },
      definition,
      logConfig: {
        fieldLogLevel: FieldLogLevel.NONE,
        excludeVerboseContent: false,
      },
      name,
      ...(visibility ? { visibility } : { visibility: Visibility.GLOBAL }),
      xrayEnabled: true,
    });
  }
}

export interface BattleCardGameGraphqlApiProps {
  definition: Definition;
  name: string;
  userPool: IUserPool;
}

export class BattleCardGameGraphqlApi extends BattleCardGameBaseGraphqlApi {
  constructor(scope: Construct, id: string, props: BattleCardGameGraphqlApiProps) {
    const { definition, name, userPool } = props;
    super(scope, id, { definition, name, userPool, visibility: Visibility.PRIVATE });
  }
}

export interface BattleCardGameMergedGraphqlApiProps {
  certificate: ICertificate;
  domainName: string;
  name: string;
  sourceApis: BattleCardGameGraphqlApi[];
  userPool: IUserPool;
}

export class BattleCardGameMergedGraphqlApi extends BattleCardGameBaseGraphqlApi {
  public readonly customAppSyncDomainName: CfnDomainName;

  readonly userPool: IUserPool;

  constructor(scope: Construct, id: string, props: BattleCardGameMergedGraphqlApiProps) {
    const { certificate, domainName, name, sourceApis, userPool } = props;
    super(scope, id, {
      name,
      userPool,
      definition: Definition.fromSourceApis({
        sourceApis: sourceApis.map((sourceApi) => ({ sourceApi, mergeType: MergeType.AUTO_MERGE })),
      }),
    });

    this.userPool = userPool;

    this.customAppSyncDomainName = new CfnDomainName(scope, 'DomainName', {
      certificateArn: certificate.certificateArn,
      domainName: `api.${domainName}`,
    });

    const assoc = new CfnDomainNameApiAssociation(scope, 'DomainNameApiAssociation', {
      apiId: this.apiId,
      domainName: `api.${domainName}`,
    });
    assoc.addDependency(this.customAppSyncDomainName);
  }
}
