import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { IEventBus } from 'aws-cdk-lib/aws-events';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { BattleCardGameGraphqlApi } from '../api/index.js';

import { addApi } from './api/index.js';
import {
  CreateGameFunction,
  GetEventByIdFunction,
  GetGameByIdFunction,
  JoinGameFunction,
  ListEventsByGameIdFunction,
  ListGamesByOpponentIdFunction,
  ListGamesFunction,
  PlayGameFunction,
} from './functions/index.js';

/**
 * Configuration options for {@linkcode GameStack}.
 */
export interface GameConfig {
  readonly eventBus: IEventBus;
  readonly table: ITable;
  readonly userPool: IUserPool;
}

/**
 * Wrapper for {@linkcode NestedStackProps} to provide additional attributes.
 */
export interface GameStackProps extends NestedStackProps {
  /**
   * Configuration of the {@linkcode GameStack}.
   */
  readonly config: GameConfig;
  readonly projectId: string;
}

export class GameStack extends NestedStack {
  public readonly gameGraphqlApi: BattleCardGameGraphqlApi;

  constructor(scope: Construct, id: string, props: GameStackProps) {
    super(scope, id, props);

    const { eventBus, table, userPool } = props.config;
    const { projectId } = props;

    const createGameFunction = new CreateGameFunction(this, { eventBus, table });
    const getEventByIdFunction = new GetEventByIdFunction(this, { table });
    const getGameByIdFunction = new GetGameByIdFunction(this, { table });
    const joinGameFunction = new JoinGameFunction(this, { eventBus, table });
    const listEventsByGameIdFunction = new ListEventsByGameIdFunction(this, { table });
    const listGamesByOpponentIdFunction = new ListGamesByOpponentIdFunction(this, { table });
    const listGamesFunction = new ListGamesFunction(this, { table });
    const playGameFunction = new PlayGameFunction(this, { eventBus, table });

    this.gameGraphqlApi = addApi(this, {
      eventFunctions: {
        getEventByIdFunction,
        joinGameFunction,
        listEventsByGameIdFunction,
        playGameFunction,
      },
      gameFunctions: {
        createGameFunction,
        getGameByIdFunction,
        listGamesByOpponentIdFunction,
        listGamesFunction,
      },
      name: `${projectId}-game`,
      userPool,
    });
  }
}
