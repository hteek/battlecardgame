import { Definition } from 'aws-cdk-lib/aws-appsync';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

import { CodeFirstSchema } from 'awscdk-appsync-utils';

import { BattleCardGameGraphqlApi } from '../../api/index.js';

import { addEventApi, EventFunctions } from './event/index.js';
import { addGameApi, GameFunctions } from './game/index.js';

export interface AddApiProps {
  name: string;
  eventFunctions: EventFunctions;
  gameFunctions: GameFunctions;
  userPool: IUserPool;
}

export const addApi = (scope: Construct, props: AddApiProps) => {
  const { name, eventFunctions, gameFunctions, userPool } = props;
  const schema = new CodeFirstSchema();
  const api = new BattleCardGameGraphqlApi(scope, 'GameGraphqlApi', {
    definition: Definition.fromSchema(schema),
    name,
    userPool,
  });
  addEventApi(api, schema, eventFunctions);
  addGameApi(api, schema, gameFunctions);
  return api;
};
