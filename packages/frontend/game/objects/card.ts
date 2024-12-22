import type * as phaser from 'phaser';
import type { Scene } from 'phaser';

import { cardScale, cardSize } from '~/game/constants';
import type { CardProps, CardPropsType } from '~/game/cards';
import type { CardSlot } from '~/game/objects/cardSlot';
import Container = Phaser.GameObjects.Container;
import Pointer = Phaser.Input.Pointer;

export class Card extends Container {
  readonly cardInfoHitpoints: phaser.GameObjects.Text;
  readonly cardInfoAttack: phaser.GameObjects.Text;
  readonly cardInfoDefense: phaser.GameObjects.Text;

  readonly cardImage: phaser.GameObjects.Image;

  private readonly _cardType: CardPropsType;
  private _cardSlot: CardSlot;

  readonly _attack: number;
  readonly _defense: number;
  readonly _texture: string;
  _hitPoints: number;

  get cardSlot() {
    return this._cardSlot;
  }

  set cardSlot(value) {
    this._cardSlot = value;
  }

  get cardType() {
    return this._cardType;
  }

  get attackValue() {
    return this._attack;
  }

  get isDead() {
    return this._hitPoints <= 0;
  }

  get cardName() {
    return this._texture;
  }

  constructor(scene: Scene, x: number, y: number, cardProps: CardProps, isInteractive: boolean) {
    super(scene, x, y);

    const { attack, defense, hitPoints, texture, type } = cardProps;
    this.cardImage = scene.add.image(0, 0, `card-${texture}`).setScale(cardScale).setDepth(100);
    this._cardType = type;
    this._attack = attack ?? 0;
    this._defense = defense ?? 0;
    this._hitPoints = hitPoints ?? 0;
    this._texture = texture;

    this.cardInfoHitpoints = scene.add
      .text(0, cardSize / 2 - 18, `${hitPoints ?? ''}`, {
        fontFamily: 'Arial Black',
        fontSize: 20,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(150);

    this.cardInfoAttack = scene.add
      .text(-cardSize / 2 + 16, -cardSize / 2 + 18, `${attack && attack > 0 ? attack : ''}`, {
        fontFamily: 'Arial Black',
        fontSize: 16,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 5,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(150);

    this.cardInfoDefense = scene.add
      .text(cardSize / 2 - 16, -cardSize / 2 + 18, `${defense ?? ''}`, {
        fontFamily: 'Arial Black',
        fontSize: 16,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 5,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(150);

    this.setSize(cardSize, cardSize);
    this.add([this.cardImage, this.cardInfoAttack, this.cardInfoDefense, this.cardInfoHitpoints]);

    if (isInteractive) {
      // Make the container interactive
      //this.setInteractive(new Phaser.Geom.Rectangle(0, 0, cardSize, cardSize), Phaser.Geom.Rectangle.Contains);
      this.setInteractive({
        useHandCursor: true, // Shows pointer cursor on hover
        cursor: 'grab', // Shows grab cursor on hover
      });
      // Enable drag if needed
      scene.input.setDraggable(this);

      // Add drag events
      this.scene.input.on('dragstart', (pointer: Pointer, card: Card) => {
        if (card === this) {
          this.scene.tweens.add({
            targets: card,
            scale: 1.1, // Scale up by 10%
            duration: 250,
            ease: 'Back.easeOut',
          });
        }
      });

      this.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        this.x = dragX;
        this.y = dragY;
      });

      this.scene.input.on('dragend', (pointer: Pointer, card: Card) => {
        if (card === this) {
          this.scene.tweens.add({
            targets: card,
            scale: 1, // Return to original scale
            duration: 250,
            ease: 'Back.easeIn',
          });
          scene.tweens.add({
            targets: this,
            x: this._cardSlot.x,
            y: this._cardSlot.y,
            duration: 250,
            ease: 'Power2',
          });
        }
      });
    }

    scene.add.existing(this);
  }

  attack(target: CardSlot) {
    if (target.hasCard) {
      const { attackValue } = target.card!;
      if (attackValue < 0) {
        this._hitPoints = 0;
      } else {
        const damage = attackValue - this._defense;
        if (damage > 0) {
          this._hitPoints -= damage;
        }
      }
      this.cardInfoHitpoints.setText(`${this._hitPoints}`);
    }
  }

  move(to: CardSlot) {
    this.cardSlot.card = undefined;
    to.card = this;

    this.scene.tweens.add({
      targets: this,
      x: to.x,
      y: to.y,
      duration: 300, // milliseconds
      ease: 'Power2',
    });
  }

  override destroy() {
    this.cardSlot.card = undefined;
    super.destroy();
  }
}
