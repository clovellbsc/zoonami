var player
var cursors
var map
var tileset
var layer
var facingDirection = 'down'
var monsters = [
  {
    x: 535,
    y: 1140,
    name: 'burrlock',
    scale: 0.5,
    battleBackground: 'grassland',
    health: 100,
  },
  {
    x: 475,
    y: 470,
    name: 'chickadee',
    scale: 0.5,
    battleBackground: 'grassland',
    health: 100,
  },
  {
    x: 420,
    y: 660,
    name: 'fuzall',
    scale: 0.5,
    battleBackground: 'grassland',
    health: 100,
  },
  {
    x: 250,
    y: 870,
    name: 'grimlit',
    scale: 0.5,
    battleBackground: 'snowy',
    health: 100,
  },
  {
    x: 50,
    y: 1000,
    name: 'howler',
    scale: 0.5,
    battleBackground: 'forest',
    health: 100,
  },
  {
    x: 500,
    y: 50,
    name: 'kackaburr',
    scale: 0.5,
    battleBackground: 'desert',
    health: 100,
  },
  {
    x: 800,
    y: 1530,
    name: 'maluga',
    scale: 0.5,
    battleBackground: 'underwater',
    health: 100,
  },
  {
    x: 570,
    y: 300,
    name: 'merin',
    scale: 0.5,
    battleBackground: 'desert',
    health: 100,
  },
  {
    x: 292,
    y: 420,
    name: 'ruffalo',
    scale: 0.5,
    battleBackground: 'underground',
    health: 100,
  },
  {
    x: 150,
    y: 1480,
    name: 'scallapod',
    scale: 0.5,
    battleBackground: 'beach',
    health: 100,
  },
  {
    x: 120,
    y: 1030,
    name: 'spaero',
    scale: 0.4,
    battleBackground: 'forest',
    health: 100,
  },
]
var battleBackgrounds = [
  { name: 'beach', fileLocation: 'zoonami_beach_background.png' },
  { name: 'desert', fileLocation: 'zoonami_desert_background.png' },
  { name: 'forest', fileLocation: 'zoonami_forest_background.png' },
  { name: 'grassland', fileLocation: 'zoonami_grassland_background.png' },
  { name: 'snowy', fileLocation: 'zoonami_snowy_background.png' },
  { name: 'underground', fileLocation: 'zoonami_underground_background.png' },
  { name: 'underwater', fileLocation: 'zoonami_underwater_background.png' },
]

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' })
  }

  preload() {
    console.log('preload')
    // Load assets here
    this.load.setBaseURL('http://localhost:5500/public/assets/')
    this.load.tilemapTiledJSON('map', 'map.json')
    this.load.image('tiles', 'Tileset.png')
    this.load.spritesheet('player', 'spritesheet.png', {
      frameWidth: 16,
      frameHeight: 20,
    })
    monsters.forEach((monster) => {
      this.load.image(
        monster.name,
        `monsters/zoonami_${monster.name}_front.png`
      )
    })
    battleBackgrounds.forEach((battleBackground) => {
      this.load.image(
        battleBackground.name,
        `battle-backgrounds/${battleBackground.fileLocation}`
      )
    })
  }

  create() {
    if (Object.keys(this.scene.settings.data).length > 0) {
      console.log(this.scene.settings.data)
      this.playerPosition = {
        x: this.scene.settings.data.playerPosition.x - 1,
        y: this.scene.settings.data.playerPosition.y + 1,
      }
    }

    // Set up game objects and logic here
    map = this.make.tilemap({ key: 'map' })
    tileset = map.addTilesetImage('RPG_Tileset', 'tiles')
    layer = map.createLayer('items', tileset, 0, 0)

    // Set up tileset collision
    map.setCollisionByProperty({ collides: true })

    // Add player sprite
    if (!this.playerPosition) {
      this.playerPosition = { x: 64, y: 32 }
    }
    player = this.physics.add
      .sprite(this.playerPosition.x, this.playerPosition.y, 'player')
      .setSize(16, 16)
    player.setOrigin(0.5, 1)
    player.setDepth(3)

    // Add monster sprites
    monsters.forEach((monster) => {
      const newMonster = this.add.sprite(monster.x, monster.y, monster.name)
      newMonster.setScale(monster.scale)
      newMonster.setDepth(2)
      this.physics.add.existing(newMonster)
      this.physics.add.collider(player, newMonster, () => {
        // Call the enterBattle function and pass the monster object as an argument
        this.enterBattle.call(this, monster, player)
      })
      newMonster.body.setImmovable() // Set the monster's body as immovable
      newMonster.body.setCollideWorldBounds() // Set the monster's body to collide with the world bounds
    })

    // Set up camera to follow player and stay within bounds of the map
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(player)
    this.cameras.main.roundPixels = true

    // Set up world bounds for physics system
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

    // Enable physics on player sprite
    player.setCollideWorldBounds(true)
    this.physics.add.collider(player, layer)

    // Set up keyboard input
    cursors = this.input.keyboard.createCursorKeys()

    // Create Idle animations for each direction
    const idleDownFrames = this.anims.generateFrameNumbers('player', {
      frames: [0],
    })
    const idleUpFrames = this.anims.generateFrameNumbers('player', {
      frames: [4],
    })
    const idleLeftFrames = this.anims.generateFrameNumbers('player', {
      frames: [8],
    })
    const idleRightFrames = this.anims.generateFrameNumbers('player', {
      frames: [12],
    })

    this.anims.create({
      key: 'idle-down',
      frames: idleDownFrames,
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'idle-up',
      frames: idleUpFrames,
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'idle-left',
      frames: idleLeftFrames,
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'idle-right',
      frames: idleRightFrames,
      frameRate: 10,
      repeat: -1,
    })

    // Create walking animations for each direction
    const walkingDownFrames = this.anims.generateFrameNumbers('player', {
      frames: [0, 1, 2, 3],
    })
    const walkingUpFrames = this.anims.generateFrameNumbers('player', {
      frames: [4, 5, 6, 7],
    })
    const walkingLeftFrames = this.anims.generateFrameNumbers('player', {
      frames: [8, 9, 10, 11],
    })
    const walkingRightFrames = this.anims.generateFrameNumbers('player', {
      frames: [12, 13, 14, 15],
    })

    this.anims.create({
      key: 'walk-down',
      frames: walkingDownFrames,
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'walk-up',
      frames: walkingUpFrames,
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'walk-left',
      frames: walkingLeftFrames,
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'walk-right',
      frames: walkingRightFrames,
      frameRate: 10,
      repeat: -1,
    })
  }

  update(time, delta) {
    // Update game state here
    const playerSpeed = 100

    // Move the player sprite with arrow keys
    if (cursors.left.isDown) {
      player.body.velocity.x = -playerSpeed
      player.anims.play('walk-left', true)
      facingDirection = 'left'
    } else if (cursors.right.isDown) {
      player.body.velocity.x = playerSpeed
      player.anims.play('walk-right', true)
      facingDirection = 'right'
    } else {
      player.body.velocity.x = 0
    }

    if (cursors.up.isDown) {
      player.body.velocity.y = -playerSpeed
      player.anims.play('walk-up', true)
      facingDirection = 'up'
    } else if (cursors.down.isDown) {
      player.body.velocity.y = playerSpeed
      player.anims.play('walk-down', true)
      facingDirection = 'down'
    } else {
      player.body.velocity.y = 0
    }

    // If the player is not moving horizontally or vertically, play the idle animation
    if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
      player.anims.play('idle-' + facingDirection, true)
    }

    // Clamp camera position to game world bounds
    const camera = this.cameras.main
    const map = this.make.tilemap({ key: 'map' })
    const { width: mapWidth, height: mapHeight } = map
    const { width: worldWidth, height: worldHeight } = layer
    const tileWidth = map.tileWidth
    const tileHeight = map.tileHeight
    const halfWidth = camera.width / 2
    const halfHeight = camera.height / 2
    const left = halfWidth
    const right = mapWidth * tileWidth - halfWidth
    const top = halfHeight
    const bottom = mapHeight * tileHeight - halfHeight

    const clampXPosition = Phaser.Math.Clamp(player.x, left, right)
    const clampYPosition = Phaser.Math.Clamp(player.y, top, bottom)

    camera.scrollX = clampXPosition - halfWidth
    camera.scrollY = clampYPosition - halfHeight

    // Check for collision between player and monsters
    monsters.forEach((monster) => {
      this.physics.add.overlap(player, monster, () => {
        // Stop player movement
        player.setVelocity(0)
        // Remove monster sprite from the game
        monster.destroy()
      })
    })
  }

  enterBattle(monster, player) {
    // Stop player movement
    player.body.setVelocity(0, 0)
    player.anims.stop()

    // Switch to BattleScene
    this.scene.start('BattleScene', {
      playerPosition: player.body.position,
    })

    // Pass monster and battleBackground information to BattleScene
    this.scene.get('BattleScene').setBattleInfo(monster, battleBackgrounds)

    // Hide the monster sprite in MainScene
    monster.visible = false
  }
}
