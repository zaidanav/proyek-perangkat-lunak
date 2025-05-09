<template>
  <div class="min-h-screen bg-[var(--neutral-200)]">
    <!-- Navbar placeholder - will use the existing Navbar component -->
    <Navbar />
    
    <div class="container !mx-auto !px-6 md:!px-12 !pt-24 !pb-16">
      <!-- Header with tennis ball decoration -->
      <div class="relative !mb-8">
        <div class="absolute -top-6 -right-6 w-16 h-16 rounded-full hidden md:block" style="background: var(--primary-green); opacity: 0.2"></div>
        
        <div class="flex flex-col md:flex-row justify-between items-center !mb-8">
          <div>
            <h1 class="text-3xl md:text-4xl !font-bold !mb-2" style="color: var(--primary-blue)">Tennis Events</h1>
            <p class="text-[var(--neutral-700)] max-w-xl">Find and join tennis tournaments, clinics, and social events in your area</p>
          </div>
          
          <button 
            @click="openCreateForm" 
            class="!mt-4 md:mt-0 bg-[var(--primary-blue)] hover:bg-[var(--blue-dark)] text-white !px-5 !py-2.5 rounded-lg flex items-center !font-medium transition-colors shadow-md cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 !mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Create Event
          </button>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="bg-white rounded-xl shadow-sm !p-4 !mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center !pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-[var(--neutral-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="Search events..."
                class="w-full !pl-10 !py-3 !px-4 bg-[var(--neutral-200)] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
              />
            </div>
          </div>
          
          <!-- Filter buttons could be added here -->
        </div>
      </div>

      <!-- Error alert -->
      <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 !p-4 rounded-lg !mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="!ml-3">
            <p class="text-sm">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Events list -->
      <div v-if="filteredEvents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 !gap-6">
        <div v-for="event in filteredEvents" :key="event.id" class="w-full">
          <div 
            class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg hover:scale-[1.02] hover: border border-transparent transition-all duration-300 cursor-pointer"
            @click="viewEventDetails(event)"
          >
            <!-- Event image -->
            <div class="relative h-48 bg-[var(--neutral-300)] overflow-hidden">
              <img 
                :src="event.images || ''" 
                :alt="event.title"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <!-- Tennis ball decoration -->
              <div class="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style="background: var(--primary-green)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <!-- Event content -->
            <div class="!p-5">
              <h3 class="text-xl !font-bold !mb-2 text-[var(--neutral-800)] line-clamp-1">{{ event.title }}</h3>
              
              <p class="text-sm text-[var(--neutral-600)] !mb-3">
                {{ formatDate(event.posted_at) }}
              </p>
              
              <p class="text-[var(--neutral-700)] !mb-4 line-clamp-2">{{ event.description }}</p>
              
              <!-- Action buttons -->
              <div class="flex justify-between items-center w-full">
                <!-- Tombol JOIN -->
                <div>
                  <button 
                    @click.stop="openJoinForm(event)" 
                    class="px-4 py-1 rounded-full bg-[var(--primary-blue)] text-white text-sm font-medium hover:bg-[var(--blue-dark)] transition-colors"
                    title="Join Event"
                  >
                    JOIN
                  </button>
                </div>

                <div class="flex space-x-2">
                  <!-- Like button -->
                  <button 
                    @click.stop="likedEvents[event.id] ? toggleUnlike(event) : toggleLike(event)" 
                    class="p-2 rounded-full cursor-pointer"
                    title="Like Event"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      :class="[
                        'h-5', 
                        'w-5', 
                        likedEvents[event.id] 
                          ? 'fill-red-500 stroke-red-500' 
                          : 'fill-white stroke-gray-500'
                      ]" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" 
                      />
                    </svg>
                  </button>

                  <!-- Edit button -->
                  <button 
                    @click.stop="openEditForm(event)" 
                    class="p-2 text-[var(--neutral-600)] hover:text-[var(--primary-blue)] rounded-full hover:bg-[var(--neutral-200)] cursor-pointer"
                    title="Edit Event"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                      />
                    </svg>
                  </button>
                  
                  <!-- Delete button -->
                  <button 
                    @click.stop="openDeleteConfirm(event)" 
                    class="p-2 text-[var(--neutral-600)] hover:text-red-500 rounded-full hover:bg-[var(--neutral-200)] cursor-pointer"
                    title="Delete Event"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!loading" class="bg-white rounded-xl shadow-sm !p-12 text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--neutral-300)] !mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[var(--primary-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-2xl !font-bold text-[var(--neutral-800)] !mb-3">No events found</h3>
        <p class="text-[var(--neutral-600)] !mb-6 max-w-md mx-auto">
          There are no tennis events available right now. Create your first event to get started!
        </p>
        <button 
          @click="openCreateForm" 
          class="bg-[var(--primary-blue)] hover:bg-[var(--blue-dark)] text-white !px-6 !py-3 rounded-lg inline-flex items-center !font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 !mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Create New Event
        </button>
      </div>

      <!-- Loading indicator -->
      <div v-if="loading" class="flex justify-center !py-12">
        <div class="relative">
          <!-- Tennis ball loading spinner -->
          <div class="w-16 h-16 rounded-full animate-ping absolute" style="background: var(--primary-green); opacity: 0.3"></div>
          <div class="w-16 h-16 rounded-full animate-pulse" style="background: var(--primary-green); opacity: 0.6"></div>
          <div class="w-16 h-16 rounded-full border-4 border-[var(--primary-blue)] border-t-transparent animate-spin"></div>
        </div>
      </div>

      <!-- Sentinel element for infinite scrolling -->
      <div id="sentinel" class="h-4 w-full"></div>

      <!-- Create Event Modal -->
      <EventForm
        v-if="showCreateForm"
        :event="currentEvent"
        :isProcessing="isFormProcessing"
        title="Create New Event"
        @save="handleCreateEvent"
        @cancel="showCreateForm = false"
        />
        
        <!-- Edit Event Modal -->
        <EventForm
        v-if="showEditForm"
        :event="currentEvent"
        title="Edit Event"
        :isProcessing="isFormProcessing"
        @save="handleEditEvent"
        @cancel="showEditForm = false"
      />
      
      <!-- Delete Confirmation Modal -->
      <ConfirmDialog
        v-if="showDeleteConfirm"
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirm-text="Delete"
        cancel-text="Cancel"
        :isProcessing="isFormProcessing"
        @confirm="handleDeleteEvent"
        @cancel="showDeleteConfirm = false"
      />
    </div>
    
    <!-- Tennis court decoration at bottom -->
    <div class="h-2" style="background: linear-gradient(90deg, var(--primary-green) 0%, var(--green-light) 100%)"></div>
    <div v-if="showLoginPrompt" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
  <div class="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4" @click.stop>
    <!-- Tennis ball decoration -->
    <div class="absolute -top-4 -right-4 w-10 h-10 rounded-full hidden md:block" style="background: var(--primary-green); opacity: 0.5"></div>
    
    <div class="text-center !mb-5">
      <div class="w-12 h-12 rounded-full bg-[var(--primary-blue)]/10 flex items-center justify-center mx-auto !mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" style="color: var(--primary-blue)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold !mb-2 text-[var(--neutral-800)]">Login Required</h3>
      <p class="text-[var(--neutral-700)] mb-6">Would you like to like this event? Please login first to access this feature.</p>
    </div>
    
    <div class="flex flex-col sm:flex-row justify-center gap-3">
      <button 
        @click="closeLoginPrompt" 
        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors cursor-pointer"
      >
        Cancel
      </button>
      <button 
        @click="router.push('/login')" 
        class="px-4 py-2 bg-[var(--primary-blue)] text-white rounded-lg hover:bg-[var(--blue-dark)] text-sm font-medium transition-colors cursor-pointer"
      >
        Login
      </button>
    </div>
    
    <!-- Tennis court decoration at bottom -->
    <div class="h-1 w-full !mt-6" style="background: linear-gradient(90deg, var(--primary-green) 0%, var(--green-light) 100%)"></div>
  </div>
</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchEvents, deleteEvents, editEvents, createEvents, type EventData, likeEvent, unlikeEvent, eventLikedById } from '@/services/eventServices.ts';
import EventForm from '../components/EventFrom.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import Navbar from '@/components/Navbar.vue';
import api from '@/utils/axios.ts';

// State management
const events = ref<EventData[]>([]);
const isFormProcessing = ref(false);
const searchQuery = ref<string>(''); // Search query
const filteredEvents = computed(() =>
  events.value.filter(event =>
    event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);
const page = ref(1);
const loading = ref(false);
const hasMore = ref(true);
const showCreateForm = ref(false);
const showEditForm = ref(false);
const showDeleteConfirm = ref(false);
const currentEvent = ref<EventData>({
  id: 0,
  title: '',
  images: '',
  description: '',
  posted_at: '',
  joinform: ''
});
const error = ref<string | null>(null);
const likedEvents = ref<Record<string, boolean>>({});
const isLoggedIn = ref(false);
const userID = ref('');
const showLoginPrompt = ref(false);

const router = useRouter();

async function fetchLikedEvents() {
  try {
    const response = await eventLikedById(Number(userID.value));
    if (response.data) {
      response.data.forEach((event: EventData) => {
        likedEvents.value[event.id] = true;
      });
    }
  } catch (err) {
    console.error("Failed to fetch liked events:", err);
  }
}

function openJoinForm(event: EventData) {
  if (event.joinform) {
    window.open(event.joinform, "_blank");
  } else {
    // Jika joinform kosong, Anda bisa tampilkan pesan atau lakukan alternatif
    alert("Join form not available for this event.");
  }
}


// Load initial events
onMounted(async () => {
  await loadEvents();

  // Set up intersection observer for infinite scrolling
  const observer = new IntersectionObserver(handleIntersect, {
    rootMargin: '100px',
  });
  
  const sentinel = document.querySelector('#sentinel');
  if (sentinel) {
    observer.observe(sentinel);
  }

  try {
    const response = await api.get('/auth/me', {
      withCredentials: true
    });
    if (response.data) {
      isLoggedIn.value = true;
      userID.value = response.data.id;
      await fetchLikedEvents();
    }
  } catch {
    console.log('User not logged in');
    isLoggedIn.value = false;
  }
});

// Load events function
async function loadEvents(reset = false) {
  if (loading.value || (!hasMore.value && !reset)) return;
  
  try {
    loading.value = true;
    error.value = null;
    
    if (reset) {
      page.value = 1;
      events.value = [];
    }
    
    const response = await fetchEvents(page.value);
    
    // Check if the API returns data in a specific format
    const newEvents = response.data || (response as unknown as EventData[]);
    
    if (newEvents.length === 0) {
      hasMore.value = false;
    } else {
      events.value = [...events.value, ...newEvents];
      page.value += 1;
    }
  } catch (err) {
    error.value = 'Failed to load events. Please try again.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Intersection observer handler for infinite scrolling
function handleIntersect(entries: IntersectionObserverEntry[]) {
  if (entries[0].isIntersecting && !loading.value && hasMore.value) {
    loadEvents();
  }
}

function handleSearch() {
  // This function is triggered on every input change in the search bar
}

async function toggleLike(event: EventData) {
  if (!isLoggedIn.value) {
    showLoginPrompt.value = true;
    return;
  }
  try {
    await likeEvent(event.id, Number(userID.value));
    likedEvents.value[event.id] = true;
  } catch (err) {
    console.error("Error liking event:", err);
  }
}

async function toggleUnlike(event: EventData) {
  if (!isLoggedIn.value) {
    showLoginPrompt.value = true;
    return;
  }
  try {
    await unlikeEvent(event.id, Number(userID.value));
    likedEvents.value[event.id] = false;
  } catch (err) {
    console.error("Error unliking event:", err);
  }
}

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

// Handle image error
function handleImageError(e: Event) {
  const target = e.target as HTMLImageElement;
  target.src = ''; // You can set a default image here
  target.classList.add('bg-[var(--neutral-300)]');
}

function viewEventDetails(event: EventData) {
  router.push(`/event-details/${event.id}`);
}

// Open create form
function openCreateForm() {
  currentEvent.value = {
    id: 0,
    title: '',
    images: '',
    description: '',
    posted_at: '',
    joinform: ''
  } as EventData;
  showCreateForm.value = true;
}

// Open edit form
function openEditForm(event: EventData) {
  currentEvent.value = { ...event };
  showEditForm.value = true;
}

// Open delete confirmation
function openDeleteConfirm(event: EventData) {
  currentEvent.value = event;
  showDeleteConfirm.value = true;
}

// Handle create event
async function handleCreateEvent(event: EventData) {
  try {
    isFormProcessing.value = true;
    error.value = null;

    console.log('Creating event:', event);
    
    const response = await createEvents(event);
    
    // Get the created event with its ID from the response
    const createdEvent = response.data as EventData || response as EventData;
    
    // Add the new event to the beginning of the events array
    if (!createdEvent.posted_at) {
      createdEvent.posted_at = new Date().toISOString();
    }
    
    // Add the new event to the beginning of the array so it appears at the top
    events.value = [createdEvent, ...events.value];
    
    // Clear the form
    showCreateForm.value = false;
    
  } catch (err) {
    error.value = 'Failed to create event. Please try again.';
    console.error(err);
  } finally {
    isFormProcessing.value = false;
  }
}

const closeLoginPrompt = () => {
  showLoginPrompt.value = false;
};

// Handle edit event
async function handleEditEvent(eventData: EventData) {
  try {
    loading.value = true;
    error.value = null;
    isFormProcessing.value = true;
    
    await editEvents(eventData.id.toString(), eventData);
    showEditForm.value = false;
    
    // Update the event in the local state
    const index = events.value.findIndex(e => e.id === eventData.id);
    if (index !== -1) {
      events.value[index] = { ...eventData };
    }
  } catch (err) {
    error.value = 'Failed to update event. Please try again.';
    console.error(err);
  } finally {
    loading.value = false;
    isFormProcessing.value = false;
  }
}

// Handle delete event
async function handleDeleteEvent() {
  try {
    loading.value = true;
    error.value = null;
    isFormProcessing.value = true;
    
    if (currentEvent.value) {
      await deleteEvents(currentEvent.value.id.toString());
    }
    showDeleteConfirm.value = false;
    
    // Remove the event from the local state
    if (currentEvent.value) {
      events.value = events.value.filter(e => e.id !== currentEvent.value!.id);
    }
  } catch (err) {
    error.value = 'Failed to delete event. Please try again.';
    console.error(err);
  } finally {
    loading.value = false;
    isFormProcessing.value = false;
  }
}
</script>

<style scoped>
/* Component-specific styles */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>