import * as phaser from 'phaser';

import { EventBus } from '../eventBus';
import {
  cardGap,
  cardScale,
  cardSize,
  centerX,
  height,
  logoAnimationDelay,
  logoAnimationDuration,
  width,
} from '~/game/constants';
import { Opponent, Player } from '~/game/objects/player';
import { Message } from '~/game/objects/message';
import { type FromLocation, type GameStateData, type ToLocation, useStateStore } from '~/store/state';
import { useGameStore } from '~/store/game';
import type { Card } from '~/game/objects/card';
import type { CardSlot } from '~/game/objects/cardSlot';

export class Main extends phaser.Scene {
  private stateStore: ReturnType<typeof useStateStore>;
  private gameStore: ReturnType<typeof useGameStore>;
  private unsubscribeStateStore: (() => void) | null = null;

  stack: phaser.GameObjects.Image;
  title: phaser.GameObjects.Text;
  message: phaser.GameObjects.Text;

  player: Player;
  opponent: Opponent;

  constructor() {
    super('Main');
  }

  init() {
    this.gameStore = useGameStore();
    this.stateStore = useStateStore();

    // Watch for store changes
    this.unsubscribeStateStore = this.stateStore.$subscribe(async (mutation, state) => {
      if (mutation.storeId === 'state') {
        if (state.gameState) {
          const { name, player, data } = state.gameState;
          switch (name) {
            case 'draw':
              await this.draw(player);
              break;
            case 'draw-initial':
              await this.drawInitial(player);
              break;
            case 'join':
              await this.join(player);
              break;
            case 'play':
              await this.play(player, data);
              break;
            case 'won':
              if (player) {
                EventBus.emit('message', 'Congratulations, you won!');
              } else {
                EventBus.emit('message', 'Oh no, we lost!');
              }
              break;
            case 'lost':
              if (player) {
                EventBus.emit('message', 'Oh no, we lost!');
              } else {
                EventBus.emit('message', 'Congratulations, you won!');
              }
              break;
          }
        }
      }
    });
  }

  async draw(player: boolean) {
    if (player) {
      // It seems that the player just drew a card
      this.player.cardDrawn = true;
      this.player.cardPlayed = false;
      if (this.opponent.cardDrawn) {
        EventBus.emit('message', 'Waiting for opponent to draw a card!');
      } else {
        EventBus.emit('message', 'Waiting for opponent to play a card!');
      }
    } else {
      // It seems that the opponent just drew a cards...
      this.opponent.cardDrawn = true;
      this.opponent.drawCard(this);
      this.player.cardPlayed = false;
      if (this.player.cardDrawn) {
        // ...and the player has already drawn a cards
        this.input.enabled = true;
        EventBus.emit('message', "Let's play a card!");
      } else {
        // ...but the player has not yet drawn a card!
        EventBus.emit('message', "Let's draw a card!");
        this.player.drawCard(this);
        await this.gameStore.drawCard();
      }
    }
  }

  async drawInitial(player: boolean) {
    if (player) {
      // It seems that the player just drew initial cards
      this.player.cardsDealt = true;
      if (this.opponent.cardsDealt) {
        EventBus.emit('message', 'Waiting for opponent to play the first card!');
      } else {
        EventBus.emit('message', 'Waiting for opponent to draw initial cards!');
      }
    } else {
      // It seems that the opponent just drew initial cards...
      this.opponent.cardsDealt = true;
      this.opponent.drawInitialCards(this);
      if (this.player.cardsDealt) {
        // ...and the player has already initial cards
        this.input.enabled = true;
        EventBus.emit('message', "Let's play the first card!");
      } else {
        // ...but the player has no initial cards yet. So let's draw some!
        EventBus.emit('message', "Let's draw initial cards!");
        this.player.drawInitialCards(this);
        await this.gameStore.drawInitialCards();
        EventBus.emit('message', 'Waiting for opponent to play the first card!');
      }
    }
  }

  async join(player: boolean) {
    if (player) {
      EventBus.emit('message', 'Waiting for opponent to draw initial cards!');
    } else {
      EventBus.emit('message', "Let's draw initial cards and wait for our opponent!");
      this.player.drawInitialCards(this);
      await this.gameStore.drawInitialCards();
    }
  }

  async play(player: boolean, data?: GameStateData) {
    if (player) {
      // It seems that the player just played a card
      this.player.cardPlayed = true;
      this.player.cardDrawn = false;
      EventBus.emit('message', 'Waiting for opponent to play a card!');
    } else {
      // It seems that the opponent just played a card...
      this.opponent.cardPlayed = true;
      await this.opponent.playCard(this, data);
      this.opponent.cardDrawn = false;
      if (!this.player.chestSlot.hasCard) {
        await this.gameStore.lostGame();
      } else if (this.player.cardPlayed) {
        // ...and the player has already played a card
        EventBus.emit('message', "Let's draw a card!");
        this.player.drawCard(this);
        await this.gameStore.drawCard();
      } else {
        // ...but the player has not yet played a card!
        this.input.enabled = true;
        EventBus.emit('message', "Let's play a card!");
      }
    }
  }

  async evaluateMoveHandler(card: Card, cardSlot: CardSlot, simulate?: boolean) {
    const from = card.cardSlot.slotType;
    const fromPosition = card.cardSlot.position;
    const to = cardSlot.slotType;
    const toPosition = cardSlot.position;

    console.log('evaluate from', card.cardName, card.cardSlot.slotType, card.position);
    console.log('evaluate to', cardSlot.card?.cardName, cardSlot.slotType, cardSlot.position);
    if (cardSlot.hasCard) {
      if (simulate) {
        const xOffset = cardSlot.x - card.x;
        const yOffset = cardSlot.y - card.y;
        const xAdjustment = xOffset < 0 ? cardSize / 2 : -(cardSize / 2);
        const yAdjustment = yOffset < 0 ? cardSize / 2 : -(cardSize / 2);

        console.log('move to attack', xOffset, yOffset, xAdjustment, yAdjustment);

        card.setDepth(125);
        await new Promise((resolve) =>
          this.tweens.add({
            targets: card,
            x: card.x + xOffset + xAdjustment,
            y: card.y + yOffset + yAdjustment,
            duration: 300, // milliseconds
            ease: 'Power2',
            onComplete: resolve,
          }),
        );
      }
      card.attack(cardSlot);
      cardSlot.card!.attack(card.cardSlot);
      if (simulate) {
        console.log('move back', card.cardName, cardSlot.card?.cardName);
        this.time.delayedCall(250, () => {
          this.tweens.add({
            targets: card,
            x: card.cardSlot.x,
            y: card.cardSlot.y,
            duration: 300, // milliseconds
            ease: 'Power2',
          });
        });
        card.setDepth(100);
      }
      if (card.isDead) {
        card.destroy();
      }
      if (cardSlot.card?.isDead) {
        cardSlot.card!.destroy();
      }
    } else {
      card.move(cardSlot);
    }

    console.log('card name', card.cardName);
    if (!simulate) {
      await this.gameStore.playCard({
        card: card.cardName,
        from: from.replace(/player-|opponent-/g, '') as FromLocation,
        fromPosition,
        to: to.replace(/player-|opponent-/g, '') as ToLocation,
        toPosition,
      });
    }
  }

  create() {
    this.stack = this.add.image(width / 2, height / 2, 'card-back').setDepth(10);
    this.title = this.add
      .text(width / 2, height / 2, 'Viking Raid', {
        fontFamily: 'Arial Black',
        fontSize: 48,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(20);
    this.message = this.add.existing(new Message(this, 'Waiting for opponent to join!'));
    this.player = new Player(this);
    this.opponent = new Opponent(this);

    this.input.enabled = false;

    EventBus.emit('current-scene-ready', this);
  }

  destroy() {
    // Clean up subscription when scene is destroyed
    if (this.unsubscribeStateStore) {
      this.unsubscribeStateStore();
    }
  }

  start() {
    this.tweens.add({
      targets: this.stack,
      x: centerX + cardSize / 2 - 3 * (cardSize + cardGap) - 10,
      delay: logoAnimationDelay,
      duration: logoAnimationDuration,
      ease: 'Power2',
      scaleX: cardScale,
      scaleY: cardScale,
    });

    this.tweens.add({
      targets: this.title,
      y: 25,
      delay: logoAnimationDelay,
      duration: logoAnimationDuration,
      ease: 'Power2',
    });

    // Join the game
    this.time.delayedCall(logoAnimationDelay + logoAnimationDuration, () =>
      this.gameStore.join().catch((error) => console.error('Failed to join game', error)),
    );
  }
}
