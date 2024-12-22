import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { SourceMapMode } from 'aws-cdk-lib/aws-lambda-nodejs';

import { BaseNodejsFunction } from '../../lib/common/index.js';

import { eventBusName, tableName } from '../data/index.js';

expect.addSnapshotSerializer({
  test: (val) => typeof val === 'string',
  print: (val) =>
    // eslint-disable-next-line no-useless-escape
    `"${(val as string).replace(/\"/g, '\\"').replace(/([A-Fa-f0-9]{64})\.(json|zip)/, '[FILENAME REMOVED]')}"`,
});

describe('BaseNodejsFunction', () => {
  describe('Default', () => {
    test('Default environment', () => {
      const stack = new Stack(new App(), 'TestStack');
      new BaseNodejsFunction(stack, 'Test');
      expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    });

    test('Custom environment, bundling and entry', () => {
      const stack = new Stack(new App(), 'TestStack');
      new BaseNodejsFunction(stack, 'Test', {
        nodejsFunctionProps: {
          bundling: {
            sourceMapMode: SourceMapMode.BOTH,
          },
          entry: '../common/lambda',
          environment: {
            CUSTOM: 'custom',
          },
        },
      });
      expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    });
  });

  describe('DynamoDB', () => {
    test('read only', () => {
      const stack = new Stack(new App(), 'TestStack');
      new BaseNodejsFunction(stack, 'Test', {
        dynamodb: {
          table: Table.fromTableName(stack, 'TestTable', tableName),
        },
        nodejsFunctionProps: {},
      });
      expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    });

    test('read only with custom environment', () => {
      const stack = new Stack(new App(), 'TestStack');
      new BaseNodejsFunction(stack, 'Test', {
        dynamodb: {
          table: Table.fromTableName(stack, 'TestTable', tableName),
        },
        nodejsFunctionProps: {
          environment: {
            CUSTOM: 'custom',
          },
        },
      });
      expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    });

    test('read/write', () => {
      const stack = new Stack(new App(), 'TestStack');
      new BaseNodejsFunction(stack, 'Test', {
        dynamodb: {
          table: Table.fromTableName(stack, 'TestTable', tableName),
          grantWriteData: true,
        },
        nodejsFunctionProps: {},
      });
      expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    });
  });

  describe('EventBridge', () => {
    test('read only', () => {
      const stack = new Stack(new App(), 'TestStack');
      new BaseNodejsFunction(stack, 'Test', {
        eventBridge: {
          eventBus: EventBus.fromEventBusName(stack, 'TestEventBus', eventBusName),
          eventPattern: {
            detailType: ['test'],
          },
        },
        nodejsFunctionProps: {},
      });
      expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    });

    test('read only with default event bus', () => {
      const stack = new Stack(new App(), 'TestStack');
      new BaseNodejsFunction(stack, 'Test', {
        eventBridge: {
          eventBus: EventBus.fromEventBusName(stack, 'TestEventBus', eventBusName),
          eventPattern: {
            detailType: ['test'],
          },
          eventPatternDefaultEventBus: true,
        },
        nodejsFunctionProps: {},
      });
      expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    });

    test('read only with custom environment', () => {
      const stack = new Stack(new App(), 'TestStack');
      new BaseNodejsFunction(stack, 'Test', {
        eventBridge: {
          eventBus: EventBus.fromEventBusName(stack, 'TestEventBus', eventBusName),
          eventPattern: {
            detailType: ['test'],
          },
        },
        nodejsFunctionProps: {
          environment: {
            CUSTOM: 'custom',
          },
        },
      });
      expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    });

    test('put events', () => {
      const stack = new Stack(new App(), 'TestStack');
      new BaseNodejsFunction(stack, 'Test', {
        eventBridge: {
          eventBus: EventBus.fromEventBusName(stack, 'TestEventBus', eventBusName),
          eventPattern: {
            detailType: ['test'],
          },
          grantPutEvents: true,
        },
        nodejsFunctionProps: {},
      });
      expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    });
  });
});
