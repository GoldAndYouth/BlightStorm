<template>
  <div class="lobby">
    <h1>BlightStorm</h1>
    <div class="lobby-actions">
      <div v-if="!roomId">
        <button @click="createNewRoom">Create New Room</button>
      </div>
      <div v-else>
        <h2>Room Code: {{ roomId }}</h2>
        <p>Share this code with other players to join!</p>
        <button @click="startGame" :disabled="players.length < 2">Start Game</button>
      </div>
      <div class="join-room">
        <input v-model="joinCode" placeholder="Enter room code" />
        <button @click="joinRoom" :disabled="!joinCode">Join Room</button>
      </div>
    </div>
    <div v-if="roomId" class="players-list">
      <h3>Players in Room:</h3>
      <ul>
        <li v-for="player in players" :key="player.id">
          {{ player.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { createGameRoom, joinGameRoom, subscribeToGameRoom, testSupabaseConnection } from '../services/supabase'

const router = useRouter()
const gameStore = useGameStore()
const joinCode = ref('')
const subscription = ref<any>(null)

const { roomId, players, setRoomId } = gameStore

async function createNewRoom() {
  try {
    const room = await createGameRoom()
    setRoomId(room.id)
    setupRoomSubscription(room.id)
  } catch (error) {
    console.error('Error creating room:', error)
  }
}

async function joinRoom() {
  try {
    const room = await joinGameRoom(joinCode.value)
    setRoomId(room.id)
    setupRoomSubscription(room.id)
  } catch (error) {
    console.error('Error joining room:', error)
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
    console.error('Failed to connect to Supabase. Please check your environment variables.')
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
</style> 