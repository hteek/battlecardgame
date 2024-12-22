import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';

import { AmplifyStack } from '../../lib/amplify/index.js';

expect.addSnapshotSerializer({
  test: (val) => typeof val === 'string',
  print: (val) => `"${(val as string).replace(/([A-Fa-f0-9]{64})\.(json|zip)/, '[FILENAME REMOVED]')}"`,
});

describe('Amplify nested stack', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterEach(() => {
    process.env = OLD_ENV; // restore old env
  });

  test('Test nested stack', () => {
    process.env['NUXT_UI_PRO_LICENSE'] = 'XYZ';
    const stack = new Stack(new App(), 'TestStack');
    const nestedStack = new AmplifyStack(stack, 'Amplify', {
      config: {
        branchName: 'main',
        certificate: Certificate.fromCertificateArn(
          stack,
          'Certificate',
          'arn:aws:acm:us-east-1:account:certificate/certificate_id',
        ),
        domainName: 'my.custom.domain',
        hostedZoneId: 'XXX',
        monorepoAppRoot: 'packages/frontend',
        repository: 'owner/repo',
      },
      projectId: 'test-project',
    });
    expect(Template.fromStack(nestedStack).toJSON()).toMatchSnapshot();
  });
});
