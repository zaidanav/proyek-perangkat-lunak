<template>
  <div class="h-screen w-screen flex items-center justify-center" :style="{ background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--blue-dark) 100%)' }">
    <div class="w-full max-w-md bg-[var(--primary-white)] rounded-xl shadow-xl overflow-hidden relative mx-4">
      <!-- Tennis ball decoration -->
      <div class="absolute -top-10 -right-10 w-20 h-20 rounded-full" :style="{ background: 'var(--primary-green)', opacity: 0.5 }"></div>
      
      <!-- Back button -->
      <button 
        @click="goBack" 
        class="absolute top-4 left-4 p-2 rounded-full hover:bg-[var(--neutral-200)] transition-colors cursor-pointer"
        :style="{ color: 'var(--primary-blue)' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <!-- Header with logo -->
      <div class="pt-8 pb-6 text-center">
        <div class="inline-flex items-center justify-center">
          <!-- Logo PNG baru disini -->
          <img 
            :src="logoImage" 
            alt="Tennis Community Logo" 
            class="w-20 h-auto object-contain" 
          />
        </div>
        <h1 class="text-xl font-bold mb-1" :style="{ color: 'var(--primary-blue)' }">BEAST</h1>
        <p class="text-sm text-[var(--neutral-800)]">Sign in to your account</p>
      </div>
      
      <!-- Login Form -->
      <div class="px-6 py-4 space-y-4">
        <!-- Error Alert -->
        <div v-if="loginError" class="bg-[var(--neutral-300)] border-l-4 border-[var(--primary-blue)] text-[var(--neutral-800)] px-3 py-2 rounded-md relative mb-4">
          <div class="flex items-center justify-between">
            <p class="text-sm">{{ errorMessage }}</p>
            <button @click="loginError = false" class="text-[var(--neutral-700)] hover:text-[var(--neutral-900)] ml-2">
              <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4 text-[var(--neutral-800)]">
          <div>
            <label for="email" class="block text-sm font-medium mb-1" :style="{ color: 'var(--primary-blue)' }">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              class="w-full px-3 py-2 bg-[var(--neutral-200)] border border-[var(--neutral-400)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--neutral-800)] text-sm"
              placeholder="your@email.com"
              autocomplete="off"
              required
            />
          </div>
          
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="password" class="block text-sm font-medium" :style="{ color: 'var(--primary-blue)' }">Password</label>
              <a href="#" class="text-xs hover:text-[var(--blue-dark)]" :style="{ color: 'var(--primary-blue)' }">Forgot password?</a>
            </div>
            <div class="relative">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="password" 
                class="w-full px-3 py-2 bg-[var(--neutral-200)] border border-[var(--neutral-400)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--neutral-800)] text-sm"
                placeholder="••••••••"
                autocomplete="off"
                required
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--neutral-800)]"
              >
                <svg v-if="showPassword" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
                <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="remember" 
              class="h-4 w-4 focus:ring-[var(--primary-blue)] border-[var(--neutral-400)] rounded cursor-pointer" 
              :style="{ color: 'var(--primary-blue)' }"
            />
            <label for="remember" class="!ml-2 block text-sm text-[var(--neutral-800)]">Remember me</label>
          </div>
          
          <button 
            type="submit" 
            class="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors text-base font-medium flex justify-center items-center text-[var(--primary-white)] cursor-pointer"
            :style="{ 
              background: 'var(--primary-blue)',
              boxShadow: '0 4px 6px rgba(0, 132, 197, 0.25)'
            }"
            :class="{ 'hover:bg-[var(--blue-dark)]': !isLoading }"
            :disabled="isLoading"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-[var(--primary-white)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Signing in...' : 'Login' }}
          </button>
        </form>
        
        <div class="mt-4 text-center">
          <p class="text-sm text-[var(--neutral-800)]">
            Don't have an account? <router-link to="/register" class="font-medium hover:text-[var(--blue-dark)]" :style="{ color: 'var(--primary-blue)' }">Register</router-link>
          </p>
        </div>
        
        <div class="mt-4 space-y-4">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-[var(--neutral-400)]"></div>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-2 bg-[var(--primary-white)] text-[var(--neutral-800)]">Or</span>
            </div>
          </div>
          
          <!-- Single button for Google Sign-In with increased spacing -->
          <div class="mt-4">
            <button 
              type="button" 
              @click="signInWithGoogle"
              id="googleSignInButton"
              class="w-full flex justify-center items-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-[var(--primary-white)] cursor-pointer"
              :style="{ 
                background: 'var(--primary-green)',
                boxShadow: '0 2px 4px rgba(127, 179, 42, 0.25)'
              }"
              :class="{ 'hover:bg-[var(--green-dark)]': !isLoading }"
              :disabled="isLoading"
            >
              <svg class="h-4 w-4 !mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-0.013z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Tennis court decoration at bottom -->
      <div class="h-2 mt-4" :style="{ background: 'linear-gradient(90deg, var(--primary-green) 0%, var(--green-light) 100%)' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import logoImage from '@/assets/beastLogo.png';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/utils/axios';
import { AxiosError } from 'axios';

// Declare global Google SDK variables with proper interfaces
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleInitializeConfig) => void;
          renderButton: (element: HTMLElement, config: GoogleButtonConfig) => void;
          prompt: () => void;
        }
      }
    };
  }
}

// Define interfaces for Google SDK
interface GoogleInitializeConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: string;
  error_callback?: (error: GoogleErrorResponse) => void;
}

interface GoogleButtonConfig {
  theme?: string;
  size?: string;
  width?: string;
}

interface GoogleCredentialResponse {
  credential: string;
  client_id?: string;
  select_by?: string;
}

interface GoogleErrorResponse {
  type: string;
  message: string;
}

interface ErrorResponse {
  error?: string;
  message?: string;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
}

// Define OnErrorEventHandler type for script loading
type OnErrorEventHandler = ((event: Event | string) => void) | null;

const email = ref('');
const password = ref('');
const router = useRouter();
const isLoading = ref(false);
const loginError = ref(false);
const errorMessage = ref('Invalid email or password. Please try again.');
const showPassword = ref(false);

// Configure Google login
onMounted(() => {
  // Debug environment variables
  console.log("VITE_GOOGLE_CLIENT_ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
  
  // Load Google SDK
  loadGoogleScript();
});

// Load the Google Sign-In SDK with better error handling
const loadGoogleScript = () => {
  // Check if the script is already loaded
  if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
    console.log("Google SDK script already exists, initializing directly");
    initializeGoogleSignIn();
    return;
  }

  console.log("Loading Google SDK script...");
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    console.log("Google SDK script loaded successfully");
    initializeGoogleSignIn();
  };
  script.onerror = ((error: Event | string) => {
    console.error("Error loading Google SDK script:", error);
    loginError.value = true;
    errorMessage.value = 'Failed to load Google Sign-In. Please try again later.';
  }) as OnErrorEventHandler;
  document.head.appendChild(script);
};

// Initialize Google Sign-In with better error handling
const initializeGoogleSignIn = () => {
  try {
    console.log("Initializing Google Sign-In...");
    
    if (!window.google) {
      console.error("Google SDK not loaded properly - window.google is undefined");
      return;
    }
    
    if (!window.google.accounts) {
      console.error("Google accounts API not available - window.google.accounts is undefined");
      return;
    }
    
    if (!window.google.accounts.id) {
      console.error("Google ID service not available - window.google.accounts.id is undefined");
      return;
    }
    
    // Debug client ID
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    console.log("Using Google Client ID:", clientId);
    
    if (!clientId) {
      console.error("Google Client ID is missing or empty");
      return;
    }
    
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleSignIn,
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'signin',
      // Add error handler
      error_callback: (error: GoogleErrorResponse) => {
        console.error("Google Sign-In initialization error:", error);
        loginError.value = true;
        errorMessage.value = 'An error occurred with Google Sign-In. Please try again.';
      }
    });
    
    console.log("Google Sign-In initialized successfully");
  } catch (error) {
    console.error("Error in Google Sign-In initialization:", error);
    loginError.value = true;
    errorMessage.value = 'Failed to initialize Google Sign-In. Please try again later.';
  }
};

// Handle Google Sign-In response with better error handling
const handleGoogleSignIn = async (response: GoogleCredentialResponse) => {
  console.log("Google Sign-In response received:", response);
  isLoading.value = true;
  loginError.value = false;
  
  if (!response || !response.credential) {
    console.error("Invalid Google Sign-In response - missing credential");
    loginError.value = true;
    errorMessage.value = 'Failed to authenticate with Google. Missing credentials.';
    isLoading.value = false;
    return;
  }
  
  try {
    console.log("Sending Google token to backend...");
    const result = await api.post('/auth/google', {
      token: response.credential
    }, {
      withCredentials: true
    });
    
    console.log('Google login successful:', result.data);
    router.push('/');
    await getUserProfile();
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Google login failed:', axiosError);
    loginError.value = true;
    
    if (axiosError.response?.data?.error) {
      errorMessage.value = axiosError.response.data.error;
    } else if (axiosError.message) {
      errorMessage.value = `Google login failed: ${axiosError.message}`;
    } else {
      errorMessage.value = 'Google login failed. Please try again.';
    }
  } finally {
    isLoading.value = false;
  }
};

// Handle Google Sign-In button click with better fallback
const signInWithGoogle = () => {
  console.log("Google Sign-In button clicked");
  loginError.value = false;
  
  // Use the redirect approach directly instead of One Tap
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  const scope = "email profile";
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
  
  console.log("Redirecting to Google OAuth URL:", authUrl);
  window.location.href = authUrl;
};

// Regular email/password login
const handleLogin = async () => {
  loginError.value = false;
  isLoading.value = true;
  
  try {
    // The backend sets httpOnly cookie automatically
    const response = await api.post('/auth/login', { 
      email: email.value, 
      password: password.value 
    }, {
      withCredentials: true // Important for cookies to be sent/received
    });
    
    console.log('Login successful:', response.data);
    
    // No need to store token in localStorage since it's in httpOnly cookie
    // Instead, just redirect to the dashboard
    router.push('/');
    
    // For testing: Get the user profile which includes role
    await getUserProfile();
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Login failed', axiosError);
    loginError.value = true;
    
    // Set specific error message based on error response in English
    if (axiosError.response) {
      if (axiosError.response.status === 401) {
        errorMessage.value = 'The email or password you entered is incorrect.';
      } else if (axiosError.response.status === 404) {
        errorMessage.value = 'Account not found. Please register first.';
      } else if (axiosError.response.status === 429) {
        errorMessage.value = 'Too many attempts. Please try again later.';
      } else if (axiosError.response.data?.error) {
        errorMessage.value = axiosError.response.data.error;
      } else if (axiosError.response.data?.message) {
        errorMessage.value = axiosError.response.data.message;
      } else {
        errorMessage.value = 'An error occurred. Please try again.';
      }
    } else if (axiosError.request) {
      errorMessage.value = 'Unable to connect to the server. Please check your connection.';
    } else {
      errorMessage.value = 'An error occurred. Please try again.';
    }
  } finally {
    isLoading.value = false;
  }
};

const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await api.get<UserProfile>('/auth/me', {
      withCredentials: true // Important for sending the cookie
    });
    
    // Specifically log the role for testing
    console.log('User role:', response.data.role);
    
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Failed to get user profile:', axiosError);
    return null;
  }
};

// Back button functionality
const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
/* You may need to add these styles if the spacing still isn't working properly */
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}
</style>

