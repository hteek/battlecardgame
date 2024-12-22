/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** The AWSDate scalar type represents a valid extended ISO 8601 Date string. In other words, this scalar type accepts date strings of the form YYYY-MM-DD. This scalar type can also accept time zone offsets. For example, 1970-01-01Z, 1970-01-01-07:00 and 1970-01-01+05:30 are all valid dates. The time zone offset must either be Z (representing the UTC time zone) or be in the format ±hh:mm:ss. The seconds field in the timezone offset will be considered valid even though it is not part of the ISO 8601 standard. */
  AWSDate: { input: any; output: any };
  /** The AWSDateTime scalar type represents a valid extended ISO 8601 DateTime string. In other words, this scalar type accepts datetime strings of the form YYYY-MM-DDThh:mm:ss.sssZ. The field after the seconds field is a nanoseconds field. It can accept between 1 and 9 digits. The seconds and nanoseconds fields are optional (the seconds field must be specified if the nanoseconds field is to be used). The time zone offset is compulsory for this scalar. The time zone offset must either be Z (representing the UTC time zone) or be in the format ±hh:mm:ss. The seconds field in the timezone offset will be considered valid even though it is not part of the ISO 8601 standard. */
  AWSDateTime: { input: any; output: any };
  /** The AWSEmail scalar type represents an Email address string that complies with RFC 822. For example, username@example.com is a valid Email address. */
  AWSEmail: { input: any; output: any };
  /** The AWSIPAddress scalar type represents a valid IPv4 or IPv6 address string. */
  AWSIPAddress: { input: any; output: any };
  /**
   * The AWSJSON scalar type represents a JSON string that complies with RFC 8259.
   *
   * Maps like {\"upvotes\": 10}, lists like [1,2,3], and scalar values like \"AWSJSON example string\", 1, and true are accepted as valid JSON. They will automatically be parsed and loaded in the resolver mapping templates as Maps, Lists, or Scalar values rather than as the literal input strings. Invalid JSON strings like {a: 1}, {'a': 1} and Unquoted string will throw GraphQL validation errors.
   */
  AWSJSON: { input: any; output: any };
  /** The AWSPhone scalar type represents a valid Phone Number. Phone numbers are serialized and deserialized as Strings. Phone numbers provided may be whitespace delimited or hyphenated. The number can specify a country code at the beginning but this is not required. */
  AWSPhone: { input: any; output: any };
  /**
   * The AWSTime scalar type represents a valid extended ISO 8601 Time string. In other words, this scalar type accepts time strings of the form hh:mm:ss.sss. The field after the seconds field is a nanoseconds field. It can accept between 1 and 9 digits. The seconds and nanoseconds fields are optional (the seconds field must be specified if the nanoseconds field is to be used). This scalar type can also accept time zone offsets.
   *
   * For example, 12:30Z, 12:30:24-07:00 and 12:30:24.500+05:30 are all valid time strings.
   *
   * The time zone offset must either be Z (representing the UTC time zone) or be in the format hh:mm:ss. The seconds field in the timezone offset will be considered valid even though it is not part of the ISO 8601 standard.
   */
  AWSTime: { input: any; output: any };
  /** The AWSTimestamp scalar type represents the number of seconds that have elapsed since 1970-01-01T00:00Z. Timestamps are serialized and deserialized as numbers. Negative values are also accepted and these represent the number of seconds till 1970-01-01T00:00Z. */
  AWSTimestamp: { input: any; output: any };
  /** The AWSURL scalar type represents a valid URL string. The URL may use any scheme and may also be a local URL (Ex: <http://localhost/>). URLs without schemes are considered invalid. URLs which contain double slashes are also considered invalid. */
  AWSURL: { input: any; output: any };
};

export type Event = {
  __typename?: 'Event';
  created: Scalars['AWSDateTime']['output'];
  data?: Maybe<EventData>;
  gameId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['ID']['output'];
  opponentId: Scalars['ID']['output'];
  updated?: Maybe<Scalars['AWSDateTime']['output']>;
  userId: Scalars['ID']['output'];
};

export type EventData = {
  __typename?: 'EventData';
  card?: Maybe<Scalars['String']['output']>;
  from: Scalars['String']['output'];
  fromPosition?: Maybe<Scalars['Int']['output']>;
  to: Scalars['String']['output'];
  toPosition?: Maybe<Scalars['Int']['output']>;
};

export type EventDataInput = {
  card?: InputMaybe<Scalars['String']['input']>;
  from: Scalars['String']['input'];
  fromPosition?: InputMaybe<Scalars['Int']['input']>;
  to: Scalars['String']['input'];
  toPosition?: InputMaybe<Scalars['Int']['input']>;
};

export type Game = {
  __typename?: 'Game';
  created: Scalars['AWSDateTime']['output'];
  id: Scalars['ID']['output'];
  opponentEmail: Scalars['ID']['output'];
  opponentId: Scalars['ID']['output'];
  updated?: Maybe<Scalars['AWSDateTime']['output']>;
  userEmail: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createGame?: Maybe<Game>;
  joinGame?: Maybe<Event>;
  notification?: Maybe<Notification>;
  playGame?: Maybe<Event>;
  userNotification?: Maybe<Notification>;
};

export type MutationCreateGameArgs = {
  email: Scalars['AWSEmail']['input'];
};

export type MutationJoinGameArgs = {
  id: Scalars['ID']['input'];
};

export type MutationNotificationArgs = {
  action: Scalars['String']['input'];
  entity: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  referenceId?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationPlayGameArgs = {
  data?: InputMaybe<EventDataInput>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type MutationUserNotificationArgs = {
  action: Scalars['String']['input'];
  entity: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  referenceId?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type Notification = {
  __typename?: 'Notification';
  action: Scalars['String']['output'];
  entity: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  referenceId?: Maybe<Scalars['ID']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
  getEventById?: Maybe<Event>;
  getGameById?: Maybe<Game>;
  listEventsByGameId?: Maybe<Array<Maybe<Event>>>;
  listGames?: Maybe<Array<Maybe<Game>>>;
  listGamesByOpponentId?: Maybe<Array<Maybe<Game>>>;
  listNotifications?: Maybe<Array<Maybe<Notification>>>;
};

export type QueryGetEventByIdArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetGameByIdArgs = {
  id: Scalars['ID']['input'];
};

export type QueryListEventsByGameIdArgs = {
  gameId: Scalars['ID']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  onNotification?: Maybe<Notification>;
  onUserNotification?: Maybe<Notification>;
};

export type SubscriptionOnUserNotificationArgs = {
  userId: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  created: Scalars['AWSDateTime']['output'];
  disabled?: Maybe<Scalars['Boolean']['output']>;
  email: Scalars['AWSEmail']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  sub: Scalars['String']['output'];
  updated?: Maybe<Scalars['AWSDateTime']['output']>;
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
  __typename?: 'Query';
  currentUser?: {
    __typename: 'User';
    created: any;
    email: any;
    firstName?: string | null;
    id: string;
    lastName?: string | null;
    disabled?: boolean | null;
    sub: string;
    updated?: any | null;
  } | null;
};

export type CreateGameMutationVariables = Exact<{
  email: Scalars['AWSEmail']['input'];
}>;

export type CreateGameMutation = {
  __typename?: 'Mutation';
  createGame?: {
    __typename: 'Game';
    created: any;
    id: string;
    opponentEmail: string;
    opponentId: string;
    userEmail: string;
    userId: string;
  } | null;
};

export type GetEventByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetEventByIdQuery = {
  __typename?: 'Query';
  getEventById?: {
    __typename: 'Event';
    created: any;
    id: string;
    name: string;
    opponentId: string;
    userId: string;
    data?: {
      __typename?: 'EventData';
      card?: string | null;
      from: string;
      fromPosition?: number | null;
      to: string;
      toPosition?: number | null;
    } | null;
  } | null;
};

export type GetGameByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetGameByIdQuery = {
  __typename?: 'Query';
  getGameById?: {
    __typename: 'Game';
    created: any;
    id: string;
    opponentEmail: string;
    opponentId: string;
    userEmail: string;
    userId: string;
  } | null;
};

export type JoinGameMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type JoinGameMutation = {
  __typename?: 'Mutation';
  joinGame?: { __typename: 'Event'; created: any; id: string; name: string; opponentId: string; userId: string } | null;
};

export type PlayGameMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  data?: InputMaybe<EventDataInput>;
}>;

export type PlayGameMutation = {
  __typename?: 'Mutation';
  playGame?: {
    __typename: 'Event';
    created: any;
    id: string;
    name: string;
    opponentId: string;
    userId: string;
    data?: {
      __typename?: 'EventData';
      card?: string | null;
      from: string;
      fromPosition?: number | null;
      to: string;
      toPosition?: number | null;
    } | null;
  } | null;
};

export type ListEventsByGameIdQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;

export type ListEventsByGameIdQuery = {
  __typename?: 'Query';
  listEventsByGameId?: Array<{
    __typename: 'Event';
    created: any;
    id: string;
    name: string;
    opponentId: string;
    userId: string;
  } | null> | null;
};

export type ListGamesQueryVariables = Exact<{ [key: string]: never }>;

export type ListGamesQuery = {
  __typename?: 'Query';
  listGames?: Array<{
    __typename: 'Game';
    created: any;
    id: string;
    opponentEmail: string;
    opponentId: string;
    userEmail: string;
    userId: string;
  } | null> | null;
};

export type ListGamesByOpponentIdQueryVariables = Exact<{ [key: string]: never }>;

export type ListGamesByOpponentIdQuery = {
  __typename?: 'Query';
  listGamesByOpponentId?: Array<{
    __typename: 'Game';
    created: any;
    id: string;
    opponentEmail: string;
    opponentId: string;
    userEmail: string;
    userId: string;
  } | null> | null;
};

export type OnNotificationSubscriptionVariables = Exact<{ [key: string]: never }>;

export type OnNotificationSubscription = {
  __typename?: 'Subscription';
  onNotification?: {
    __typename: 'Notification';
    action: string;
    entity: string;
    id: string;
    referenceId?: string | null;
    userId?: string | null;
  } | null;
};

export type OnUserNotificationSubscriptionVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;

export type OnUserNotificationSubscription = {
  __typename?: 'Subscription';
  onUserNotification?: {
    __typename: 'Notification';
    action: string;
    entity: string;
    id: string;
    referenceId?: string | null;
    userId?: string | null;
  } | null;
};

export const CurrentUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'CurrentUser' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUser' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'created' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'disabled' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sub' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updated' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const CreateGameDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateGame' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'AWSEmail' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createGame' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'email' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'created' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'opponentEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'opponentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateGameMutation, CreateGameMutationVariables>;
export const GetEventByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetEventById' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getEventById' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'created' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'card' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'from' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fromPosition' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'to' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'toPosition' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'opponentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetEventByIdQuery, GetEventByIdQueryVariables>;
export const GetGameByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetGameById' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getGameById' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'created' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'opponentEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'opponentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetGameByIdQuery, GetGameByIdQueryVariables>;
export const JoinGameDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'JoinGame' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinGame' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'created' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'opponentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<JoinGameMutation, JoinGameMutationVariables>;
export const PlayGameDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'PlayGame' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'EventDataInput' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'playGame' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'data' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'created' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'card' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'from' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fromPosition' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'to' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'toPosition' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'opponentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PlayGameMutation, PlayGameMutationVariables>;
export const ListEventsByGameIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ListEventsByGameId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'gameId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'listEventsByGameId' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'gameId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'gameId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'created' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'opponentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ListEventsByGameIdQuery, ListEventsByGameIdQueryVariables>;
export const ListGamesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ListGames' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'listGames' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'created' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'opponentEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'opponentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ListGamesQuery, ListGamesQueryVariables>;
export const ListGamesByOpponentIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ListGamesByOpponentId' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'listGamesByOpponentId' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'created' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'opponentEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'opponentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ListGamesByOpponentIdQuery, ListGamesByOpponentIdQueryVariables>;
export const OnNotificationDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'subscription',
      name: { kind: 'Name', value: 'OnNotification' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'onNotification' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'action' } },
                { kind: 'Field', name: { kind: 'Name', value: 'entity' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'referenceId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<OnNotificationSubscription, OnNotificationSubscriptionVariables>;
export const OnUserNotificationDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'subscription',
      name: { kind: 'Name', value: 'OnUserNotification' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'onUserNotification' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'userId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'action' } },
                { kind: 'Field', name: { kind: 'Name', value: 'entity' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'referenceId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<OnUserNotificationSubscription, OnUserNotificationSubscriptionVariables>;
