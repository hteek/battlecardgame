import { CfnApp } from 'aws-cdk-lib/aws-amplify';
import { Construct } from 'constructs';

export interface AmplifyAppProps {
  readonly accessToken: string;
  readonly name: string;
  readonly iamServiceRole: string;
  readonly monorepoAppRoot: string;
  readonly repository: string;
}

export class App extends CfnApp {
  constructor(scope: Construct, props: AmplifyAppProps) {
    const { accessToken, iamServiceRole, name, monorepoAppRoot, repository } = props;
    super(scope, 'AmplifyApp', {
      accessToken,
      environmentVariables: [
        { name: 'AMPLIFY_DIFF_DEPLOY', value: 'false' },
        { name: 'AMPLIFY_MONOREPO_APP_ROOT', value: monorepoAppRoot },
        { name: 'NUXT_UI_PRO_LICENSE', value: process.env['NUXT_UI_PRO_LICENSE'] ?? '' },
      ],
      name,
      platform: 'WEB_COMPUTE',
      repository: `https://github.com/${repository}`,
      iamServiceRole,
    });
  }
}
