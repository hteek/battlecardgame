import { Definition } from 'aws-cdk-lib/aws-appsync';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

import { CodeFirstSchema } from 'awscdk-appsync-utils';

import { addUserApi, UserFunctions } from './user/index.js';
import { BattleCardGameGraphqlApi } from '../../api/index.js';

export interface AddApiProps {
  name: string;
  userFunctions: UserFunctions;
  userPool: IUserPool;
}

export const addApi = (scope: Construct, props: AddApiProps) => {
  const { name, userFunctions, userPool } = props;
  const schema = new CodeFirstSchema();
  const api = new BattleCardGameGraphqlApi(scope, 'AuthGraphqlApi', {
    definition: Definition.fromSchema(schema),
    name,
    userPool,
  });
  addUserApi(api, schema, userFunctions);
  return api;
};
