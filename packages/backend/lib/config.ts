import { ConfigLayerMeta, loadConfig, ResolvedConfig } from 'c12';
import { merge } from 'remeda';

import { capitalize, toCamelCase, toKebabCase } from './common/index.js';

export interface IBattleCardGameConfig {
  readonly amplify?: {
    readonly branchName: string;
    readonly monorepoAppRoot: string;
  };
  readonly auth: {
    readonly callbackUrls?: string[];
    readonly identityProviders?: {
      readonly amazon?: {
        readonly clientId: string;
        readonly clientSecret: string;
      };
      readonly facebook?: {
        readonly clientId: string;
        readonly clientSecret: string;
        readonly apiVersion?: string;
      };
      readonly google?: {
        readonly clientId: string;
        readonly clientSecret: string;
      };
      readonly oidc?: {
        readonly clientId: string;
        readonly issuerUrl: string;
        readonly providerName: string;
      }[];
      readonly saml?: {
        readonly idpInitiated?: boolean;
        readonly idpSignout?: boolean;
        readonly metadataUrl: string;
        readonly providerName: string;
      }[];
    };
    readonly logoutUrls?: string[];
    readonly selfSignUpEnabled?: boolean;
  };
  readonly domainName: string;
  readonly environment?: string;
  readonly frontendDeployment?: {
    readonly source: string;
  };
  readonly github?: {
    readonly owner: string;
    readonly repo: string;
  };
  readonly gitVersion?: string;
  readonly hostedZoneId: string;
  readonly project: string;
  readonly useSes?: boolean;
}

export class Config<T extends IBattleCardGameConfig = IBattleCardGameConfig> {
  readonly values: T;

  constructor(resolvedConfig: ResolvedConfig<T, ConfigLayerMeta>) {
    const { config } = resolvedConfig;

    if (config === null || Object.keys(config).length === 0) {
      throw new Error('No config found');
    }

    this.values = config;

    const environment = process.env['ENVIRONMENT'];
    if (environment) {
      this.values = merge(this.values, { environment }) as T;
    }

    const gitVersion = process.env['GIT_VERSION'];
    if (gitVersion) {
      this.values = merge(this.values, { gitVersion }) as T;
    }

    console.log(this.kebabCase(), JSON.stringify(this.values, null, 2));
  }

  static readonly parseConfig = async <U extends IBattleCardGameConfig = IBattleCardGameConfig>(
    configPath: string,
  ): Promise<Config<U>> =>
    new Config<U>(
      await loadConfig<U>({
        cwd: configPath,
        configFile: process.env['ENVIRONMENT'] ?? 'default',
      }),
    );

  camelCase(value?: string): string {
    const { environment, project } = this.values;
    return `${capitalize(toCamelCase(project))}${capitalize(toCamelCase(value))}${capitalize(
      toCamelCase(environment),
    )}`;
  }

  kebabCase(value?: string): string {
    const { environment, project } = this.values;
    return `${toKebabCase(project)}${value ? '-' + toKebabCase(value) : ''}${
      environment ? '-' + toKebabCase(environment) : ''
    }`;
  }

  get stackId(): string {
    return this.camelCase();
  }

  get projectId(): string {
    return this.kebabCase();
  }
}
