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
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  scale: {
    zoom: 2,
  },
}

var game = new Phaser.Game(config)

var player
var cursors
var map
var tileset
var layer
var facingDirection = 'down'

function preload() {
  console.log('preload')
  // Load assets here
  this.load.setBaseURL('http://localhost:5500/public/assets/')
  this.load.tilemapTiledJSON('map', 'newmap.json')
  this.load.image('tiles', 'Tileset.png')
  this.load.spritesheet('player', 'spritesheet.png', {
    frameWidth: 16,
    frameHeight: 20,
  })
  this.load.image('burrlock', 'monsters/zoonami_burrlock_front.png')
  this.load.image('chickadee', 'monsters/zoonami_chickadee_front.png')
  this.load.image('fuzall', 'monsters/zoonami_fuzall_front.png')
  this.load.image('grimlit', 'monsters/zoonami_grimlit_front.png')
  this.load.image('howler', 'monsters/zoonami_howler_front.png')
  this.load.image('kackaburr', 'monsters/zoonami_kackaburr_front.png')
  this.load.image('maluga', 'monsters/zoonami_maluga_front.png')
  this.load.image('merin', 'monsters/zoonami_merin_front.png')
  this.load.image('ruffalo', 'monsters/zoonami_ruffalo_front.png')
  this.load.image('scallapod', 'monsters/zoonami_scallapod_front.png')
  this.load.image('spaero', 'monsters/zoonami_spaero_front.png')
}

function create() {
  // Set up game objects and logic here
  map = this.make.tilemap({ key: 'map' })
  tileset = map.addTilesetImage('RPG_Tileset', 'tiles')
  layer = map.createLayer('items', tileset, 0, 0)

  // Set up tileset collision
  map.setCollisionByProperty({ collides: true })

  // Add player sprite
  player = this.physics.add.sprite(64, 32, 'player').setSize(16, 16)
  player.setOrigin(0.5, 1)
  player.setDepth(2)

  // Add monster sprites
  const burrlock = this.add.sprite(535, 1140, 'burrlock')
  burrlock.setScale(0.5)
  burrlock.setDepth(2)
  const chickadee = this.add.sprite(475, 470, 'chickadee')
  chickadee.setScale(0.5)
  chickadee.setDepth(2)
  const fuzall = this.add.sprite(420, 660, 'fuzall')
  fuzall.setScale(0.5)
  fuzall.setDepth(2)
  const grimlit = this.add.sprite(250, 870, 'grimlit')
  grimlit.setScale(0.5)
  grimlit.setDepth(2)
  const howler = this.add.sprite(50, 1000, 'howler')
  howler.setScale(0.5)
  howler.setDepth(2)
  const kickaburr = this.add.sprite(500, 50, 'kackaburr')
  kickaburr.setScale(0.5)
  kickaburr.setDepth(2)
  const maluga = this.add.sprite(800, 1530, 'maluga')
  maluga.setScale(0.5)
  maluga.setDepth(2)
  const merin = this.add.sprite(570, 300, 'merin')
  merin.setScale(0.5)
  merin.setDepth(2)
  const ruffalo = this.add.sprite(292, 420, 'ruffalo')
  ruffalo.setScale(0.5)
  ruffalo.setDepth(2)
  const scallapod = this.add.sprite(150, 1480, 'scallapod')
  scallapod.setScale(0.5)
  scallapod.setDepth(2)
  const spaero = this.add.sprite(120, 1030, 'spaero')
  spaero.setScale(0.4)
  spaero.setDepth(2)

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

function update(time, delta) {
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
}
