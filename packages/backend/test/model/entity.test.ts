import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { Entity, Model, OneSchema, Table } from 'dynamodb-onetable';
import Dynamo from 'dynamodb-onetable/Dynamo';

import { MiddlewareContext } from '../../lib/middleware/index.js';
import { BaseEntity, baseSchema } from '../../lib/model/index.js';

const schema = {
  ...baseSchema,
  models: {
    Test: {
      pk: { type: String },
      sk: { type: String },
    },
  } as const,
} as const;

type TestType = Entity<typeof schema.models.Test>;

class TestEntity extends BaseEntity {
  static getTestModel: (context: MiddlewareContext) => Model<Entity<TestType extends Entity<infer X> ? X : never>> = (
    context: MiddlewareContext,
  ) => TestEntity.getModel<TestType>(context, schema, 'Test');
}

describe('entity', () => {
  test('get table', () => {
    expect(TestEntity.getTable).toBeDefined();
    expect(TestEntity.getTable).toBeInstanceOf(Function);
  });

  test('get model', () => {
    expect(TestEntity.getModel).toBeDefined();
    expect(TestEntity.getModel).toBeInstanceOf(Function);

    expect(
      TestEntity.getModel(
        {
          dynamoDB: {
            getTable: (schema: OneSchema) =>
              new Table({
                client: new Dynamo({ client: new DynamoDBClient({}) }),
                name: 'Test',
                partial: false,
                schema,
              }),
          },
        } as MiddlewareContext,
        schema,
        'Test',
      ),
    ).toBeDefined();
  });
});
