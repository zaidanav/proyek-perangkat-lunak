<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { EventData } from '@/services/eventServices';

const props = defineProps({
  event: {
    type: Object as () => EventData,
    required: true
  },
  title: {
    type: String,
    default: 'Event Form'
  },
  isProcessing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['save', 'cancel']);

// Form data
const formData = ref<EventData>({
  id: 0,
  title: '',
  images: '',
  description: '',
  posted_at: '',
  joinform: ''
});

// Form validation
const errors = ref({
  title: '',
  description: ''
});

// Initialize form with event data
onMounted(() => {
  if (props.event) {
    formData.value = { ...props.event };
  }
});

// Validate form
function validateForm() {
  let isValid = true;
  errors.value = {
    title: '',
    description: ''
  };
  
  if (!formData.value.title.trim()) {
    errors.value.title = 'Title is required';
    isValid = false;
  }
  
  if (!formData.value.description.trim()) {
    errors.value.description = 'Description is required';
    isValid = false;
  }
  
  return isValid;
}

// Handle form submission
function handleSubmit() {
  if (validateForm()) {
    emit('save', { ...formData.value });
  }
}

// Handle cancel
function handleCancel() {
  emit('cancel');
}

// Handle backdrop click
function handleBackdropClick(event: MouseEvent) {
  // Only close if the clicked element is the backdrop itself
  if (event.target === event.currentTarget) {
    emit('cancel');
  }
}

// Handle image preview
function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target && target.files && target.files[0]) {
    const file = target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should not exceed 5MB');
        return;
      }

      // Update file name display
      const fileNameElement = document.getElementById('file-name');
      if (fileNameElement) {
        fileNameElement.textContent = file.name;
      }
      // Create a local URL for the image PREVIEW
      formData.value.images = URL.createObjectURL(file);

      // Store the file in formData for upload
      formData.value.imageFile = file;
    }
  }
}
</script>

<template>
  <div 
    class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-3"
    @click="handleBackdropClick"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="p-4 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-[var(--primary-blue)]">{{ title }}</h2>
      </div>
      
      <!-- Scrollable Form Content -->
      <div class="p-4 overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="!space-y-3">
          <!-- Title input -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 !mb-1">Title</label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent"
              placeholder="Event title"
            />
            <p v-if="errors.title" class="!mt-1 text-xs text-red-600">{{ errors.title }}</p>
          </div>
          
          <!-- Description input -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 !mb-1">Description</label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent"
              placeholder="Event description"
            ></textarea>
            <p v-if="errors.description" class="!mt-1 text-xs text-red-600">{{ errors.description }}</p>
          </div>
          
          <!-- Image input section (tetap sama) -->
          <div>
            <label for="image" class="block text-sm font-medium text-gray-700 !mb-1">Event Image</label>
            <div v-if="formData.images" class="!mb-2 rounded-lg overflow-hidden shadow-sm">
              <div class="flex items-center">
                <img :src="formData.images" alt="Preview" class="h-20 w-20 object-cover" />
                <div class="flex-1 px-3 flex justify-between items-center bg-gray-50">
                  <span class="text-xs text-gray-600 truncate max-w-[150px]">Image selected</span>
                  <button 
                    type="button"
                    @click="formData.images = ''"
                    class="text-xs text-red-600 hover:text-red-800 focus:outline-none cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <div class="flex items-center !mt-2 border border-gray-300 rounded-lg p-2 bg-gray-50">
              <label for="image" class="inline-block px-3 py-1 bg-[var(--primary-blue)] text-white rounded text-xs cursor-pointer hover:bg-[#007aa3]">
                Choose File
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  @change="handleImageChange"
                  class="hidden"
                />
              </label>
              <span class="!ml-2 text-xs text-gray-600 truncate max-w-[150px]">
                No file chosen
              </span>
            </div>
          </div>
          
          <!-- Input Google Form URL -->
          <div>
            <label for="googleForm" class="block text-sm font-medium text-gray-700 !mb-1">Join Form URL</label>
            <div class="!mt-2">
              <div class="flex items-center">
                <input
                  id="googleForm"
                  v-model="formData.joinform"
                  type="text"
                  class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent"
                  placeholder="Enter Google Form URL..."
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <!-- Footer dengan actions -->
      <div class="p-4 flex justify-end !space-x-2 !mt-auto">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          :disabled="isProcessing"
          class="px-4 py-1.5 bg-[var(--primary-blue)] text-white rounded-lg hover:bg-[#007aa3] text-sm font-medium transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <span v-if="isProcessing" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
          <span v-else>Save</span>
        </button>
      </div>
    </div>
  </div>
</template>