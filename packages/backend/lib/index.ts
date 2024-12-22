import { CfnOutput, Duration, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

import { GithubActionsIdentityProvider, GithubActionsRole } from 'aws-cdk-github-oidc';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { BaseStack } from './base/index.js';
import { Config } from './config.js';
import { FrontendDeploymentStack } from './frontend-deployment/index.js';

import { default as packageInfo } from '../package.json' assert { type: 'json' };
import { ApiStack } from './api/index.js';
import { AuthStack } from './auth/index.js';
import { NotificationApiStack, NotificationStack } from './notification/index.js';
import { AmplifyStack } from './amplify/index.js';
import { GameStack } from './game/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class BattleCardGameStack extends Stack {
  readonly authStack: AuthStack;

  constructor(scope: Construct, config: Config, stackProps?: StackProps) {
    const { projectId } = config;
    Tags.of(scope).add('Project', projectId);

    super(scope, projectId, stackProps);

    const { amplify, auth, domainName, environment, frontendDeployment, github, gitVersion, hostedZoneId, useSes } =
      config.values;

    const { certificate, eventBus, table } = new BaseStack(this, 'Base', {
      config: {
        domainName,
        hostedZoneId,
        useSes,
      },
      projectId,
    });

    const { callbackUrls, identityProviders, logoutUrls, selfSignUpEnabled } = auth ?? {};
    const { authGraphqlApi, userPool } = (this.authStack = new AuthStack(this, 'Auth', {
      config: {
        callbackUrls,
        certificate,
        domainName,
        hostedZoneId,
        identityProviders,
        logoutUrls,
        selfSignUpEnabled,
        table,
        useSes,
      },
      projectId,
    }));

    if (amplify) {
      const { branchName = 'main', monorepoAppRoot = 'packages/frontend' } = amplify ?? {};
      const { owner, repo } = github ?? {};
      const amplifyStack = new AmplifyStack(this, 'Amplify', {
        config: {
          certificate,
          branchName,
          domainName,
          hostedZoneId,
          monorepoAppRoot,
          repository: `${owner}/${repo}`,
        },
        projectId,
      });
      this.authStack.addDependency(amplifyStack);
    } else {
      const { source } = frontendDeployment ?? {};
      const frontendDeploymentStack = new FrontendDeploymentStack(this, 'FrontendDeployment', {
        config: {
          certificate,
          domainName,
          hostedZoneId,
          source: join(__dirname, '..', source ?? 'frontend'),
        },
      });
      this.authStack.addDependency(frontendDeploymentStack);
    }

    const { notificationGraphqlApi } = new NotificationApiStack(this, 'NotificationApi', {
      config: {
        table,
        userPool,
      },
      projectId,
    });

    const { gameGraphqlApi } = new GameStack(this, 'Game', {
      config: {
        eventBus,
        table,
        userPool,
      },
      projectId,
    });

    const { api, apiGraphqlUrl } = new ApiStack(this, 'Api', {
      config: {
        apiName: projectId,
        certificate,
        domainName,
        hostedZoneId,
        sourceApis: [authGraphqlApi, notificationGraphqlApi, gameGraphqlApi],
        userPool,
      },
    });

    new NotificationStack(this, 'Notification', {
      config: {
        api,
        apiGraphqlUrl,
        eventBus,
      },
      projectId,
    });

    if (environment) {
      new CfnOutput(this, 'environment', {
        value: environment,
      });
    }

    if (gitVersion) {
      new CfnOutput(this, 'gitVersion', {
        value: gitVersion,
      });
    }

    new CfnOutput(this, 'project', {
      value: projectId,
    });

    new CfnOutput(this, 'region', {
      value: Stack.of(this).region,
    });

    new CfnOutput(this, 'version', {
      value: packageInfo.version,
    });
  }
}

export class BattleCardGameGitHubOidcStack extends Stack {
  constructor(scope: Construct, public config: Config, stackProps?: StackProps) {
    const { projectId } = config;

    Tags.of(scope).add('Project', projectId);

    super(scope, `${projectId}-github-oidc`, stackProps);

    const { github } = config.values;
    const { owner, repo } = github ?? {};

    if (!owner || !repo) {
      throw new Error('GitHub owner and repo must be provided');
    }

    const provider = new GithubActionsIdentityProvider(this, 'GithubProvider');
    const deployRole = new GithubActionsRole(this, 'DeployRole', {
      provider,
      owner,
      repo,
      roleName: 'github-actions-role',
      description: `GitHub Actions CDK deploy role for ${projectId}`,
      maxSessionDuration: Duration.hours(1),
    });

    deployRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
  }
}
