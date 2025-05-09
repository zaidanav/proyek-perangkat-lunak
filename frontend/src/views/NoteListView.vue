<template>
  <div class="min-h-screen bg-[var(--neutral-200)]">
    <Navbar />
    
    <div class="container !mx-auto !px-6 md:!px-12 !pt-24 !pb-16">
      <!-- Header with tennis ball decoration -->
      <div class="relative !mb-8">
        <div class="absolute -top-6 -right-6 w-16 h-16 rounded-full hidden md:block" style="background: var(--primary-green); opacity: 0.2"></div>
        
        <div class="flex flex-col md:flex-row justify-between items-center !mb-8">
          <div>
            <h1 class="text-3xl md:text-4xl !font-bold !mb-2" style="color: var(--primary-blue)">Member Notes - {{ memberName }}</h1>
            <p class="text-[var(--neutral-700)] max-w-xl">Manage and track notes for this member</p>
          </div>
          <button v-if="userRole === 'trainer'" @click="(_) => {exportTrainerNotes(notes)}" 
            class="!mt-4 md:mt-0 bg-[var(--primary-blue)] hover:bg-[var(--blue-dark)] text-white !px-5 !py-2.5 rounded-lg flex items-center !font-medium transition-colors shadow-md cursor-pointer"> 
            Export 
          </button>
          
          <button v-if="userRole === 'trainer'" 
            @click="showAddNoteModal = true" 
            class="!mt-4 md:mt-0 bg-[var(--primary-blue)] hover:bg-[var(--blue-dark)] text-white !px-5 !py-2.5 rounded-lg flex items-center !font-medium transition-colors shadow-md cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 !mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add New Note
          </button>
        </div>
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
      
      <!-- Empty state -->
      <div v-else-if="notes.length === 0" class="bg-white rounded-xl shadow-sm !p-12 text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--neutral-300)] !mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[var(--primary-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-2xl !font-bold text-[var(--neutral-800)] !mb-3">No notes found</h3>
        <p class="text-[var(--neutral-600)] !mb-6 max-w-md mx-auto">
          No notes found for this member. Add a new note to get started!
        </p>
        <button v-if="userRole === 'trainer'"
          @click="showAddNoteModal = true" 
          class="bg-[var(--primary-blue)] hover:bg-[var(--blue-dark)] text-white !px-6 !py-3 rounded-lg inline-flex items-center !font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 !mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add New Note
        </button>
      </div>
      
      <!-- Notes grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 !gap-6">
        <div v-for="note in notes" :key="note.id" class="w-full">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg hover:scale-[1.02] border border-transparent transition-all duration-300">
            <!-- Note header with date -->
            <div class="p-4 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                      :class="[
                        note.status === 'active' ? 'bg-green-100 text-green-800' : 
                        note.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                        'bg-orange-100 text-orange-800'
                      ]">
                  {{ note.status }}
                </span>
                <span class="text-xs text-[var(--neutral-600)]">{{ formatDate(note.created_at) }}</span>
              </div>
            </div>
            
            <!-- Note content -->
            <div class="p-4">
              <div class="text-[var(--neutral-800)] whitespace-pre-line h-24 overflow-hidden">
                {{ note.notes }}
              </div>
            </div>
            
            <!-- Note actions -->
            <div v-if="userRole === 'trainer'" class="px-4 py-3 bg-gray-50 flex justify-between items-center">
              <button @click="editNote(note)" class="text-[var(--primary-blue)] hover:text-[var(--blue-dark)] text-sm font-medium">
                Edit
              </button>
              <button @click="confirmDelete(note.id)" class="text-red-600 hover:text-red-800 text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Note Modal -->
      <div v-if="showAddNoteModal" class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-3">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" @click.stop>
          <!-- Header -->
          <div class="p-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-[var(--primary-blue)]">Add New Note</h2>
          </div>
          
          <!-- Form Content -->
          <div class="p-6 overflow-y-auto">
            <form @submit.prevent="addNote" class="!space-y-4">
              <div>
                <label for="noteContent" class="block text-sm font-medium text-gray-700 !mb-1">Note Content</label>
                <textarea 
                  id="noteContent" 
                  v-model="newNote.notes" 
                  rows="5" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                  placeholder="Enter your note here..."
                  required
                ></textarea>
              </div>
              
              <div>
                <label for="noteStatus" class="block text-sm font-medium text-gray-700 !mb-1">Status</label>
                <select 
                  id="noteStatus" 
                  v-model="newNote.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
            </form>
          </div>
          
          <!-- Footer with actions -->
          <div class="p-4 flex justify-end !space-x-2 border-t border-gray-200">
            <button 
              @click="showAddNoteModal = false" 
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="addNote" 
              class="px-4 py-2 bg-[var(--primary-blue)] text-white rounded-lg hover:bg-[var(--blue-dark)] text-sm font-medium transition-colors"
            >
              Add Note
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Note Modal -->
      <div v-if="showEditNoteModal" class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-3">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" @click.stop>
          <!-- Header -->
          <div class="p-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-[var(--primary-blue)]">Edit Note</h2>
          </div>
          
          <!-- Form Content -->
          <div class="p-6 overflow-y-auto">
            <form @submit.prevent="saveNote" class="!space-y-4">
              <div>
                <label for="editNoteContent" class="block text-sm font-medium text-gray-700 !mb-1">Note Content</label>
                <textarea 
                  id="editNoteContent" 
                  v-model="editingNote.notes" 
                  rows="5" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                  placeholder="Enter your note here..."
                  required
                ></textarea>
              </div>
              
              <div>
                <label for="editNoteStatus" class="block text-sm font-medium text-gray-700 !mb-1">Status</label>
                <select 
                  id="editNoteStatus" 
                  v-model="editingNote.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              
              <div v-if="editingNote.status === 'completed'">
                <label for="endDate" class="block text-sm font-medium text-gray-700 !mb-1">End Date</label>
                <input 
                  type="date" 
                  id="endDate" 
                  v-model="editingNote.end_date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                >
              </div>
            </form>
          </div>
          
          <!-- Footer with actions -->
          <div class="p-4 flex justify-end !space-x-2 border-t border-gray-200">
            <button 
              @click="showEditNoteModal = false" 
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="saveNote" 
              class="px-4 py-2 bg-[var(--primary-blue)] text-white rounded-lg hover:bg-[var(--blue-dark)] text-sm font-medium transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-3">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" @click.stop>
          <!-- Header -->
          <div class="p-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-[var(--primary-blue)]">Confirm Delete</h2>
          </div>
          
          <!-- Content -->
          <div class="p-6">
            <p class="text-[var(--neutral-700)]">Are you sure you want to delete this note? This action cannot be undone.</p>
          </div>
          
          <!-- Footer with actions -->
          <div class="p-4 flex justify-end !space-x-2 border-t border-gray-200">
            <button 
              @click="showDeleteModal = false" 
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="removeNote" 
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
            >
              Delete
            </button>
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
import { useRoute } from 'vue-router';
// import { useRoute, useRouter } from 'vue-router';
import { 
  createNote, 
  updateNote as updateNoteService, 
  deleteNote as deleteNoteService, 
  fetchMemberNotes
} from '@/services/noteServices';
import Navbar from '@/components/Navbar.vue';

// Import NoteData interface
import type { NoteData } from '@/services/noteServices';

// We need to import a service function for fetching member details
import { getMemberById } from '@/services/memberServices';
import {exportTrainerNotes} from '../utils/trainerNotesExport'


export interface Note {
  id: number | string;
  notes: string;
  status: 'active' | 'completed' | 'on-hold';
  created_at: string;
  end_date: string | null;
  // Add specific properties that might be used
  memberId?: number | string;
  trainer_id?: number | string;
  updated_at?: string;
}

interface EditingNote {
  id: number | string | null;
  notes: string;
  status: 'active' | 'completed' | 'on-hold';
  end_date: string | null;
}

interface NewNote {
  notes: string;
  status: 'active' | 'completed' | 'on-hold';
}

const route = useRoute();
// const router = useRouter(); 
const memberId = route.params.id as string; // Cast to string
const memberName = ref('');
const notes = ref<Note[]>([]); // Specify the type as Note[]
const loading = ref(true);

// Modal states
const showAddNoteModal = ref(false);
const showEditNoteModal = ref(false);
const showDeleteModal = ref(false);

// Note data
const newNote = ref<NewNote>({
  notes: '',
  status: 'active',
});

const editingNote = ref<EditingNote>({
  id: null,
  notes: '',
  status: 'active',
  end_date: null
});

const noteIdToDelete = ref<number | string | null>(null);

// Back button function
// const goBack = () => {
//   router.push({ name: 'userlisttest' });
// };

// Format date to display
const formatDate = (dateString: string): string => {
  if (!dateString) return "Tanggal tidak tersedia";
  
  // Validasi tanggal
  const timestamp = Date.parse(dateString);
  if (isNaN(timestamp)) return "Format tanggal tidak valid";
  
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
  }).format(date);
};

// Fetch member notes
const fetchNotes = async () => {
  try {
    loading.value = true;
    // Use the service function for notes
    const notesData = await fetchMemberNotes(memberId);
    notes.value = notesData;
    
    // Use service function for member details instead of direct fetch
    const memberData = await getMemberById(memberId);
    memberName.value = memberData.name;
  } catch (error) {
    console.error('Error fetching notes:', error);
  } finally {
    loading.value = false;
  }
};

// Add new note
const addNote = async () => {
  try {
    if (!newNote.value.notes.trim()) {
      alert('Note cannot be empty');
      return;
    }
    
    // Use the service function
    await createNote(memberId, newNote.value.notes, newNote.value.status);
    
    showAddNoteModal.value = false;
    newNote.value = { notes: '', status: 'active' };
    await fetchNotes();
  } catch (error) {
    console.error('Error adding note:', error);
    alert('Failed to add note');
  }
};

// Open edit modal with note data
const editNote = (note: Note) => {
  editingNote.value = {
    id: note.id,
    notes: note.notes,
    status: note.status,
    end_date: note.end_date ? note.end_date.slice(0, 10) : null // Format to YYYY-MM-DD
  };
  showEditNoteModal.value = true;
};

// Update note
const saveNote = async () => {
  try {
    if (!editingNote.value.notes.trim()) {
      alert('Note cannot be empty');
      return;
    }
    
    const noteData: NoteData = {
      notes: editingNote.value.notes,
      status: editingNote.value.status,
      end_date: editingNote.value.status === 'completed' ? editingNote.value.end_date : null
    };
    
    // Use the service function
    if (editingNote.value.id) {
      await updateNoteService(editingNote.value.id, noteData);
    }
    
    showEditNoteModal.value = false;
    await fetchNotes();
  } catch (error) {
    console.error('Error updating note:', error);
    alert('Failed to update note');
  }
};

// Show delete confirmation
const confirmDelete = (id: number | string) => {
  noteIdToDelete.value = id;
  showDeleteModal.value = true;
};

// Delete note
const removeNote = async () => {
  try {
    // Use the service function
    if (noteIdToDelete.value) {
      await deleteNoteService(noteIdToDelete.value);
    }
    
    showDeleteModal.value = false;
    noteIdToDelete.value = null;
    await fetchNotes();
  } catch (error) {
    console.error('Error deleting note:', error);
    alert('Failed to delete note');
  }
};

const userRole = ref("");

const getUserRole = async () => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    // Mengambil role dari API endpoint /me
    const response = await fetch(`${API_BASE_URL}/auth/me`, 
      {
        credentials: 'include',
      }
    );
    
    // Response berisi data user termasuk role
    const userData = await response.json();
    // Set role ke variabel userRole
    console.log(userData);
    if (!response.ok) {
      throw new Error('Failed to fetch user role');
    }
    userRole.value = userData.role || '';
    console.log(userRole.value);
    return userData.role;
  } catch (error) {
    console.error("Failed to get user role from API:", error);
    userRole.value = '';
    return '';
  }
};

onMounted(() => {
  // Fetch user role
  getUserRole();
  fetchNotes();
});
</script>