import { Model, OneSchema, Table } from 'dynamodb-onetable';

import { getDynamoDBFromContext, MiddlewareContext } from '../middleware/index.js';

export type ModelName = string | number | symbol;
export type RequiredProperty<T> = {
  [P in keyof T]: Required<NonNullable<T[P]>>;
};

export abstract class BaseEntity {
  static readonly getTable: (context: MiddlewareContext, schema: OneSchema) => Table = (context, schema) =>
    getDynamoDBFromContext(context).getTable(schema);

  static readonly getModel = <T>(
    context: MiddlewareContext,
    schema: OneSchema,
    name: T extends ModelName ? T : ModelName,
  ) => BaseEntity.getTable(context, schema).getModel<T>(name) as Model<T>;
}
