import { defineStore } from 'pinia';

export const GameEvent = {
  DRAW: 'draw',
  DRAW_INITIAL: 'draw-initial',
  JOIN: 'join',
  LOST: 'lost',
  PLAY: 'play',
  WON: 'won',
} as const;

export enum FromLocation {
  Army = 'army',
  Hand = 'hand',
  Stack = 'stack',
}

export enum ToLocation {
  Army = 'army',
  Chest = 'chest',
}

export type GameStateData = {
  from: FromLocation;
  fromPosition?: number;
  to: ToLocation;
  toPosition?: number;
  card?: string;
};

export type GameState = {
  data?: GameStateData;
  name: string;
  player: boolean;
};

export const useStateStore = defineStore('state', () => {
  const gameState = ref<GameState>();

  const registerEvent = (name: string, player: boolean, data?: GameStateData) => {
    gameState.value = {
      data,
      name,
      player,
    };
  };

  const registerOpponentEvent = (name: string, data?: GameStateData) => registerEvent(name, false, data);
  const registerPlayerEvent = (name: string, data?: GameStateData) => registerEvent(name, true, data);

  const resetGameState = () => {
    gameState.value = undefined;
  };

  return {
    gameState,
    registerOpponentEvent,
    registerPlayerEvent,
    resetGameState,
  };
});
