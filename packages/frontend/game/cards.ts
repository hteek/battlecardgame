import { playerGold } from '~/game/constants';

export enum CardPropsType {
  UNIT = 'unit',
  WEAPON = 'weapon',
  CHEST = 'chest',
  BACK = 'back',
}

export type CardProps = {
  attack?: number;
  defense?: number;
  hitPoints?: number;
  texture: string;
  type: CardPropsType;
  weight: number;
};

export const cards: CardProps[] = [
  // Units 70%
  {
    attack: 1,
    defense: 1,
    hitPoints: 3,
    texture: 'viking-2',
    type: CardPropsType.UNIT,
    weight: 0.8,
  },
  {
    attack: 2,
    defense: 0,
    hitPoints: 3,
    texture: 'viking-4',
    type: CardPropsType.UNIT,
    weight: 0.7,
  },
  {
    attack: 2,
    defense: 1,
    hitPoints: 3,
    texture: 'viking-1',
    type: CardPropsType.UNIT,
    weight: 0.6,
  },
  {
    attack: 3,
    defense: 0,
    hitPoints: 3,
    texture: 'viking-3',
    type: CardPropsType.UNIT,
    weight: 0.5,
  },
  {
    attack: 3,
    defense: 1,
    hitPoints: 3,
    texture: 'viking-5',
    type: CardPropsType.UNIT,
    weight: 0.4,
  },
  // Weapons 30%
  {
    attack: 1,
    texture: 'weapon-1',
    type: CardPropsType.WEAPON,
    weight: 0.3,
  },
  {
    attack: 2,
    texture: 'weapon-2',
    type: CardPropsType.WEAPON,
    weight: 0.2,
  },
  {
    attack: 3,
    texture: 'weapon-3',
    type: CardPropsType.WEAPON,
    weight: 0.1,
  },
];

export const chestCard: CardProps = {
  attack: -1,
  hitPoints: playerGold,
  texture: 'chest',
  type: CardPropsType.CHEST,
  weight: 1,
};

export const backCard: CardProps = {
  texture: 'back',
  type: CardPropsType.BACK,
  weight: 1,
};

export const getCardByTexture = (texture: string) => cards.find((card) => card.texture === texture);

export const drawRandomCard = (): CardProps => {
  const totalWeight = cards.reduce((sum, card) => sum + card.weight, 0);
  const random = Math.random() * totalWeight;

  let currentWeight = 0;
  for (const weightedItem of cards) {
    currentWeight += weightedItem.weight;
    if (random <= currentWeight) {
      return weightedItem;
    }
  }
  // Fallback (shouldn't reach here)
  return cards[0];
};
