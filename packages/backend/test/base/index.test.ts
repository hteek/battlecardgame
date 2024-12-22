import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { BaseStack } from '../../lib/base/index.js';

import { domainName, hostedZoneId, projectId } from '../data/index.js';

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

describe('Base nested stack', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterEach(() => {
    process.env = OLD_ENV; // restore old env
  });

  test('Test default stack', async () => {
    const stack = new Stack(new App(), 'TestStack');
    const nestedStack = new BaseStack(stack, 'Base', {
      config: { domainName, hostedZoneId, useSes: true },
      projectId,
    });
    expect(Template.fromStack(nestedStack).toJSON()).toMatchSnapshot();
  });
});
