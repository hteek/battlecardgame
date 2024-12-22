import * as phaser from 'phaser';
import { cardGap, cardSize, centerX } from '~/game/constants';
import { CardSlot, type CardSlotType } from '~/game/objects/cardSlot';

export class CardSlotGroup extends phaser.GameObjects.Group {
  constructor(scene: phaser.Scene, y: number, type: CardSlotType) {
    super(scene);
    scene.add.existing(this);

    const startX = centerX - 1.5 * (cardSize + cardGap);

    for (let i = 0; i < 5; i++) {
      this.add(new CardSlot(scene, startX + i * (cardSize + cardGap), y, type, i));
    }
  }

  get emptySlot(): CardSlot | undefined {
    return (this.getChildren() as CardSlot[]).find((child) => !child.hasCard);
  }
}
