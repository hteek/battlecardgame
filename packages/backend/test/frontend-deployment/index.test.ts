import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { FrontendDeploymentStack } from '../../lib/frontend-deployment/index.js';

import { domainName, hostedZoneId } from '../data/index.js';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { join } from 'path';

expect.addSnapshotSerializer({
  test: (val) => typeof val === 'string',
  print: (val) =>
    `"${(val as string)
      .replace(/([A-Fa-f0-9]{64})\.(json|zip)|(SsrEdgeFunctionCurrentVersion[A-Fa-f0-9]{40})/, '[FILENAME REMOVED]')
      .replace(
        /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
        '[VERSION REMOVED]',
      )}"`,
});

describe('Frontend deployment nested stack', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterEach(() => {
    process.env = OLD_ENV; // restore old env
  });

  test('Test default stack', async () => {
    const stack = new Stack(new App(), 'TestStack');
    const nestedStack = new FrontendDeploymentStack(stack, 'FrontendDeployment', {
      config: {
        certificate: Certificate.fromCertificateArn(
          stack,
          'Certificate',
          'arn:aws:acm:us-east-1:account:certificate/certificate_id',
        ),
        domainName,
        hostedZoneId,
        source: join(__dirname, '../../frontend'),
      },
    });
    expect(Template.fromStack(nestedStack).toJSON()).toMatchSnapshot();
  });
});
