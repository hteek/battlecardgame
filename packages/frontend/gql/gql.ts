/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
  '\n  query CurrentUser {\n    currentUser {\n      created\n      email\n      firstName\n      id\n      lastName\n      disabled\n      sub\n      updated\n      __typename\n    }\n  }\n':
    types.CurrentUserDocument,
  '\n  mutation CreateGame($email: AWSEmail!) {\n    createGame(email: $email) {\n      created\n      id\n      opponentEmail\n      opponentId\n      userEmail\n      userId\n      __typename\n    }\n  }\n':
    types.CreateGameDocument,
  '\n  query GetEventById($id: ID!) {\n    getEventById(id: $id) {\n      created\n      data {\n        card\n        from\n        fromPosition\n        to\n        toPosition\n      }\n      id\n      name\n      opponentId\n      userId\n      __typename\n    }\n  }\n':
    types.GetEventByIdDocument,
  '\n  query GetGameById($id: ID!) {\n    getGameById(id: $id) {\n      created\n      id\n      opponentEmail\n      opponentId\n      userEmail\n      userId\n      __typename\n    }\n  }\n':
    types.GetGameByIdDocument,
  '\n  mutation JoinGame($id: ID!) {\n    joinGame(id: $id) {\n      created\n      id\n      name\n      opponentId\n      userId\n      __typename\n    }\n  }\n':
    types.JoinGameDocument,
  '\n  mutation PlayGame($id: ID!, $name: String!, $data: EventDataInput) {\n    playGame(id: $id, name: $name, data: $data) {\n      created\n      data {\n        card\n        from\n        fromPosition\n        to\n        toPosition\n      }\n      id\n      name\n      opponentId\n      userId\n      __typename\n    }\n  }\n':
    types.PlayGameDocument,
  '\n  query ListEventsByGameId($gameId: ID!) {\n    listEventsByGameId(gameId: $gameId) {\n      created\n      id\n      name\n      opponentId\n      userId\n      __typename\n    }\n  }\n':
    types.ListEventsByGameIdDocument,
  '\n  query ListGames {\n    listGames {\n      created\n      id\n      opponentEmail\n      opponentId\n      userEmail\n      userId\n      __typename\n    }\n  }\n':
    types.ListGamesDocument,
  '\n  query ListGamesByOpponentId {\n    listGamesByOpponentId {\n      created\n      id\n      opponentEmail\n      opponentId\n      userEmail\n      userId\n      __typename\n    }\n  }\n':
    types.ListGamesByOpponentIdDocument,
  '\n  subscription OnNotification {\n    onNotification {\n      action\n      entity\n      id\n      referenceId\n      userId\n      __typename\n    }\n  }\n':
    types.OnNotificationDocument,
  '\n  subscription OnUserNotification($userId: ID!) {\n    onUserNotification(userId: $userId) {\n      action\n      entity\n      id\n      referenceId\n      userId\n      __typename\n    }\n  }\n':
    types.OnUserNotificationDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query CurrentUser {\n    currentUser {\n      created\n      email\n      firstName\n      id\n      lastName\n      disabled\n      sub\n      updated\n      __typename\n    }\n  }\n',
): (typeof documents)['\n  query CurrentUser {\n    currentUser {\n      created\n      email\n      firstName\n      id\n      lastName\n      disabled\n      sub\n      updated\n      __typename\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateGame($email: AWSEmail!) {\n    createGame(email: $email) {\n      created\n      id\n      opponentEmail\n      opponentId\n      userEmail\n      userId\n      __typename\n    }\n  }\n',
): (typeof documents)['\n  mutation CreateGame($email: AWSEmail!) {\n    createGame(email: $email) {\n      created\n      id\n      opponentEmail\n      opponentId\n      userEmail\n      userId\n      __typename\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetEventById($id: ID!) {\n    getEventById(id: $id) {\n      created\n      data {\n        card\n        from\n        fromPosition\n        to\n        toPosition\n      }\n      id\n      name\n      opponentId\n      userId\n      __typename\n    }\n  }\n',
): (typeof documents)['\n  query GetEventById($id: ID!) {\n    getEventById(id: $id) {\n      created\n      data {\n        card\n        from\n        fromPosition\n        to\n        toPosition\n      }\n      id\n      name\n      opponentId\n      userId\n      __typename\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetGameById($id: ID!) {\n    getGameById(id: $id) {\n      created\n      id\n      opponentEmail\n      opponentId\n      userEmail\n      userId\n      __typename\n    }\n  }\n',
): (typeof documents)['\n  query GetGameById($id: ID!) {\n    getGameById(id: $id) {\n      created\n      id\n      opponentEmail\n      opponentId\n      userEmail\n      userId\n      __typename\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation JoinGame($id: ID!) {\n    joinGame(id: $id) {\n      created\n      id\n      name\n      opponentId\n      userId\n      __typename\n    }\n  }\n',
): (typeof documents)['\n  mutation JoinGame($id: ID!) {\n    joinGame(id: $id) {\n      created\n      id\n      name\n      opponentId\n      userId\n      __typename\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation PlayGame($id: ID!, $name: String!, $data: EventDataInput) {\n    playGame(id: $id, name: $name, data: $data) {\n      created\n      data {\n        card\n        from\n        fromPosition\n        to\n        toPosition\n      }\n      id\n      name\n      opponentId\n      userId\n      __typename\n    }\n  }\n',
): (typeof documents)['\n  mutation PlayGame($id: ID!, $name: String!, $data: EventDataInput) {\n    playGame(id: $id, name: $name, data: $data) {\n      created\n      data {\n        card\n        from\n        fromPosition\n        to\n        toPosition\n      }\n      id\n      name\n      opponentId\n      userId\n      __typename\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query ListEventsByGameId($gameId: ID!) {\n    listEventsByGameId(gameId: $gameId) {\n      created\n      id\n      name\n      opponentId\n      userId\n      __typename\n    }\n  }\n',
): (typeof documents)['\n  query ListEventsByGameId($gameId: ID!) {\n    listEventsByGameId(gameId: $gameId) {\n      created\n      id\n      name\n      opponentId\n      userId\n      __typename\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query ListGames {\n    listGames {\n      created\n      id\n      opponentEmail\n      opponentId\n      userEmail\n      userId\n      __typename\n    }\n  }\n',
): (typeof documents)['\n  query ListGames {\n    listGames {\n      created\n      id\n      opponentEmail\n      opponentId\n      userEmail\n      userId\n      __typename\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query ListGamesByOpponentId {\n    listGamesByOpponentId {\n      created\n      id\n      opponentEmail\n      opponentId\n      userEmail\n      userId\n      __typename\n    }\n  }\n',
): (typeof documents)['\n  query ListGamesByOpponentId {\n    listGamesByOpponentId {\n      created\n      id\n      opponentEmail\n      opponentId\n      userEmail\n      userId\n      __typename\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  subscription OnNotification {\n    onNotification {\n      action\n      entity\n      id\n      referenceId\n      userId\n      __typename\n    }\n  }\n',
): (typeof documents)['\n  subscription OnNotification {\n    onNotification {\n      action\n      entity\n      id\n      referenceId\n      userId\n      __typename\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  subscription OnUserNotification($userId: ID!) {\n    onUserNotification(userId: $userId) {\n      action\n      entity\n      id\n      referenceId\n      userId\n      __typename\n    }\n  }\n',
): (typeof documents)['\n  subscription OnUserNotification($userId: ID!) {\n    onUserNotification(userId: $userId) {\n      action\n      entity\n      id\n      referenceId\n      userId\n      __typename\n    }\n  }\n'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never;
