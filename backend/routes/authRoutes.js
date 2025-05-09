import express from 'express';
import { register, login, logout, getProfile, googleLogin, googleCallback} from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multerMiddleware.js';

const router = express.Router();

router.post('/register',upload ,register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getProfile);
// Social login routes
router.post('/google', googleLogin);
router.post('/google/callback', googleCallback);

export default router;
