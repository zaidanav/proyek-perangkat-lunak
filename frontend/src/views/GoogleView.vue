// Update GoogleView.vue
<template>
  <div class="google-callback">
    <div v-if="loading" class="loading">
      <p>Processing your Google login...</p>
    </div>
    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="redirectToLogin">Back to Login</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/utils/axios';

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const error = ref('');
const authStore = useAuthStore();

const redirectToLogin = () => {
  router.push('/login');
};

onMounted(async () => {
  // Debug code to see what's in the URL
  console.log('Route query parameters:', route.query);
  
  const code = route.query.code as string;
  
  if (!code) {
    console.error('No authorization code found in URL parameters');
    error.value = 'No authorization code provided from Google';
    loading.value = false;
    return;
  }
  
  console.log('Found authorization code');
  
  try {
    // Send code to backend for verification
    console.log('Sending code to backend for verification');
    const response = await api.post('/auth/google/callback', { code }, {
      withCredentials: true
    });
    
    console.log('Google auth successful:', response.data);
    
    // Initialize auth store with user data from response
    if (response.data.user) {
      await authStore.fetchProfile();
    }
    
    router.push('/');
  } catch (err: unknown) {
    console.error('Google auth error:', err);
    
    // Log the error response data to see what the backend is saying
    if (err && typeof err === 'object' && 'response' in err) {
      const errorObj = err as { response?: { data?: { error?: string } } };
      console.error('Backend error response:', errorObj.response?.data);
    }
    
    // Type guard for error with response property
    const isAxiosError = (err: unknown): err is { response?: { data?: { error?: string } } } => {
      return typeof err === 'object' && err !== null && 'response' in err;
    };
    
    error.value = isAxiosError(err) 
      ? err.response?.data?.error || 'Authentication failed. Please try again.'
      : 'Authentication failed. Please try again.';
    loading.value = false;
  }
});
</script>