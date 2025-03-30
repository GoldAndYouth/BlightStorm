<template>
  <div class="game-container">
    <div id="game"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import Phaser from 'phaser'
import { subscribeToGameRoom } from '../services/supabase'

const route = useRoute()
const gameStore = useGameStore()
let game: Phaser.Game | null = null
let subscription: any = null

class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private otherPlayers: Map<string, Phaser.GameObjects.Sprite> = new Map()

  constructor() {
    super({ key: 'GameScene' })
  }

  preload() {
    // Load game assets
    this.load.image('player', '/assets/player.svg')
  }

  create() {
    // Create player
    this.player = this.add.sprite(400, 300, 'player')
    
    // Setup input
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys()
    }
    
    // Setup camera to follow player
    this.cameras.main.startFollow(this.player)
  }

  update() {
    // Handle player movement
    const speed = 4
    if (this.cursors.left.isDown) {
      this.player.x -= speed
    }
    if (this.cursors.right.isDown) {
      this.player.x += speed
    }
    if (this.cursors.up.isDown) {
      this.player.y -= speed
    }
    if (this.cursors.down.isDown) {
      this.player.y += speed
    }

    // Update other players positions
    this.otherPlayers.forEach((sprite) => {
      // Update positions based on received data
    })
  }

  addOtherPlayer(id: string, x: number, y: number) {
    const sprite = this.add.sprite(x, y, 'player')
    this.otherPlayers.set(id, sprite)
  }

  removeOtherPlayer(id: string) {
    const sprite = this.otherPlayers.get(id)
    if (sprite) {
      sprite.destroy()
      this.otherPlayers.delete(id)
    }
  }
}

onMounted(() => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: GameScene
  }

  game = new Phaser.Game(config)

  // Subscribe to game updates
  const roomId = route.params.roomId as string
  subscription = subscribeToGameRoom(roomId, (payload) => {
    // Handle game updates
    const { players } = payload
    gameStore.players = players
  })
})

onUnmounted(() => {
  if (game) {
    game.destroy(true)
  }
  if (subscription) {
    subscription.unsubscribe()
  }
})
</script>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
}

#game {
  width: 800px;
  height: 600px;
  border: 2px solid #333;
}
</style> 