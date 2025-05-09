<template>
  <div class="min-h-screen min-w-screen flex items-center justify-center pt-4 pb-4" :style="{ background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--blue-dark) 100%)' }">
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
      <div class="pt-8 pb-4 text-center">
        <div class="inline-flex items-center justify-center">
          <!-- Logo PNG baru disini -->
          <img 
            :src="logoImage" 
            alt="Tennis Community Logo" 
            class="w-20 h-auto object-contain" 
          />
        </div>
        <h1 class="text-xl font-bold mb-1" :style="{ color: 'var(--primary-blue)' }">BEAST</h1>
        <p class="text-sm text-[var(--neutral-800)]">Create your account</p>
      </div>
      
      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-[var(--neutral-300)] border-l-4 border-[var(--primary-blue)] text-[var(--neutral-800)] px-3 py-2 rounded-md relative mx-4 mb-2">
        <div class="flex items-center justify-between">
          <p class="text-sm">{{ errorMessage }}</p>
          <button @click="errorMessage = ''" class="text-[var(--neutral-700)] hover:text-[var(--neutral-900)] ml-2">
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Register Form -->
      <div class="px-6 py-4 space-y-4">
        <form @submit.prevent="handleRegister" class="space-y-4 text-[var(--neutral-800)]">
          <!-- Image Preview -->
          <div v-if="imagePreviewUrl" class="mb-3 flex justify-center">
            <img 
              :src="imagePreviewUrl" 
              alt="Profile Preview" 
              class="w-24 h-24 rounded-full object-cover"
            />
          </div>

          <!-- Image Upload -->
          <div class="pb-1">
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--primary-blue)' }">
              Profile Image
            </label>
            <div class="mt-1 flex items-center">
              <input
                id="img_upload"
                type="file" 
                accept="image/*"
                @change="handleImageUpload"
                class="hidden"
                ref="imageUploadRef"
              />
              <button 
                type="button" 
                @click="triggerFileInput"
                class="w-full py-2 px-3 border rounded-md shadow-sm text-xs font-medium focus:outline-none bg-[var(--color-background-soft)] border-[var(--color-border)] hover:bg-[var(--primary-blue)] cursor-pointer"
              >
                {{ imagePreviewUrl ? 'Change Image' : 'Upload Image' }}
              </button>
            </div>
            <p v-if="errorImage" class="mt-1 text-xs text-red-500">
              {{ errorImage }}
            </p>
          </div>
          
          <div class="!mb-2">
            <label for="username" class="block text-sm font-medium mb-1" :style="{ color: 'var(--primary-blue)' }">Username</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              class="w-full px-3 py-2 bg-[var(--neutral-200)] border border-[var(--neutral-400)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--neutral-800)] text-sm"
              placeholder="Enter your username"
              required
            />
          </div>

          <div class="!mb-2">
            <label for="name" class="block text-sm font-medium mb-1" :style="{ color: 'var(--primary-blue)' }">Name</label>
            <input 
              type="text" 
              id="name" 
              v-model="name" 
              class="w-full px-3 py-2 bg-[var(--neutral-200)] border border-[var(--neutral-400)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--neutral-800)] text-sm"
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div class="!mb-2">
            <label for="email" class="block text-sm font-medium mb-1" :style="{ color: 'var(--primary-blue)' }">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              class="w-full px-3 py-2 bg-[var(--neutral-200)] border border-[var(--neutral-400)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--neutral-800)] text-sm"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div class="!mb-2">
            <label for="password" class="block text-sm font-medium mb-1" :style="{ color: 'var(--primary-blue)' }">Password</label>
            <div class="relative">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="password" 
                class="w-full px-3 py-2 bg-[var(--neutral-200)] border border-[var(--neutral-400)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--neutral-800)] text-sm"
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--neutral-800)] cursor-pointer"
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

          <div class="!mb-2">
            <label for="confirmPassword" class="block text-sm font-medium mb-1" :style="{ color: 'var(--primary-blue)' }">Confirm Password</label>
            <div class="relative">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword" 
                v-model="confirmPassword" 
                class="w-full px-3 py-2 bg-[var(--neutral-200)] border border-[var(--neutral-400)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--neutral-800)] text-sm"
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                @click="showConfirmPassword = !showConfirmPassword" 
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--neutral-800)] cursor-pointer"
              >
                <svg v-if="showConfirmPassword" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
                <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="!mb-4">
            <label for="role" class="block text-sm font-medium mb-1" :style="{ color: 'var(--primary-blue)' }">Role</label>
            <select 
              id="role"
              v-model="role" 
              class="w-full px-3 py-2 bg-[var(--neutral-200)] border border-[var(--neutral-400)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--neutral-800)] appearance-none cursor-pointer text-sm"
              style="background-image: url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23606060\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E'); background-repeat: no-repeat; background-size: 1rem; background-position: center right 1rem;"
            >
              <option value="member">Member</option>
              <option value="trainer">Trainer</option>
            </select>
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
            <svg v-if="isLoading" class="animate-spin -ml-1 !mr-2 h-4 w-4 text-[var(--primary-white)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Registering...' : 'Register' }}
          </button>
        </form>
        
        <div class="!mt-2 text-center">
          <p class="text-sm text-[var(--neutral-800)]">
            Already have an account? <router-link to="/login" class="font-medium hover:text-[var(--blue-dark)]" :style="{ color: 'var(--primary-blue)' }">Login</router-link>
          </p>
        </div>
      </div>
      
      <!-- Tennis court decoration at bottom -->
      <div class="h-2 mt-4" :style="{ background: 'linear-gradient(90deg, var(--primary-green) 0%, var(--green-light) 100%)' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/utils/axios';
import { AxiosError } from 'axios';
import logoImage from '@/assets/beastLogo.png';

interface ErrorResponse {
  error?: string;
  message?: string;
}

const router = useRouter();
const img_file = ref<File | null>(null);
const username = ref('');
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const role = ref('member');
const errorMessage = ref('');
const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const imageUploadRef = ref<HTMLInputElement | null>(null)
const imagePreviewUrl = ref<string | null>(null)
const errorImage = ref<string | null>(null)

// Trigger file input click
const triggerFileInput = () => {
  imageUploadRef.value?.click()
}

// Handle image upload
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      errorImage.value = 'Invalid file type. Please upload JPEG, PNG, or GIF.'
      return
    }

    if (file.size > maxSize) {
      errorImage.value = 'File size exceeds 5MB limit.'
      return
    }

    // Clear previous errors
    errorImage.value = null

    // Set file and create preview
    img_file.value = file
    imagePreviewUrl.value = URL.createObjectURL(file)
  }
}

// Back button functionality
const goBack = () => {
  router.push('/');
};

const handleRegister = async () => {
  errorMessage.value = '';

  // Password validation
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  // Password strength check
  if (password.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long';
    return;
  }

  if (!img_file.value)
  {
    errorImage.value = 'Please upload a profile image';
    return;
  }

  isLoading.value = true;

  try {
    const formData = new FormData();
    formData.append('username', username.value);
    formData.append('email', email.value);
    formData.append('password', password.value);
    formData.append('role', role.value);
    formData.append('img_file', img_file.value);
    formData.append('name', name.value);


    const response = await api.post('/auth/register', formData);

    console.log('Register Success:', response.data);
    router.push('/login');
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Register Error:', axiosError.response?.data || axiosError.message);

    // Display appropriate backend error messages
    if (axiosError.response?.status === 400) {
      errorMessage.value = axiosError.response.data?.error || 'Invalid input';
    } else if (axiosError.response?.status === 409) {
      errorMessage.value = 'Email is already in use';
    } else {
      errorMessage.value = 'Registration failed. Please try again.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Adjust spacing between form elements */
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}
</style>

