import { defineStore } from 'pinia';

import type {
  CreateGameMutation,
  CreateGameMutationVariables,
  Event,
  EventDataInput,
  Game,
  GetEventByIdQuery,
  GetEventByIdQueryVariables,
  GetGameByIdQuery,
  GetGameByIdQueryVariables,
  JoinGameMutation,
  JoinGameMutationVariables,
  ListEventsByGameIdQuery,
  ListEventsByGameIdQueryVariables,
  ListGamesByOpponentIdQuery,
  ListGamesByOpponentIdQueryVariables,
  ListGamesQuery,
  ListGamesQueryVariables,
  PlayGameMutation,
  PlayGameMutationVariables,
} from '~/gql/graphql';
import { graphql } from '~/gql';
import { ref } from 'vue';
import { Hub } from 'aws-amplify/utils';
import type { GeneratedMutation, GeneratedQuery } from '@aws-amplify/api-graphql';
import { useNotificationStore } from '~/store/notification';
import { indexBy, pipe, sortBy, values } from 'remeda';
import { useAuthStore } from '~/store/auth';
import type { Main } from '~/game/scenes';
import { GameEvent, type GameStateData, useStateStore } from '~/store/state';

const createGame = graphql(/* GraphQL */ `
  mutation CreateGame($email: AWSEmail!) {
    createGame(email: $email) {
      created
      id
      opponentEmail
      opponentId
      userEmail
      userId
      __typename
    }
  }
`);

const getEventById = graphql(/* GraphQL */ `
  query GetEventById($id: ID!) {
    getEventById(id: $id) {
      created
      data {
        card
        from
        fromPosition
        to
        toPosition
      }
      id
      name
      opponentId
      userId
      __typename
    }
  }
`);

const getGameById = graphql(/* GraphQL */ `
  query GetGameById($id: ID!) {
    getGameById(id: $id) {
      created
      id
      opponentEmail
      opponentId
      userEmail
      userId
      __typename
    }
  }
`);

const joinGame = graphql(/* GraphQL */ `
  mutation JoinGame($id: ID!) {
    joinGame(id: $id) {
      created
      id
      name
      opponentId
      userId
      __typename
    }
  }
`);

const playGame = graphql(/* GraphQL */ `
  mutation PlayGame($id: ID!, $name: String!, $data: EventDataInput) {
    playGame(id: $id, name: $name, data: $data) {
      created
      data {
        card
        from
        fromPosition
        to
        toPosition
      }
      id
      name
      opponentId
      userId
      __typename
    }
  }
`);

const listEventsByGameId = graphql(/* GraphQL */ `
  query ListEventsByGameId($gameId: ID!) {
    listEventsByGameId(gameId: $gameId) {
      created
      id
      name
      opponentId
      userId
      __typename
    }
  }
`);

const listGames = graphql(/* GraphQL */ `
  query ListGames {
    listGames {
      created
      id
      opponentEmail
      opponentId
      userEmail
      userId
      __typename
    }
  }
`);

const listGamesByOpponentId = graphql(/* GraphQL */ `
  query ListGamesByOpponentId {
    listGamesByOpponentId {
      created
      id
      opponentEmail
      opponentId
      userEmail
      userId
      __typename
    }
  }
`);

const _createGame = async (email: string) =>
  useNuxtApp()
    .$Amplify.GraphQL.client.graphql({
      query: createGame as unknown as GeneratedMutation<CreateGameMutationVariables, CreateGameMutation>,
      variables: { email },
    })
    .then((result) => result.data.createGame as Game);

const _get = async (id: string) =>
  useNuxtApp()
    .$Amplify.GraphQL.client.graphql({
      query: getGameById as unknown as GeneratedQuery<GetGameByIdQueryVariables, GetGameByIdQuery>,
      variables: { id },
    })
    .then((result) => result.data.getGameById as Game);

const _getEvent = async (id: string) =>
  useNuxtApp()
    .$Amplify.GraphQL.client.graphql({
      query: getEventById as unknown as GeneratedQuery<GetEventByIdQueryVariables, GetEventByIdQuery>,
      variables: { id },
    })
    .then((result) => result.data.getEventById as Event);

const _joinGame = async (id: string) =>
  useNuxtApp()
    .$Amplify.GraphQL.client.graphql({
      query: joinGame as unknown as GeneratedMutation<JoinGameMutationVariables, JoinGameMutation>,
      variables: { id },
    })
    .then((result) => result.data.joinGame as Event);

const _playGame = async (id: string, name: string, data?: EventDataInput) =>
  useNuxtApp()
    .$Amplify.GraphQL.client.graphql({
      query: playGame as unknown as GeneratedMutation<PlayGameMutationVariables, PlayGameMutation>,
      variables: { id, name, data },
    })
    .then((result) => result.data.playGame as Event);

const _listEventsByGameId = async (gameId: string) =>
  useNuxtApp()
    .$Amplify.GraphQL.client.graphql({
      query: listEventsByGameId as unknown as GeneratedQuery<ListEventsByGameIdQueryVariables, ListEventsByGameIdQuery>,
      variables: { gameId },
    })
    .then((result) => result.data.listEventsByGameId as Event[]);

const _listGames = async () =>
  useNuxtApp()
    .$Amplify.GraphQL.client.graphql({
      query: listGames as unknown as GeneratedQuery<ListGamesQueryVariables, ListGamesQuery>,
    })
    .then((result) => result.data.listGames as Game[]);

const _listGamesByOpponentId = async () =>
  useNuxtApp()
    .$Amplify.GraphQL.client.graphql({
      query: listGamesByOpponentId as unknown as GeneratedQuery<
        ListGamesByOpponentIdQueryVariables,
        ListGamesByOpponentIdQuery
      >,
    })
    .then((result) => result.data.listGamesByOpponentId as Game[]);

export const useGameStore = defineStore('game', () => {
  const initialized = ref(false);
  const loading = ref(false);
  const gameMap = ref<{ [id: string]: Game }>({});
  const gameMapInit = ref(false);

  const currentGame = ref<Game>();
  const currentEventMap = ref<{ [id: string]: Event }>({});
  const currentEvents = computed(() =>
    pipe(currentEventMap.value, values, sortBy([(event) => (event as Event).created, 'asc'])),
  );

  let currentGameRef: Ref<any, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  const games = computed(() => pipe(gameMap.value, values, sortBy([(game) => (game as Game).created, 'desc'])));

  const authStore = useAuthStore();
  const notificationStore = useNotificationStore();

  const init = async () => {
    if (!initialized.value) {
      initialized.value = true;

      if (authStore.hasCurrentUser) {
        await load();
      }

      Hub.listen('battlecardgame-auth', async (data) => {
        const {
          payload: { event },
        } = data;
        switch (event) {
          case 'user-sign-in':
            await load();
            break;
        }
      });
    }
  };

  const load = async () => {
    if (authStore.hasCurrentUser && !gameMapInit.value && !loading.value) {
      loading.value = true;
      const ownGames = indexBy(await _listGames(), (game) => game.id);
      const otherGames = indexBy(await _listGamesByOpponentId(), (game) => game.id);
      gameMap.value = { ...ownGames, ...otherGames };
      gameMapInit.value = true;
      loading.value = false;

      Hub.listen('notification', async (data) => {
        const {
          data: { action, id },
          message,
        } = data.payload as { data: { action: string; id: string }; message: string };

        if (/(.*)-Game-(.*)/.test(message)) {
          switch (action) {
            case 'CREATE':
              gameMap.value[id] = await _get(id);
              if (authStore.currentUser?.id === gameMap.value[id].opponentId) {
                notificationStore.notify({
                  title: 'game.notifications.invitation.success.title',
                  descriptionArgs: {
                    email: gameMap.value[id].opponentEmail,
                  },
                  actions: [
                    {
                      label: 'Join',
                      click: () => {
                        navigateTo(`/game/${id}`);
                      },
                    },
                  ],
                });
              }
              break;
          }
        }

        if (/(.*)-Event-(.*)/.test(message)) {
          const stateStore = useStateStore();
          switch (action) {
            case 'CREATE':
              currentEventMap.value[id] = await _getEvent(id);
              const { name, data } = currentEventMap.value[id]; // eslint-disable-line  no-case-declarations

              switch (name) {
                case GameEvent.DRAW_INITIAL:
                  // opponent drew initial cards
                  stateStore.registerOpponentEvent(GameEvent.DRAW_INITIAL, data as GameStateData);
                  break;
                case GameEvent.DRAW:
                  // opponent drew card
                  stateStore.registerOpponentEvent(GameEvent.DRAW, data as GameStateData);
                  break;
                case GameEvent.JOIN:
                  // opponent joined
                  stateStore.registerOpponentEvent(GameEvent.JOIN, data as GameStateData);
                  break;
                case GameEvent.PLAY:
                  // opponent played a card
                  stateStore.registerOpponentEvent(GameEvent.PLAY, data as GameStateData);
                  break;
                case GameEvent.WON:
                  // opponent won the game
                  stateStore.registerOpponentEvent(GameEvent.WON, data as GameStateData);
                  break;
                case GameEvent.LOST:
                  // opponent won the game
                  stateStore.registerOpponentEvent(GameEvent.LOST, data as GameStateData);
                  break;
                default:
                  console.error('unknown event', name);
                  break;
              }
              break;
          }
        }
      });
    }
  };

  const create = async (email: string) => {
    const game = await _createGame(email).catch((err) => {
      notificationStore.error({
        title: 'game.notifications.create.failed.title',
        description: 'game.notifications.create.failed.description',
        descriptionArgs: { error: err.errors[0].message },
      });
      return { id: undefined };
    });
    const { id } = game;
    if (id) {
      gameMap.value[id] = game;
    }
    return game;
  };

  const resetCurrentGame = () => {
    currentGame.value = undefined;
    currentEventMap.value = {};
    useStateStore().resetGameState();
  };

  const loadGame = async (phaserRef: Ref, id: string) => {
    resetCurrentGame();

    currentGameRef = phaserRef;
    currentGame.value = gameMap.value[id];
    currentEventMap.value = indexBy(await _listEventsByGameId(id), (event) => event.id);
  };

  const join = async () => {
    // join current game if no events and current user is opponent
    if (
      currentGame.value &&
      currentEvents.value.length === 0 &&
      authStore.currentUser?.id === currentGame.value?.opponentId
    ) {
      const event = await _joinGame(currentGame.value.id);
      currentEventMap.value[event.id] = event;
      const stateStore = useStateStore();
      stateStore.registerPlayerEvent(GameEvent.JOIN);
    }
  };

  const startGame = () => {
    const scene = toRaw(currentGameRef.value.scene) as Main;
    scene?.start();
  };

  const drawInitialCards = async () => {
    if (currentGame.value) {
      const event = await _playGame(currentGame.value.id, GameEvent.DRAW_INITIAL);
      currentEventMap.value[event.id] = event;
      const stateStore = useStateStore();
      stateStore.registerPlayerEvent(GameEvent.DRAW_INITIAL);
    }
  };

  const drawCard = async () => {
    if (currentGame.value) {
      const event = await _playGame(currentGame.value.id, GameEvent.DRAW);
      currentEventMap.value[event.id] = event;
      const stateStore = useStateStore();
      stateStore.registerPlayerEvent(GameEvent.DRAW);
    }
  };

  const playCard = async (data: GameStateData) => {
    if (currentGame.value) {
      const event = await _playGame(currentGame.value.id, GameEvent.PLAY, data);
      currentEventMap.value[event.id] = event;
      const stateStore = useStateStore();
      stateStore.registerPlayerEvent(GameEvent.PLAY, data);
    }
  };

  const wonGame = async () => {
    if (currentGame.value) {
      const event = await _playGame(currentGame.value.id, GameEvent.WON);
      currentEventMap.value[event.id] = event;
      const stateStore = useStateStore();
      stateStore.registerPlayerEvent(GameEvent.WON);
    }
  };

  const lostGame = async () => {
    if (currentGame.value) {
      const event = await _playGame(currentGame.value.id, GameEvent.LOST);
      currentEventMap.value[event.id] = event;
      const stateStore = useStateStore();
      stateStore.registerPlayerEvent(GameEvent.LOST);
    }
  };

  return {
    create,
    currentEvents,
    currentGame,
    drawCard,
    drawInitialCards,
    games,
    init,
    join,
    loadGame,
    playCard,
    resetCurrentGame,
    startGame,
    wonGame,
    lostGame,
  };
});
