import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const roomId = ref<string | null>(null)
  const players = ref<any[]>([])
  const gameState = ref<'lobby' | 'playing' | 'ended'>('lobby')
  const currentPlayer = ref<any>(null)

  function setRoomId(id: string) {
    roomId.value = id
  }

  function addPlayer(player: any) {
    players.value.push(player)
  }

  function removePlayer(playerId: string) {
    players.value = players.value.filter(p => p.id !== playerId)
  }

  function setCurrentPlayer(player: any) {
    currentPlayer.value = player
  }

  function updateGameState(state: 'lobby' | 'playing' | 'ended') {
    gameState.value = state
  }

  return {
    roomId,
    players,
    gameState,
    currentPlayer,
    setRoomId,
    addPlayer,
    removePlayer,
    setCurrentPlayer,
    updateGameState
  }
}) 