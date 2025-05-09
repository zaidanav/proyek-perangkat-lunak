<template>
  <div class="min-h-screen bg-[var(--neutral-200)]">
    <Navbar />
    
    <div class="container !mx-auto px-6 md:px-12 pt-24 pb-16 !mb-15">
      <!-- Back button and header -->
      <div class="flex items-center !mb-6">
        <button 
          @click="goBack" 
          class="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:bg-[var(--neutral-300)] transition-colors !mr-4 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[var(--neutral-800)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-2xl md:text-3xl !font-bold" style="color: var(--primary-blue)">Event Details</h1>
      </div>
      
      <!-- Loading state -->
      <div v-if="!event && !error" class="flex justify-center py-12">
        <div class="relative">
          <!-- Tennis ball loading spinner -->
          <div class="w-16 h-16 rounded-full animate-ping absolute" style="background: var(--primary-green); opacity: 0.3"></div>
          <div class="w-16 h-16 rounded-full animate-pulse" style="background: var(--primary-green); opacity: 0.6"></div>
          <div class="w-16 h-16 rounded-full border-4 border-[var(--primary-blue)] border-t-transparent animate-spin"></div>
        </div>
      </div>
      
      <!-- Error state -->
      <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg !mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm">{{ error }}</p>
          </div>
        </div>
      </div>
      
      <!-- Event details -->
      <div v-if="event" class="bg-white rounded-xl shadow-sm overflow-hidden max-w-3xl !mx-auto">
        <!-- Event image -->
        <div class="relative h-48 md:h-64 bg-[var(--neutral-300)] overflow-hidden">
          <img 
            v-if="event.images" 
            :src="event.images" 
            :alt="event.title" 
            class="w-full h-full object-cover"
            @error="handleImageError($event)"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-[var(--neutral-300)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-[var(--neutral-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <!-- Tennis ball decoration -->
          <div class="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center" style="background: var(--primary-green)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        
        <!-- Event content -->
        <div class="p-6 md:p-8 relative">
          <!-- Tennis ball decoration -->
          <div class="absolute -bottom-6 -left-6 w-16 h-16 rounded-full hidden md:block" style="background: var(--primary-green); opacity: 0.1"></div>
          
          <div class="relative">
            <div class="flex items-center !mb-4">
              <div class="bg-[var(--primary-blue)]/10 text-[var(--primary-blue)] px-3 py-1 rounded-full text-sm !font-medium">
                {{ formatDate(event.posted_at) }}
              </div>
            </div>
            
            <h2 class="text-2xl md:text-3xl !font-bold !mb-4 text-[var(--neutral-800)]">{{ event.title }}</h2>
            
            <div class="prose max-w-none text-[var(--neutral-700)]">
              <p class="whitespace-pre-line">{{ event.description }}</p>
            </div>
            
            <!-- Action buttons -->
            <div class="mt-8 flex flex-wrap gap-4">
              
              <button 
                class="px-6 py-3 bg-[var(--primary-blue)] hover:bg-[var(--blue-dark)] text-white rounded-lg !font-medium transition-colors flex items-center cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 !mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Register for Event
              </button>
              
              <button 
                class="px-6 py-3 bg-white border border-[var(--primary-blue)] text-[var(--primary-blue)] hover:bg-[var(--primary-blue)]/5 rounded-lg !font-medium transition-colors flex items-center cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 !mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tennis court decoration at bottom -->
    <div class="h-2" style="background: linear-gradient(90deg, var(--primary-green) 0%, var(--green-light) 100%)"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/Navbar.vue';

// Renamed from Event to EventData to avoid conflict with DOM Event
interface EventData {
  id: number;
  title: string;
  images: string;
  description: string;
  posted_at: string;
}

const route = useRoute();
const router = useRouter();
const event = ref<EventData | null>(null);
const error = ref<string | null>(null);

const fetchEventDetails = async (id: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/eventDetails/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event details: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success && data.data) {
      event.value = data.data;
    } else {
      throw new Error(data.message || 'Unexpected API response');
    }
  } catch (err) {
    console.error('Error fetching event details:', err);
    error.value = 'Failed to load event details. Please try again later.';
  }
};

const goBack = () => {
  router.push('/events');
};

// Format date
function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Fixed image error handler with explicit DOM Event type
function handleImageError(e: Event): void {
  const target = e.target as HTMLImageElement;
  target.src = ''; // You can set a default image here
  target.classList.add('bg-[var(--neutral-300)]');
}

onMounted(() => {
  const eventId = route.params.id as string;
  fetchEventDetails(eventId);
});
</script>

<style scoped>
.prose p {
  margin-bottom: 1rem;
  line-height: 1.7;
}

.whitespace-pre-line {
  white-space: pre-line;
}
</style>