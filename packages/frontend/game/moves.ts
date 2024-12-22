import type { Card } from '~/game/objects/card';
import { type CardSlot, CardSlotType } from '~/game/objects/cardSlot';
import { CardPropsType } from '~/game/cards';
import type { Main } from '~/game/scenes';

const unitFromHandToArmy = (scene: Main, card: Card, to: CardSlot) =>
  card.cardType === CardPropsType.UNIT &&
  card.cardSlot.slotType === CardSlotType.PlayerHand &&
  to.slotType === CardSlotType.PlayerArmy;

const unitFromArmyToOpponentArmy = (scene: Main, card: Card, to: CardSlot) =>
  card.cardType === CardPropsType.UNIT &&
  card.cardSlot.slotType === CardSlotType.PlayerArmy &&
  to.slotType === CardSlotType.OpponentArmy &&
  to.hasCard;

const unitFromArmyToOpponentChest = (scene: Main, card: Card, to: CardSlot) =>
  card.cardType === CardPropsType.UNIT &&
  card.cardSlot.slotType === CardSlotType.PlayerArmy &&
  to.slotType === CardSlotType.OpponentChest;

const _weaponFromHandToOpponentArmy = (scene: Main, card: Card, to: CardSlot) =>
  card.cardType === CardPropsType.WEAPON &&
  card.cardSlot.slotType === CardSlotType.PlayerHand &&
  to.slotType === CardSlotType.OpponentArmy &&
  to.hasCard;

const weaponFromHandToOpponentChest = (scene: Main, card: Card, to: CardSlot) =>
  scene.opponent.isDefenseless() &&
  card.cardType === CardPropsType.WEAPON &&
  card.cardSlot.slotType === CardSlotType.PlayerHand &&
  to.slotType === CardSlotType.OpponentChest;

export const isValidMove = (scene: Main, card: Card, to: CardSlot) =>
  [
    unitFromHandToArmy,
    unitFromArmyToOpponentArmy,
    unitFromArmyToOpponentChest,
    // weaponFromHandToOpponentArmy,
    weaponFromHandToOpponentChest,
  ].reduce((result, check) => result || check(scene, card, to), false);
