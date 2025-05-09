// notesRoutes.js
import { Router } from 'express';
import { 
  createNote, 
  getMemberNotes, 
  getNoteById, 
  updateNote, 
  deleteNote,
  getTrainerNotes,
  checkTrainerAccess
} from '../controllers/notesController.js';
import authMiddleware  from '../middlewares/authMiddleware.js';

const router = Router();

// Routes dengan authentication
router.post('/notes', authMiddleware, createNote);
router.get('/notes/trainer', authMiddleware, getTrainerNotes);
router.get('/notes/member/:memberId', authMiddleware, checkTrainerAccess, getMemberNotes);
router.get('/notes/:id', authMiddleware, getNoteById);
router.put('/notes/:id', authMiddleware, updateNote);
router.delete('/notes/:id', authMiddleware, deleteNote);

export default router;