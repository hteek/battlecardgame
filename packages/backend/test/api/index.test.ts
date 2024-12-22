import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Definition } from 'aws-cdk-lib/aws-appsync';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { UserPool } from 'aws-cdk-lib/aws-cognito';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { ApiStack, BattleCardGameGraphqlApi } from '../../lib/api/index.js';

import { apiName, domainName, hostedZoneId, userPoolId } from '../data/index.js';

describe('Api nested stack', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterEach(() => {
    process.env = OLD_ENV; // restore old env
  });

  test('Test default stack', async () => {
    const stack = new Stack(new App(), 'TestStack');
    const userPool = UserPool.fromUserPoolId(stack, 'TestUserPool', userPoolId);

    const internalApi = new BattleCardGameGraphqlApi(stack, 'TestApiInternal', {
      definition: Definition.fromFile(join(dirname(fileURLToPath(import.meta.url)), 'schema.graphql')),
      name: 'test-api-internal',
      userPool,
    });

    const nestedStack = new ApiStack(stack, 'Api', {
      config: {
        apiName,
        certificate: Certificate.fromCertificateArn(
          stack,
          'Certificate',
          'arn:aws:acm:us-east-1:account:certificate/certificate_id',
        ),
        domainName,
        hostedZoneId,
        sourceApis: [internalApi],
        userPool,
      },
    });
    expect(Template.fromStack(nestedStack).toJSON()).toMatchSnapshot();
  });
});
