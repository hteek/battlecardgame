import phaser from 'phaser';
import { cardSize, cardSlotFadeInDuration, lineColor } from '~/game/constants';
import type { Card } from '~/game/objects/card';
import { isValidMove } from '~/game/moves';
import type { Main } from '~/game/scenes';
import Pointer = Phaser.Input.Pointer;

export enum CardSlotType {
  PlayerArmy = 'player-army',
  PlayerChest = 'player-chest',
  PlayerHand = 'player-hand',
  OpponentArmy = 'opponent-army',
  OpponentChest = 'opponent-chest',
  OpponentHand = 'opponent-hand',
}

export class CardSlot extends phaser.GameObjects.Zone {
  readonly graphics: phaser.GameObjects.Graphics;

  private _card?: Card;

  get hasCard(): boolean {
    return !!this._card;
  }

  get card(): Card | undefined {
    return this._card;
  }

  set card(card: Card | undefined) {
    this._card = card;
    if (card) {
      card.cardSlot = this;
    }
  }

  constructor(scene: phaser.Scene, x: number, y: number, readonly slotType: CardSlotType, readonly position: number) {
    super(scene, x, y, cardSize, cardSize);
    scene.add.existing(this);

    // Set up drop zone
    this.setRectangleDropZone(cardSize, cardSize);

    // Create graphics for visual feedback
    this.graphics = scene.add.graphics();

    const updateGraphics = (color: number, alpha?: number) => {
      this.graphics.clear();
      this.graphics.lineStyle(2, color, alpha);
      this.graphics.strokeRoundedRect(
        this.x - this.input?.hitArea.width / 2,
        this.y - this.input?.hitArea.height / 2,
        this.input?.hitArea.width,
        this.input?.hitArea.height,
        16,
      );
    };

    // Visualize the drop zone
    updateGraphics(lineColor, 0.25);

    this.graphics.setAlpha(0);
    this.scene.tweens.add({
      targets: this.graphics,
      alpha: 1, // Fade to fully visible
      duration: cardSlotFadeInDuration, // Duration of fade in milliseconds
      ease: 'Linear', // Linear easing for smooth fade
    });

    // Add drag events to the scene
    this.scene.input.on('dragstart', (_pointer: Pointer, card: Card) => {
      if (isValidMove(scene as Main, card, this)) {
        updateGraphics(0x22c55e, 0.5);
      }
    });

    this.scene.input.on('drop', async (pointer: Pointer, card: Card, cardSlot: CardSlot) => {
      if (isValidMove(scene as Main, card, cardSlot) && cardSlot === this) {
        this.scene.input.enabled = false;
        await (this.scene as Main).evaluateMoveHandler(card, cardSlot);
      }
    });

    this.scene.input.on('dragend', (_pointer: Pointer) => {
      updateGraphics(lineColor, 0.25);
    });

    // Drop zone events
    this.scene.input.on('dragenter', (_pointer: Pointer, card: Card, cardSlot: CardSlot) => {
      if (isValidMove(scene as Main, card, cardSlot) && cardSlot === this) {
        updateGraphics(0xffffff, 1);
      }
    });

    this.scene.input.on('dragleave', (_pointer: Pointer, card: Card, cardSlot: CardSlot) => {
      if (isValidMove(scene as Main, card, cardSlot) && cardSlot === this) {
        updateGraphics(0x22c55e, 0.5);
      }
    });
  }
}
