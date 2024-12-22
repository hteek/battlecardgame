import { Entity, Model } from 'dynamodb-onetable';
import { v5 as uuidv5 } from 'uuid';

import { getAppSyncFromContext, MiddlewareContext } from '../../../../middleware/index.js';
import { BaseEntity } from '../../../../model/index.js';

import { schema } from './schema.js';

export type UserType = Entity<typeof schema.models.User>;

const emailNamespace = '784dd88e-f0e0-40d5-bd2e-c2eb8879e6d0';

export class User extends BaseEntity {
  static readonly getUserModel: (
    context: MiddlewareContext,
  ) => Model<Entity<UserType extends Entity<infer X> ? X : never>> = (context: MiddlewareContext) =>
    User.getModel<UserType>(context, schema, 'User');

  static readonly createFromEmail: (
    context: MiddlewareContext,
    email: string,
    firstName?: string,
    lastName?: string,
  ) => Promise<Entity<UserType extends Entity<infer X> ? X : never>> = async (
    context: MiddlewareContext,
    email: string,
    firstName?: string,
    lastName?: string,
  ) =>
    User.getUserModel(context).create({
      email,
      sub: uuidv5(email, emailNamespace),
      ...(firstName ? { firstName } : {}),
      ...(lastName ? { lastName } : {}),
    });

  static readonly getByEmail: (context: MiddlewareContext, email: string) => Promise<UserType> = async (
    context: MiddlewareContext,
    email: string,
  ) =>
    User.getUserModel(context)
      .get(
        {
          sub: uuidv5(email, emailNamespace),
        },
        {
          log: true,
        },
      )
      .then((user?: UserType) => {
        if (!user) {
          throw new Error(`no user found with email: ${email}`);
        }

        return user;
      });

  static readonly getCurrent: (context: MiddlewareContext) => Promise<UserType> = async (
    context: MiddlewareContext,
  ) => {
    const { email, userId: id } = getAppSyncFromContext(context);
    return User.getUserModel(context)
      .get(
        {
          id,
          sub: uuidv5(email, emailNamespace),
        },
        {
          log: true,
        },
      )
      .then((user?: UserType) => {
        if (!user) {
          throw new Error(`no user found with id: ${id} and email: ${email}`);
        }

        return user;
      });
  };
}
