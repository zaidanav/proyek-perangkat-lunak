import express from 'express';
import { createEventController, readEventController, deleteEventContorller, updateEventController, readEventControllerId, likeEventController, unlikeEventController, readLikedEventControllerId } from '../controllers/eventController.js';
import { upload } from '../middlewares/multerMiddleware.js';

const router = express.Router();

router.post('/events', upload, createEventController);
router.get('/events', readEventController)
router.delete('/events/:id', deleteEventContorller)
router.put('/events/:id', upload, updateEventController);
router.get('/eventDetails/:id', readEventControllerId);
router.post('/likeEvent', likeEventController);
router.post('/unlikeEvent', unlikeEventController);
router.get('/likedEvents/:userId', readLikedEventControllerId);

export default router;