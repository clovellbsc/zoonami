export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' })
  }

  preload() {
    const { battleBackground, monster } = this.battleInfo
    console.log(monster.name, battleBackground.fileLocation)

    // Remove previously loaded assets
    this.textures.remove('background')
    this.textures.remove('monster')

    this.load.image(
      'background',
      `/public/assets/battle-backgrounds/${battleBackground.fileLocation}`
    )
    this.load.image(
      'monster',
      `/public/assets/monsters/zoonami_${monster.name}_front.png`
    )
    this.load.spritesheet(
      'animation',
      '/public/assets/battle-animations/zoonami_battle_intro_animation.png',
      { frameWidth: 159, frameHeight: 159, endFrame: 7 }
    )
    // Load images for animation
    this.load.spritesheet(
      'charmander',
      '/public/assets/charmander-animation/spritesheet.png',
      { frameWidth: 216, frameHeight: 237, endFrame: 8 }
    )
  }

  setBattleInfo(monster, battleBackgrounds) {
    const battleBackground = battleBackgrounds.find(
      (b) => b.name === monster.battleBackground
    )

    this.battleInfo = {
      monster: monster,
      battleBackground: battleBackground,
    }

    this.selectedOptionIndex = 0 // Reset the selected option index
  }

  create() {
    const { battleBackground, monster } = this.battleInfo
    this.selectedOptionIndex = 0

    const { playerPosition } = this.scene.settings.data
    console.log(playerPosition)

    // Add background image
    const background = this.add.sprite(0, 0, 'background')
    background.setOrigin(0, 0)
    background.setScale(2)

    // Add monster sprite
    const monsterSprite = this.add.sprite(240, 70, 'monster')
    monsterSprite.setScale(2)

    // Add monster health text
    const monsterHealthText = this.add.text(10, 10, 'Health:', {
      fontSize: '10px',
      color: '#000',
    })

    // Add monster health bar
    const monsterHealthBar = this.add.graphics()
    let monsterHealthBarWidth = monster.health
    monsterHealthBar.fillStyle(0xff0000, 1)
    monsterHealthBar.fillRect(70, 10, monsterHealthBarWidth, 10)

    // Add animation sprite
    const animationSprite = this.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'animation'
    )
    animationSprite.setScale(2)

    // Create animation frames
    const frames = this.anims.generateFrameNumbers('animation', {
      start: 0,
      end: 7,
    })

    // Create animation
    const animation = this.anims.create({
      key: 'playAnimation',
      frames,
      frameRate: 8,
      repeat: 0,
    })

    // Play animation
    animationSprite.play('playAnimation')

    // Cleanup animation
    animationSprite.on('animationcomplete', () => {
      // Stop animation and destroy sprite
      animationSprite.anims.stop()
      animationSprite.destroy()

      // Add charmander animation sprite
      const charmanderSprite = this.add.sprite(80, 180, 'charmander')
      charmanderSprite.setScale(0.5)

      const charmanderHealthText = this.add.text(140, 150, 'Health:', {
        fontSize: '10px',
        color: '#000',
      })
      charmanderHealthText.setDepth(1)

      // Add charmander health bar
      const charmanderHealthBar = this.add.graphics()
      charmanderHealthBar.fillStyle(0xff0000, 1)
      charmanderHealthBar.fillRect(200, 150, 100, 10)

      // Add battle menu
      this.battleMenu = this.add.container(140, 170)

      this.battleMenuOptions = ['Attack', 'Catch', 'Run']
      this.selectedOptionIndex = 0

      this.menuOptionTexts = []
      this.battleMenuOptions.forEach((optionText, index) => {
        const optionTextObject = this.add.text(0, index * 10, optionText, {
          fontSize: '10px',
          color: index === this.selectedOptionIndex ? '#f00' : '#000',
        })
        this.battleMenu.add(optionTextObject)
        this.menuOptionTexts.push(optionTextObject)
      })

      this.arrow = this.add.text(-5, this.selectedOptionIndex * 10, '>', {
        fontSize: '10px',
        color: '#f00',
      })
      this.battleMenu.add(this.arrow)

      // Create keyboard input handler
      const cursors = this.input.keyboard.createCursorKeys()
      cursors.down.on('down', () => {
        // Move arrow down and update selected option index
        if (this.selectedOptionIndex < this.battleMenuOptions.length - 1) {
          this.arrow.setY(this.arrow.y + 10)
          this.selectedOptionIndex++
        }
        // Update menu option text colors based on selected option index
        this.menuOptionTexts.forEach((optionText, index) => {
          optionText.setColor(
            index === this.selectedOptionIndex ? '#f00' : '#000'
          )
        })
      })
      cursors.up.on('down', () => {
        // Move arrow up and update selected option index
        if (this.selectedOptionIndex > 0) {
          this.arrow.setY(this.arrow.y - 10)
          this.selectedOptionIndex--
        }
        // Update menu option text colors based on selected option index
        this.menuOptionTexts.forEach((optionText, index) => {
          optionText.setColor(
            index === this.selectedOptionIndex ? '#f00' : '#000'
          )
        })
      })
      cursors.space.on('down', () => {
        // Trigger selected option action here
        if (this.battleMenuOptions[this.selectedOptionIndex] === 'Run') {
          this.scene.stop('BattleScene')
          this.scene.start('MainScene', {
            playerPosition: playerPosition,
          })
        }
        if (this.battleMenuOptions[this.selectedOptionIndex] === 'Attack') {
          monsterHealthBarWidth -= 10 // Reduce width of monsterHealthBar by 10px
          if (monsterHealthBarWidth === 0) {
            this.scene.stop('BattleScene')
            this.scene.start('MainScene', {
              playerPosition: playerPosition,
            })
          }
          monsterHealthBar.clear() // Clear the previous rectangle
          monsterHealthBar.fillStyle(0xff0000, 1)
          monsterHealthBar.fillRect(70, 10, monsterHealthBarWidth, 10) // Draw new rectangle with updated width
        }
        console.log(
          `Selected option: ${this.battleMenuOptions[this.selectedOptionIndex]}`
        )
      })

      // Create charmander animation frames
      const charmanderFrames = this.anims.generateFrameNumbers('charmander', {
        start: 0,
        end: 8,
      })

      // Create charmander animation
      const charmanderAnimation = this.anims.create({
        key: 'charmanderAnimation',
        frames: charmanderFrames,
        frameRate: 8,
        repeat: 0,
      })

      // Play charmander animation
      charmanderSprite.play('charmanderAnimation')

      // Show first frame of charmander sprite sheet at the end of the animation
      charmanderSprite.on('animationcomplete', () => {
        charmanderSprite.setFrame(0)
      })
    })
  }

  unload() {
    // Unload images
    this.textures.remove('background')
    this.textures.remove('monster')
    this.textures.remove('animation')
    this.textures.remove('charmander')

    // Call parent unload method
    super.unload()
  }

  destroy() {
    this.input.keyboard.removeKey('down')
  }

  shutdown() {
    // Remove loaded images and spritesheets
    this.textures.remove('background')
    this.textures.remove('monster')
    this.textures.remove('animation')
    this.textures.remove('charmander')

    // Remove monster sprite and health text
    this.children.remove(this.monsterSprite)
    this.children.remove(this.monsterHealthText)
    this.children.remove(this.monsterHealthBar)

    // Remove charmander sprite and health text
    this.children.remove(this.charmanderSprite)
    this.children.remove(this.charmanderHealthText)
    this.children.remove(this.charmanderHealthBar)

    // Remove battle menu and arrow
    this.children.remove(this.battleMenu)
    this.children.remove(this.arrow)

    // Reset selected option index
    this.selectedOptionIndex = 0
    this.battleMenuOptions = ['Attack', 'Catch', 'Run']

    // Reset menuOptionTexts
    this.menuOptionTexts.forEach((optionText) => {
      optionText.destroy()
    })
    this.menuOptionTexts = []
  }
}
