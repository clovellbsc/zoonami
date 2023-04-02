import MainScene from './scenes/MainScene.js'
import BattleScene from './scenes/BattleScene.js'

var config = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  width: 320,
  height: 320,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [MainScene, BattleScene],
  scale: {
    zoom: 2,
  },
}

var game = new Phaser.Game(config)
