<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import type { EventData } from '@/services/eventServices';
import { useRouter } from 'vue-router';
import { defineProps } from 'vue';

const props = defineProps({
  event: {
    type: Object as () => EventData,
    required: true
  }
});

const router = useRouter();

function goToEventDetails() {
  router.push(`/event-details/${props.event.id}`);
}

const emit = defineEmits(['edit', 'delete']);

// Format the posted date
const formattedDate = computed(() => {
  try {
    return formatDistanceToNow(new Date(props.event.posted_at), { addSuffix: true });
  } catch (error) { 
    console.error("Error formatting date:", error); 
    return props.event.posted_at || 'Unknown date';
  }
});

// Handle edit button click
function handleEdit() {
  emit('edit', props.event);
}

// Handle delete button click
function handleDelete() {
  emit('delete', props.event);
}

// Toggle dropdown menu
const showDropdown = ref(false);
function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

// Close dropdown when clicking outside
function closeDropdown(event: MouseEvent) {
  const target = event.target as Element;
  if (target && !target.closest('.dropdown-container')) {
    showDropdown.value = false;
  }
}

// Register click outside listener
if (typeof window !== 'undefined') {
  window.addEventListener('click', closeDropdown);
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md" @click="goToEventDetails">
    <!-- Card header -->
    <div class="p-4 flex items-center justify-between">
      <div class="flex items-center">
        <div class="h-10 w-10 rounded-full bg-[#e6f5fa] flex items-center justify-center text-[#0099cc] font-bold">
          {{ event.title.charAt(0) }}
        </div>
        <div class="ml-3">
          <h3 class="font-semibold text-gray-800">{{ event.title }}</h3>
          <p class="text-xs text-gray-500">{{ formattedDate }}</p>
        </div>
      </div>
      
      <!-- Dropdown menu -->
      <div class="dropdown-container relative">
        <button @click.stop="toggleDropdown" class="p-2 rounded-full hover:bg-gray-100 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        
        <div v-if="showDropdown" class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div class="py-1">
            <button @click="handleEdit" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button @click="handleDelete" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Event description -->
    <div class="px-4 pb-3">
      <p class="text-gray-700">{{ event.description }}</p>
    </div>
    
    <!-- Event image -->
    <div v-if="event.images" class="w-full">
      <img :src="event.images" :alt="event.title" class="w-full object-cover max-h-64" />
    </div>
    
    <!-- Action buttons -->
    <div class="px-4 py-3 border-t border-gray-100 flex space-x-6">
      <button class="flex items-center text-gray-600 hover:text-[#0099cc] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        Like
      </button>
      
      <button class="flex items-center text-gray-600 hover:text-[#0099cc] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Comment
      </button>
      
      <button class="flex items-center text-gray-600 hover:text-[#0099cc] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
      </button>
    </div>
  </div>
</template>