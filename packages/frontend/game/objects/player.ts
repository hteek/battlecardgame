import type * as phaser from 'phaser';
import type Phaser from 'phaser';
import {
  cardGap,
  cardSize,
  centerX,
  centerY,
  drawCardAnimationDelay,
  drawCardAnimationDuration,
  playerChestDelay,
  playerChestDuration,
  playerGridDelay,
  playerInitialCards,
} from '~/game/constants';
import { CardSlotGroup } from '~/game/objects/cardSlotGroup';
import { CardSlot, CardSlotType } from '~/game/objects/cardSlot';
import { Card } from '~/game/objects/card';
import { EventBus } from '~/game/eventBus';
import type { Main } from '~/game/scenes';
import { backCard, type CardProps, chestCard, drawRandomCard, getCardByTexture } from '~/game/cards';
import { FromLocation, type GameStateData, ToLocation } from '~/store/state';

abstract class AbstractPlayer {
  armySlotGroup: CardSlotGroup;
  chestSlot: CardSlot;
  handSlotGroup: CardSlotGroup;

  chest: phaser.GameObjects.Image;

  private _cardsDealt: boolean;
  private _cardDrawn: boolean;
  private _cardPlayed: boolean;

  constructor(
    scene: phaser.Scene,
    y: number,
    handOffset: number,
    chestOffset: number,
    private readonly type: 'Player' | 'Opponent',
  ) {
    scene.time.delayedCall(playerGridDelay, () => {
      this.armySlotGroup = new CardSlotGroup(scene, y, CardSlotType[`${type}Army`]);
      this.chestSlot = new CardSlot(
        scene,
        centerX + 3.5 * (cardSize + cardGap) + 10,
        y + chestOffset,
        CardSlotType[`${type}Chest`],
        0,
      );
      this.handSlotGroup = new CardSlotGroup(scene, y + handOffset, CardSlotType[`${type}Hand`]);

      scene.time.delayedCall(playerChestDelay, () => {
        this.addChest(scene, y, chestOffset);
      });
    });
  }

  get cardsDealt() {
    return this._cardsDealt;
  }

  set cardsDealt(value: boolean) {
    this._cardsDealt = value;
  }

  get cardDrawn() {
    return this._cardDrawn;
  }

  set cardDrawn(value: boolean) {
    this._cardDrawn = value;
  }

  get cardPlayed() {
    return this._cardPlayed;
  }

  set cardPlayed(value: boolean) {
    this._cardPlayed = value;
  }

  drawInitialCards(scene: phaser.Scene) {
    for (let i = 0; i < playerInitialCards; i++) {
      this.drawCard(scene, i * 250);
    }
  }

  abstract drawCard(scene: phaser.Scene, offsetDuration: number): void;

  _drawCard(scene: phaser.Scene, cardProps: CardProps, isInteractive: boolean, offsetDuration = 0) {
    const slot = this.handSlotGroup.emptySlot;
    if (!slot) {
      EventBus.emit('message', 'Hand is full! Play a card first!');
    } else {
      slot.card = new Card(scene, (scene as Main).stack.x, (scene as Main).stack.y, cardProps, isInteractive);
      scene.add.existing(slot.card.setAlpha(0));
      scene.tweens.add({
        targets: slot.card,
        alpha: 1, // Fade to fully visible
        delay: drawCardAnimationDelay + offsetDuration,
        duration: drawCardAnimationDelay, // Duration of fade in milliseconds
        ease: 'Linear', // Linear easing for smooth fade
      });
      scene.tweens.add({
        targets: slot.card,
        x: slot.x,
        y: slot.y,
        delay: drawCardAnimationDelay + offsetDuration + drawCardAnimationDelay,
        duration: drawCardAnimationDuration,
        ease: 'Power2',
      });
    }
  }

  addChest(scene: phaser.Scene, y: number, chestOffset: number) {
    this.chestSlot.card = new Card(scene, centerX + 3.5 * (cardSize + cardGap) + 10, y + chestOffset, chestCard, true);
    scene.add.existing(this.chestSlot.card.setAlpha(0));

    scene.tweens.add({
      targets: this.chestSlot.card,
      alpha: 1, // Fade to fully visible
      duration: playerChestDuration, // Duration of fade in milliseconds
      ease: 'Linear', // Linear easing for smooth fade
    });
  }
}

export class Player extends AbstractPlayer {
  constructor(scene: phaser.Scene) {
    super(scene, centerY + cardSize + 40, cardSize + cardGap * 5, cardSize / 2 + cardGap * 2.5, 'Player');
  }

  override drawCard(scene: Phaser.Scene, offsetDuration?: number) {
    super._drawCard(scene, drawRandomCard(), true, offsetDuration);
  }
}

export class Opponent extends AbstractPlayer {
  constructor(scene: phaser.Scene) {
    super(scene, centerY - 40, -(cardSize + cardGap * 5), -(cardSize / 2 + cardGap * 2.5), 'Opponent');
  }

  override drawCard(scene: Phaser.Scene, offsetDuration?: number) {
    super._drawCard(scene, backCard, false, offsetDuration);
  }

  isDefenseless = () => {
    const armySlots = this.armySlotGroup.getChildren() as CardSlot[];
    return armySlots.reduce((sum, slot) => sum + (slot.card?._defense ?? 0), 0) <= 0;
  };

  async playCard(scene: Phaser.Scene, state?: GameStateData) {
    console.log('state', state);
    if (state) {
      const { card, from, fromPosition, to, toPosition } = state;

      const player = (scene as Main).player;

      let fromCardSlot: CardSlot | undefined;
      let toCardSlot: CardSlot | undefined;

      console.log('state', state);
      if (ToLocation.Chest === to) {
        switch (from) {
          case FromLocation.Army:
            fromCardSlot = (this.armySlotGroup.getChildren() as CardSlot[]).find(
              (slot) => slot.position === fromPosition,
            );
            break;
          case FromLocation.Hand:
            fromCardSlot = (this.handSlotGroup.getChildren() as CardSlot[]).find(
              (slot) => slot.position === fromPosition,
            );
            if (fromCardSlot && card) {
              const { x, y } = fromCardSlot;
              fromCardSlot.card?.destroy();
              fromCardSlot.card = new Card(scene, x, y, getCardByTexture(card) ?? backCard, false);
            }
            break;
        }
        toCardSlot = player.chestSlot;
      } else if (ToLocation.Army === to) {
        switch (from) {
          case FromLocation.Army:
            fromCardSlot = (this.armySlotGroup.getChildren() as CardSlot[]).find(
              (slot) => slot.position === fromPosition,
            );
            // weapons can be played to opponents army
            toCardSlot = (player.armySlotGroup.getChildren() as CardSlot[]).find(
              (slot) => slot.position === toPosition,
            );
            break;
          case FromLocation.Hand:
            fromCardSlot = (this.handSlotGroup.getChildren() as CardSlot[]).find(
              (slot) => slot.position === fromPosition,
            );
            if (fromCardSlot && card) {
              const { x, y } = fromCardSlot;
              fromCardSlot.card?.destroy();
              fromCardSlot.card = new Card(scene, x, y, getCardByTexture(card) ?? backCard, false);
            }
            toCardSlot = (this.armySlotGroup.getChildren() as CardSlot[]).find((slot) => slot.position === toPosition);
            break;
        }
      }

      console.log('play opponent card', fromCardSlot, toCardSlot, card);
      if (fromCardSlot && fromCardSlot.card && toCardSlot) {
        await (scene as Main).evaluateMoveHandler(fromCardSlot.card, toCardSlot, true);
      }
    }
  }
}
