<template>
  <div class="lobby">
    <h1>BlightStorm</h1>
    <div class="lobby-actions">
      <div v-if="!roomId">
        <div class="mode-selection">
          <button @click="createNewRoom('single')">Single Player</button>
          <button @click="createNewRoom('multi')">Multiplayer</button>
        </div>
      </div>
      <div v-else>
        <h2>Room Code: {{ roomId }}</h2>
        <p v-if="gameMode === 'multi'">Share this code with other players to join!</p>
        <button @click="startGame" :disabled="gameMode === 'multi' && players.length < 2">Start Game</button>
      </div>
      <div class="join-room" v-if="gameMode === 'multi'">
        <input 
          v-model="joinCode" 
          placeholder="Enter room code" 
          @keyup.enter="joinRoom"
        />
        <button @click="joinRoom" :disabled="!isValidRoomCode">Join Room</button>
      </div>
    </div>
    <div v-if="roomId" class="players-list">
      <h3>Players in Room:</h3>
      <ul>
        <li v-for="player in players" :key="player.id">
          {{ player.name || 'Player ' + player.id.slice(0, 4) }}
        </li>
      </ul>
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { createGameRoom, joinGameRoom, subscribeToGameRoom, testSupabaseConnection } from '../services/supabase'

const router = useRouter()
const gameStore = useGameStore()
const joinCode = ref('')
const subscription = ref<any>(null)
const error = ref<string>('')
const gameMode = ref<'single' | 'multi'>('multi')

const { roomId, players, setRoomId } = gameStore

// Validate room code format (UUID)
const isValidRoomCode = computed(() => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(joinCode.value)
})

async function createNewRoom(mode: 'single' | 'multi') {
  try {
    error.value = ''
    gameMode.value = mode
    const room = await createGameRoom(mode)
    setRoomId(room.id)
    setupRoomSubscription(room.id)
  } catch (err) {
    console.error('Error creating room:', err)
    error.value = 'Failed to create room. Please try again.'
  }
}

async function joinRoom() {
  try {
    error.value = ''
    if (!isValidRoomCode.value) {
      error.value = 'Please enter a valid room code'
      return
    }
    gameMode.value = 'multi'
    const room = await joinGameRoom(joinCode.value)
    setRoomId(room.id)
    setupRoomSubscription(room.id)
  } catch (err) {
    console.error('Error joining room:', err)
    error.value = 'Failed to join room. Please check the room code and try again.'
  }
}

function setupRoomSubscription(roomId: string) {
  subscription.value = subscribeToGameRoom(roomId, (payload) => {
    const { players } = payload
    gameStore.players = players
  })
}

function startGame() {
  if (roomId) {
    router.push(`/game/${roomId}`)
  }
}

onMounted(async () => {
  const isConnected = await testSupabaseConnection()
  if (!isConnected) {
    error.value = 'Failed to connect to game server. Please try again later.'
  }
})

onUnmounted(() => {
  if (subscription.value) {
    subscription.value.unsubscribe()
  }
})
</script>

<style scoped>
.lobby {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.lobby-actions {
  margin: 2rem 0;
}

.join-room {
  margin-top: 1rem;
}

.join-room input {
  padding: 0.5rem;
  margin-right: 0.5rem;
  width: 300px;
}

button {
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.players-list {
  margin-top: 2rem;
  text-align: left;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.error-message {
  color: #ff4444;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #ffebee;
  border-radius: 4px;
  display: inline-block;
}

.mode-selection {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.mode-selection button {
  min-width: 150px;
}
</style> 