import * as phaser from 'phaser';

import { Boot, Main, Preloader } from './scenes';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  type: phaser.AUTO,
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 1024,
  },
  transparent: true,
  scene: [Boot, Preloader, Main],
};

export const createGame = (parent: string) => new phaser.Game({ ...config, parent });
