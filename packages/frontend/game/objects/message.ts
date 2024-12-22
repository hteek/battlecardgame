import type { Scene } from 'phaser';
import { cardSlotFadeInDuration, height, playerGridDelay, width } from '~/game/constants';
import { EventBus, GameEvents } from '~/game/eventBus';
import Text = Phaser.GameObjects.Text;

export class Message extends Text {
  constructor(scene: Scene, message: string) {
    super(scene, width / 2, height / 2, message, {
      fontFamily: 'Arial Black',
      fontSize: 24,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 8,
      align: 'center',
    });

    this.setAlpha(0);
    this.setOrigin(0.5);
    this.setDepth(100);

    EventBus.on(GameEvents.MESSAGE, this.handleMessageEvent, this);

    scene.time.delayedCall(playerGridDelay, () => {
      scene.tweens.add({
        targets: this,
        alpha: 1, // Fade to fully visible
        duration: cardSlotFadeInDuration, // Duration of fade in milliseconds
        ease: 'Linear', // Linear easing for smooth fade
      });
    });
  }

  handleMessageEvent(message: string) {
    this.setText(message);
  }

  protected override preDestroy() {
    EventBus.off(GameEvents.MESSAGE, this.handleMessageEvent, this);
    super.preDestroy();
  }
}
