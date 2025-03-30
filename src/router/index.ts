import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Lobby',
      component: () => import('../views/LobbyView.vue')
    },
    {
      path: '/game/:roomId',
      name: 'Game',
      component: () => import('../views/GameView.vue')
    }
  ]
})

export default router 