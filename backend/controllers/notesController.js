import { prisma } from "../db/prisma/prisma.js";

export const createNote = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const { memberId, notes } = req.body;
        
        // Validate input
        if (!memberId || !notes) {
        return res.status(400).json({ error: 'Member ID and notes are required' });
        }
        
        // Create new assignment with notes
        const newAssignment = await prisma.training_assignments.create({
        data: {
            trainer_id: parseInt(userId),
            member_id: parseInt(memberId),
            start_date: new Date(),
            notes: notes,
            status: 'active'
        }
        });
        
        return res.status(201).json({
        message: 'Note created successfully',
        data: newAssignment
        });
    } catch (error) {
        console.error('Error creating note:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};


export const getMemberNotes = async (req, res) => {
  try {
    const memberId = parseInt(req.params.memberId);
    console.log('Member ID:', req.params.memberId);
    const notes = await prisma.training_assignments.findMany({
      where: {
        member_id: memberId
      },
      orderBy: {
        created_at: "desc"
      },
      include: {
        // Include trainer information with correct fields from users model
        users_training_assignments_trainer_idTousers: {
          select: {
            id: true,
            username: true,  // replaced 'name' with 'username'
            email: true,
            avatar: true
          }
        }
      }
    });
    
    return res.status(200).json(notes);
  } catch (error) {
    console.error('Error getting member notes:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


export const getNoteById = async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    
    const note = await prisma.training_assignments.findUnique({
      where: {
        id: noteId
      },
      include: {
        // Include trainer information
        users_training_assignments_trainer_idTousers: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true
          }
        },
        // Include member information
        users_training_assignments_member_idTousers: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true
          }
        }
      }
    });
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    // Rename properties for more intuitive response structure
    const formattedNote = {
      ...note,
      trainer: note.users_training_assignments_trainer_idTousers,
      member: note.users_training_assignments_member_idTousers,
      // Remove the verbose property names from the response
      users_training_assignments_trainer_idTousers: undefined,
      users_training_assignments_member_idTousers: undefined
    };
    
    return res.status(200).json(formattedNote);
  } catch (error) {
    console.error('Error getting note:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const updateNote = async (req, res) => {
    try {
      const { userId, role } = req.user;
      const noteId = parseInt(req.params.id);
      const { notes, status, end_date } = req.body;
      
      // Check if note exists
      const existingNote = await prisma.training_assignments.findUnique({
        where: {
          id: noteId
        }
      });
      
      if (!existingNote) {
        return res.status(404).json({ error: 'Note not found' });
      }
      
      // Only allow trainer who created the note or admin to update
      if (role !== 'admin' && existingNote.trainer_id !== parseInt(userId)) {
        return res.status(403).json({ error: 'Not authorized to update this note' });
      }
      
      // Update note
      const updatedNote = await prisma.training_assignments.update({
        where: {
          id: noteId
        },
        data: {
          notes: notes || existingNote.notes,
          status: status || existingNote.status,
          end_date: end_date ? new Date(end_date) : existingNote.end_date,
          updated_at: new Date()
        }
      });
      
      return res.status(200).json({
        message: 'Note updated successfully',
        data: updatedNote
      });
    } catch (error) {
      console.error('Error updating note:', error);
      return res.status(500).json({ error: 'Server error' });
    }
};

// Delete a note
export const deleteNote = async (req, res) => {
    try {
      const { userId, role } = req.user;
      const noteId = parseInt(req.params.id);
      
      // Check if note exists
      const existingNote = await prisma.training_assignments.findUnique({
        where: {
          id: noteId
        }
      });
      
      if (!existingNote) {
        return res.status(404).json({ error: 'Note not found' });
      }
      
      // Only allow trainer who created the note or admin to delete
      if (role !== 'admin' && existingNote.trainer_id !== parseInt(userId)) {
        return res.status(403).json({ error: 'Not authorized to delete this note' });
      }
      
      // Delete note
      await prisma.training_assignments.delete({
        where: {
          id: noteId
        }
      });
      
      return res.status(200).json({
        message: 'Note deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  
  // Get all notes for a trainer
  export const getTrainerNotes = async (req, res) => {
    try {
      const { userId } = req.user;
      
      const notes = await prisma.training_assignments.findMany({
        where: {
          trainer_id: parseInt(userId)
        },
        orderBy: {
          created_at: 'desc'
        },
        include: {
          users_training_assignments_member_idTousers: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      return res.status(200).json(notes);
    } catch (error) {
      console.error('Error getting trainer notes:', error);
      return res.status(500).json({ error: 'Server error' });
    }
};

// Middleware to check if trainer has access to the member
export const checkTrainerAccess = async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    const memberId = parseInt(req.params.memberId || req.body.memberId);
    
    // Admin can access all members
    if (role === 'admin') {
      return next();
    }

    if (role === 'member' && memberId == parseInt(userId)) {
      return next();
    }
    
    // Check if the trainer has access to this member
    if (role === 'trainer') {
      const trainerMember = await prisma.trained_by.findUnique({
        where: {
          trainer_id_member_id: {
            trainer_id: parseInt(userId),
            member_id: memberId
          }
        }
      });
      
      if (!trainerMember) {
        return res.status(403).json({ error: 'You do not have access to this member' });
      }
      
      return next();
    }
    
    return res.status(403).json({ error: 'Unauthorized' });
  } catch (error) {
    console.error('Error checking trainer access:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
