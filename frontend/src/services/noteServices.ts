const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define interfaces for your data structures
export interface NoteData {
  notes?: string;
  status?: 'active' | 'completed' | 'on-hold';
  memberId?: number | string;
  end_date?: string | null;
  // Add any other specific properties that might be used
  // Instead of using [key: string]: any
}

/**
 * Fetch all notes for a specific member
 * @param {number} memberId - ID of the member to fetch notes for
 * @returns {Promise} - Promise with notes data
 */
export const fetchMemberNotes = async (memberId: number | string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/member/${memberId}`, {
      credentials: 'include'
    }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching member notes:', error);
    throw error;
  }
};

/**
 * Create a new note
 * @param {number} memberId - ID of the member the note is for
 * @param {string} notes - The note content
 * @param {string} status - The status of the note (active, completed, on-hold)
 * @returns {Promise} - Promise with created note data
 */
export const createNote = async (memberId: number | string, notes: string, status: string = 'active') => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`,
       {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        memberId,
        notes,
        status
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

/**
 * Update an existing note
 * @param {number} noteId - ID of the note to update
 * @param {Object} noteData - Object containing note data to update
 * @returns {Promise} - Promise with updated note data
 */
export const updateNote = async (noteId: number | string, noteData: NoteData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(noteData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

/**
 * Delete a note
 * @param {number} noteId - ID of the note to delete
 * @returns {Promise} - Promise with response data
 */
export const deleteNote = async (noteId: number | string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      credentials: 'include',
      method: 'DELETE'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

/**
 * Get a single note by ID
 * @param {number} noteId - ID of the note to fetch
 * @returns {Promise} - Promise with note data
 */
export const getNoteById = async (noteId: number | string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`,
      {
        credentials: 'include'
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
};

/**
 * Fetch all notes created by the current trainer
 * @returns {Promise} - Promise with notes data
 */
export const fetchTrainerNotes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/trainer`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trainer notes:', error);
    throw error;
  }
};