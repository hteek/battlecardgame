import { Definition } from 'aws-cdk-lib/aws-appsync';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { CodeFirstSchema } from 'awscdk-appsync-utils';

import { BattleCardGameGraphqlApi } from '../../api/index.js';

import { addNotificationApi } from './notification/index.js';

export interface AddApiProps {
  name: string;
  table: ITable;
  userPool: IUserPool;
}

export const addApi = (scope: Construct, props: AddApiProps) => {
  const { name, table, userPool } = props;
  const schema = new CodeFirstSchema();
  const api = new BattleCardGameGraphqlApi(scope, 'NotificationGraphQLApi', {
    definition: Definition.fromSchema(schema),
    name,
    userPool,
  });
  addNotificationApi(api, schema, table);
  return api;
};
