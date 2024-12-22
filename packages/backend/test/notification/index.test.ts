import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { EventBus } from 'aws-cdk-lib/aws-events';

import { BattleCardGameMergedGraphqlApi } from '../../lib/api/index.js';
import { NotificationApiStack, NotificationStack } from '../../lib/notification/index.js';

import { apiGraphqlUrl, eventBusName, projectId, tableName, userPoolName } from '../data/index.js';

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

describe('Notification', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterEach(() => {
    process.env = OLD_ENV; // restore old env
  });

  describe('Notification API nested stack', () => {
    test('Test nested stack', () => {
      const stack = new Stack(new App(), 'TestStack');
      const nestedStack = new NotificationApiStack(stack, 'NotificationApi', {
        config: {
          table: Table.fromTableName(stack, 'TestTable', tableName),
          userPool: UserPool.fromUserPoolId(stack, 'UserPool', userPoolName),
        },
        projectId,
      });
      expect(Template.fromStack(nestedStack).toJSON()).toMatchSnapshot();
    });
  });

  describe('Notification nested stack', () => {
    test('Test nested stack', () => {
      const stack = new Stack(new App(), 'TestStack');
      const api = new BattleCardGameMergedGraphqlApi(stack, 'TestApi', {
        certificate: Certificate.fromCertificateArn(
          stack,
          'Certificate',
          'arn:aws:acm:us-east-1:account:certificate/certificate_id',
        ),
        domainName: 'my.custom.domain',
        name: projectId,
        sourceApis: [],
        userPool: UserPool.fromUserPoolId(stack, 'UserPool', userPoolName),
      });
      const nestedStack = new NotificationStack(stack, 'Notification', {
        config: {
          api,
          apiGraphqlUrl,
          eventBus: EventBus.fromEventBusName(stack, 'TestEventBus', eventBusName),
        },
        projectId,
      });
      expect(Template.fromStack(nestedStack).toJSON()).toMatchSnapshot();
    });
  });
});
