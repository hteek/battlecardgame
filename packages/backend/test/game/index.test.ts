import { Template } from 'aws-cdk-lib/assertions';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { App, Stack } from 'aws-cdk-lib';

import { GameStack } from '../../lib/game/index.js';

import { eventBusName, projectId, tableName, userPoolName } from '../data/index.js';

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

describe('Game nested stack', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterEach(() => {
    process.env = OLD_ENV; // restore old env
  });

  test('Test default stack', async () => {
    const stack = new Stack(new App(), 'TestStack');
    const nestedStack = new GameStack(stack, 'Game', {
      config: {
        eventBus: EventBus.fromEventBusName(stack, 'TestEventBus', eventBusName),
        table: Table.fromTableName(stack, 'TestTable', tableName),
        userPool: UserPool.fromUserPoolId(stack, 'UserPool', userPoolName),
      },
      projectId,
    });
    expect(Template.fromStack(nestedStack).toJSON()).toMatchSnapshot();
  });
});
