import { defineStore } from 'pinia';
import api from '@/utils/axios';

interface User {
  id?: number;
  username: string;
  email: string;
  role?: string;
  avatar?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isLoading: false,
    error: null as Error | null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.user,
    userInitials: (state) => {
      if (!state.user || !state.user.username) return '';
      return state.user.username.charAt(0).toUpperCase();
    },
    userAvatar: (state) => state.user?.avatar || '',
    userName: (state) => state.user?.username || ''
  },
  
  actions: {
    async login(email: string, password: string) {
      this.isLoading = true;
      try {
        const res = await api.post('/auth/login', { email, password }, {
          withCredentials: true
        });
        this.user = res.data.user;
        this.error = null;
        return true;
      } catch (error) {
        console.error(error);
        this.error = error as Error;
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    async logout() {
      this.isLoading = true;
      try {
        await api.post('/auth/logout', {}, {
          withCredentials: true
        });
        this.user = null;
        this.error = null;
        return true;
      } catch (error) {
        console.error(error);
        this.error = error as Error;
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchProfile() {
      this.isLoading = true;
      try {
        const res = await api.get('/auth/me', {
          withCredentials: true
        });
        this.user = res.data;
        this.error = null;
        return res.data;
      } catch (error) {
        console.error(error);
        this.error = error as Error;
        this.user = null;
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    async checkAuthStatus() {
      if (this.user) return this.user;
      return await this.fetchProfile();
    },
    
    async googleLogin(token: string) {
      this.isLoading = true;
      try {
        const res = await api.post('/auth/google', { token }, {
          withCredentials: true
        });
        this.user = res.data.user;
        this.error = null;
        return true;
      } catch (error) {
        console.error(error);
        this.error = error as Error;
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Add this method to update user avatar
    updateUserAvatar(avatarUrl: string) {
      if (this.user) {
        this.user.avatar = avatarUrl;
      }
    }
  }
});