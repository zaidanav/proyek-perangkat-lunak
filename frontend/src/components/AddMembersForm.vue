<template>
  <!-- Form add member baru -->
  <div
    class="min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full"
    style="background: var(--color-background-mute);"
    v-if="!formSubmitted || !defaultPassword"
  >
    <div class="w-full pb-3 sm:mx-auto sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold" style="color: var(--color-heading);">
        Add New Member / Trainer
      </h2>
    </div>

    <div class="mt-8 w-full sm:mx-auto sm:max-w-md">
      <div class="py-8 px-4 shadow sm:rounded-lg sm:px-10 border" 
           style="background: var(--color-background); border-color: var(--color-border);">
        
        <!-- Image Preview -->
        <div v-if="imagePreviewUrl" class="mb-4 flex justify-center">
          <img 
            :src="imagePreviewUrl" 
            alt="Profile Preview" 
            class="w-32 h-32 rounded-full object-cover"
          />
        </div>

        <form class="space-y-6" @submit.prevent="submitForm">
          <!-- Image Upload -->
          <div class="pb-2">
            <label class="block text-sm font-medium" style="color: var(--color-text);">
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
                class="w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none"
                style="background-color: var(--color-background-soft); border-color: var(--color-border);"
              >
                {{ imagePreviewUrl ? 'Change Image' : 'Upload Image' }}
              </button>
            </div>
            <p v-if="errors.img_file" class="mt-2 text-sm text-red-500">
              {{ errors.img_file }}
            </p>
          </div>

          <!-- Username Input -->
          <div class="pb-2">
            <label for="username" class="block text-sm font-medium" style="color: var(--color-text);">
              Username
            </label>
            <div class="mt-1">
              <input
                id="username"
                v-model="form.username"
                username="username"
                type="text"
                autocomplete="username"
                class="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                :class="{ 'border-red-500': errors.username }"
                style="border-color: var(--color-border); color: var(--color-text); background: var(--color-background-soft);"
              />
            </div>
            <p v-if="errors.username" class="mt-2 text-sm text-red-500">
              {{ errors.username }}
            </p>
          </div>
          
          <!-- Name Input -->
          <div class="pb-2">
            <label for="name" class="block text-sm font-medium" style="color: var(--color-text);">
              Name
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="form.name"
                name="name"
                type="text"
                autocomplete="name"
                class="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                :class="{ 'border-red-500': errors.name }"
                style="border-color: var(--color-border); color: var(--color-text); background: var(--color-background-soft);"
              />
            </div>
            <p v-if="errors.name" class="mt-2 text-sm text-red-500">
              {{ errors.name }}
            </p>
          </div>

          <!-- Email Input -->
          <div class="pb-2">
            <label for="email" class="block text-sm font-medium" style="color: var(--color-text);">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                class="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                :class="{ 'border-red-500': errors.email }"
                style="border-color: var(--color-border); color: var(--color-text); background: var(--color-background-soft);"
              />
            </div>
            <p v-if="errors.email" class="mt-2 text-sm text-red-500">
              {{ errors.email }}
            </p>
          </div>

          <!-- Role Input -->
          <div class="pb-2">
            <label for="role" class="block text-sm font-medium" style="color: var(--color-text);">
              Role
            </label>
            <div class="mt-1 relative">
              <select
                id="role"
                v-model="form.role"
                name="role"
                class="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm pr-10"
                style="border-color: var(--color-border); color: var(--color-text); background: var(--color-background-soft);"
              >
                <option value="member">Member</option>
                <option value="trainer">Trainer</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Phone Input -->
          <div class="pb-2">
            <label for="phone" class="block text-sm font-medium" style="color: var(--color-text);">
              Phone Number <span class="text-xs opacity-70">(Optional)</span>
            </label>
            <div class="mt-1">
              <input
                id="phone"
                v-model="form.phone"
                name="phone"
                type="tel"
                autocomplete="tel"
                class="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                :class="{ 'border-red-500': errors.phone }"
                style="border-color: var(--color-border); color: var(--color-text); background: var(--color-background-soft);"
                placeholder="Optional"
              />
            </div>
            <p v-if="errors.phone" class="mt-2 text-sm text-red-500">
              {{ errors.phone }}
            </p>
          </div>

          <!-- API Error message -->
          <div v-if="apiError" class="rounded-md p-4" style="background: var(--color-background-soft);">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium" style="color: var(--color-text);">
                  {{ apiError }}
                </p>
              </div>
            </div>
          </div>

          <!-- Submit button -->
          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
              :disabled="isSubmitting"
              style="background-color: #42b883; border-color: #42b883;"
            >
              <svg
                v-if="isSubmitting"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ isSubmitting ? 'Adding...' : 'Add Member / Trainer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

   <!-- Password Modal - tampil sebagai modal/popup di tengah layar -->
   <div v-if="formSubmitted && defaultPassword" class="fixed inset-0 flex items-center justify-center z-50" style="background-color: rgba(0,0,0,0.5);">
    <div class="relative mx-auto max-w-md w-full rounded-lg shadow-lg py-8 px-6 sm:p-8" 
        style="background: var(--color-background); border: 1px solid var(--color-border);">
      
      <!-- Header dengan tombol close -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium" style="color: var(--color-heading);">
          {{form.role}} Berhasil Ditambahkan
        </h3>
        <button 
          @click="closePasswordModal" 
          class="text-gray-400 hover:text-gray-500 focus:outline-none"
          aria-label="Close"
        >
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="flex items-start mb-5">
        <div class="flex-shrink-0">
          <svg
            class="h-6 w-6 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3 pb-2">
          <p class="text-sm" style="color: var(--color-text);">
            {{form.role}} baru telah berhasil ditambahkan ke sistem. Berikut adalah informasi login:
          </p>
        </div>
      </div>
      
      <!-- Password display -->
      <div class="bg-opacity-50 rounded-md p-4 mb-5" style="background: var(--color-background-soft);">
        <div class="mb-2">
          <span class="text-sm font-medium" style="color: var(--color-text);">Password Default:</span>
        </div>
        <div class="flex items-center justify-between p-2 rounded" style="background: var(--color-background-mute);">
          <code class="text-base font-mono font-medium" style="color: var(--color-heading);">{{ defaultPassword }}</code>
          <button 
            @click="copyToClipboard" 
            class="ml-2 px-3 py-1 text-xs rounded-md hover:opacity-80 transition" 
            style="background-color: var(--color-background-soft);"
          >
            {{ copyStatus }}
          </button>
        </div>
      </div>

      <!-- spacer -->
      <div class="h-2"></div>
      
      <div class="rounded-md bg-yellow-50 p-2 mb-5">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-yellow-700">
              Harap catat password ini. {{form.role}} perlu menggunakan password ini untuk login pertama kali.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { addNewMember } from '@/services/memberServices'
import type { FormDataMember, FormErrors } from '@/types/MemberForm'

export default defineComponent({
  name: 'AddMemberForm',
  setup() {
    // Form data reactive object
    const form = reactive<FormDataMember>({
      username: '',
      name: '',
      img_file: null as File | null,
      email: '',
      phone: '',
      role: 'member',
    })

    // Refs for form state and validation
    const errors = reactive<FormErrors>({})
    const apiError = ref<string | null>(null)
    const isSubmitting = ref(false)
    const formSubmitted = ref(false)
    const imageUploadRef = ref<HTMLInputElement | null>(null)
    const imagePreviewUrl = ref<string | null>(null)

    // Tambahkan state untuk menyimpan password default
    const defaultPassword = ref<string | null>(null)
    const copyStatus = ref('Salin Password')

    // Fungsi untuk menyalin password ke clipboard
    const copyToClipboard = () => {
      if (defaultPassword.value) {
        navigator.clipboard.writeText(defaultPassword.value)
        copyStatus.value = 'Tersalin!'
        setTimeout(() => {
          copyStatus.value = 'Salin Password'
        }, 2000)
      }
    }

    // Fungsi untuk menutup modal password
    const closePasswordModal = () => {
      formSubmitted.value = false;
      defaultPassword.value = null;
      resetForm();
    }

    // Fungsi untuk reset form ketika menambah member baru
    const resetForm = () => {
      form.username = '';
      form.name = '';
      form.email = '';
      form.phone = '';
      form.img_file = null;
      imagePreviewUrl.value = null;
      Object.keys(errors).forEach((key) => delete errors[key as keyof FormErrors]);
      apiError.value = null;
    }

    // Fungsi untuk menambah member lain
    const addAnotherMember = () => {
      formSubmitted.value = false;
      defaultPassword.value = null;
      resetForm();
    }

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
          errors.img_file = 'Invalid file type. Please upload JPEG, PNG, or GIF.'
          return
        }

        if (file.size > maxSize) {
          errors.img_file = 'File size exceeds 5MB limit.'
          return
        }

        // Clear previous errors
        delete errors.img_file

        // Set file and create preview
        form.img_file = file
        imagePreviewUrl.value = URL.createObjectURL(file)
      }
    }

    // Form validation
    const validateForm = (): boolean => {
      // Clear previous errors
      Object.keys(errors).forEach((key) => delete errors[key as keyof FormErrors])
      apiError.value = null
      let isValid = true

      // Username validation
      if (!form.username) {
        errors.username = 'Username is required'
        isValid = false
      } else if (form.username.length > 100) {
        errors.username = 'Username must be less than 100 characters'
        isValid = false
      }

      // Name validation
      if (!form.name) {
        errors.name = 'Name is required'
        isValid = false
      }else if (form.name.length > 100) {
        errors.name = 'Name must be less than 100 characters'
        isValid = false
      }

      // Email validation
      if (!form.email) {
        errors.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Please enter a valid email address'
        isValid = false
      }

      // Image validation
      if (!form.img_file) {
        errors.img_file = 'Profile image is required'
        isValid = false
      }

      // Phone validation (optional)
      if (form.phone && !/^\d{10,15}$/.test(form.phone.replace(/\s+/g, ''))) {
        errors.phone = 'Please enter a valid phone number'
        isValid = false
      }

      return isValid
    }

    // Form submission
    const submitForm = async () => {
      // Validate form
      if (!validateForm()) return

      // Set submitting state
      isSubmitting.value = true

      try {
        // Call service to add member
        const result = await addNewMember(form, errors, apiError, isSubmitting, formSubmitted)
        // Simpan password default dari response dan tandai form sebagai submitted
        defaultPassword.value = result.defaultPassword
        formSubmitted.value = true

      } catch (error) {
        apiError.value = error instanceof Error ? error.message : 'An error occurred while adding the member.'
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      form,
      errors,
      apiError,
      isSubmitting,
      formSubmitted,
      imageUploadRef,
      imagePreviewUrl,
      triggerFileInput,
      submitForm,
      handleImageUpload,
      defaultPassword,
      copyStatus,
      copyToClipboard,
      closePasswordModal,
      addAnotherMember
    }
  },
})
</script>

<style scoped>
input:focus {
  border-color: #42b883 !important;
  box-shadow: 0 0 0 1px #42b883 !important;
}

button:hover {
  background-color: #33a06f !important;
}

.fixed {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>