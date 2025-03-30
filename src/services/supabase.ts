import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function createGameRoom() {
  const { data, error } = await supabase
    .from('game_rooms')
    .insert([{ status: 'lobby' }])
    .select()
  
  if (error) throw error
  return data[0]
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

export function subscribeToGameRoom(roomId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`room:${roomId}`)
    .on('broadcast', { event: 'game_update' }, callback)
    .subscribe()
} 