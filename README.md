# BlightStorm

A multiplayer top-down shooter game built with Vue 3, Phaser, and Supabase.

## Features

- Real-time multiplayer gameplay
- Room-based matchmaking system
- Top-down shooter mechanics
- Player movement with WASD keys
- Mouse aiming and shooting

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

```bash
npm run build
```

## Technologies Used

- Vue 3
- TypeScript
- Phaser.js
- Supabase
- Vite
- Pinia (State Management)
- Vue Router

## License

MIT
