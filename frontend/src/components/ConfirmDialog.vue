<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'Confirm'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  isProcessing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['confirm', 'cancel']);

function handleConfirm() {
  emit('confirm');
}

function handleCancel() {
  emit('cancel');
}

function handleBackdropClick(event: MouseEvent) {
  // Only close if the clicked element is the backdrop itself
  if (event.target === event.currentTarget) {
    emit('cancel');
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
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center !mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold text-[var(--primary-blue)]">{{ title }}</h2>
        </div>
      </div>
      
      <!-- Scrollable Content -->
      <div class="p-4 overflow-y-auto">
        <p class="text-gray-600 !pl-11">{{ message }}</p>
      </div>
      
      <!-- Footer with Actions -->
      <div class="p-4 flex justify-end !space-x-2 !mt-auto">
        <button
          @click="handleCancel"
          class="px-4 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors cursor-pointer"
        >
          {{ cancelText }}
        </button>
        <button
          @click="handleConfirm"
          :disabled="isProcessing"
          class="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors cursor-pointer"
        >
        <span v-if="isProcessing" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Deleting...
        </span>
        <span v-else>{{ confirmText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>