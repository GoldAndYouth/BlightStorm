import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Initializing Supabase client with URL:', supabaseUrl)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
console.log('Supabase client created successfully')

// Test function to verify connection
export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    const { data, error } = await supabase.from('game_rooms').select('count').limit(1)
    if (error) {
      console.error('Supabase connection test failed:', error)
      throw error
    }
    console.log('Supabase connection successful:', data)
    return true
  } catch (error) {
    console.error('Supabase connection failed:', error)
    return false
  }
}

export async function createGameRoom(mode: 'single' | 'multi') {
  console.log('Creating game room with mode:', mode)
  try {
    const { data, error } = await supabase
      .from('game_rooms')
      .insert([{ status: 'lobby', mode }])
      .select()
    
    if (error) {
      console.error('Supabase error creating room:', error)
      throw error
    }
    console.log('Room created successfully:', data)
    return data[0]
  } catch (error) {
    console.error('Error in createGameRoom:', error)
    throw error
  }
}

export async function joinGameRoom(roomId: string) {
  const { data, error } = await supabase
    .from('game_rooms')
    .select('*')
    .eq('id', roomId)
    .single()
  
  if (error) throw error
  return data
}

export async function createPlayer(roomId: string, name: string) {
  const { data, error } = await supabase
    .from('players')
    .insert([{ room_id: roomId, name }])
    .select()
  
  if (error) throw error
  return data[0]
}

export async function updatePlayerPosition(playerId: string, x: number, y: number) {
  const { data, error } = await supabase
    .from('players')
    .update({ position_x: x, position_y: y })
    .eq('id', playerId)
    .select()
  
  if (error) throw error
  return data[0]
}

export async function getRoomPlayers(roomId: string) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('room_id', roomId)
  
  if (error) throw error
  return data
}

export function subscribeToGameRoom(roomId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`room:${roomId}`)
    .on('broadcast', { event: 'game_update' }, callback)
    .subscribe()
} 