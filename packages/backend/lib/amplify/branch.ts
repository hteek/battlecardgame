import { CfnBranch } from 'aws-cdk-lib/aws-amplify';
import { Construct } from 'constructs';

export interface InnovatorBranchProps {
  readonly appId: string;
  readonly branchName: string;
  readonly monorepoAppRoot: string;
}

export class Branch extends CfnBranch {
  constructor(scope: Construct, props: InnovatorBranchProps) {
    const { appId, branchName, monorepoAppRoot } = props;
    super(scope, 'AmplifyBranch', {
      appId,
      branchName,
      enableAutoBuild: false,
      environmentVariables: [
        { name: 'AMPLIFY_DIFF_DEPLOY', value: 'false' },
        { name: 'AMPLIFY_MONOREPO_APP_ROOT', value: monorepoAppRoot },
      ],
      framework: 'Web',
      stage: 'PRODUCTION',
    });
  }
}
