import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/LoginView.vue'
import Home from '../views/HomeView.vue'
import Register from '../views/RegisterView.vue'
import AddMembersView from '@/views/AddMembersView.vue'
import ProfileView from '@/views/ProfileView.vue'
import EventView from '@/views/EventView.vue'
import EventDetails from '@/views/EventDetails.vue'
import api from '@/utils/axios'
import NoteListView from '@/views/NoteListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    { 
      path: '/login', 
      component: Login,
      meta: { requiresGuest: true } 
    },
    { 
      path: '/register', 
      component: Register,
      meta: { requiresGuest: true } 
    },
    { 
      path: '/add-member', 
      name: 'add-member', 
      component: AddMembersView,
      meta: { requiresAuth: true }
    },
    {
      path: '/userlisttest',
      name: 'userlisttest',
      component: () => import('../views/UserlistTestView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/auth/google/callback',
      name: 'GoogleCallback',
      component: () => import('../views/GoogleView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/events',
      name: 'events',
      component: EventView,
    },
    {
      path: '/event-details/:id',
      name: 'event-details',
      component: EventDetails,
    },
    {
      path: '/notes-list/:id',
      name: 'notes-list',
      component: NoteListView,
      meta: { requiresAuth: true }
      
    }

  ],
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Check if route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  // Check if route requires guest (non-authenticated user)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  try {
    // Check authentication status
    const response = await api.get('/auth/me', {
      withCredentials: true
    })
    
    const isLoggedIn = !!response.data
    
    // Handle authentication requirements
    if (requiresAuth && !isLoggedIn) {
      // If route requires auth but user is not logged in
      next('/login')
    } else if (requiresGuest && isLoggedIn) {
      // If route requires guest but user is logged in
      next('/')
    } else {
      // Otherwise proceed normally
      next()
    }
  } catch{
    // User is not logged in
    if (requiresAuth) {
      // Redirect to login if route requires authentication
      next('/login')
    } else {
      // Otherwise proceed
      next()
    }
  }
})

export default router