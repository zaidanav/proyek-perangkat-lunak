import express from 'express';
import { addMemberControllers, getMemberControllers, getMemberByIdControllers ,deleteMemberControllers, updateMemberControllers, getProfileControllers, updateProfileControllers, checkPhoneNumberController, changePasswordController } from '../controllers/memberController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multerMiddleware.js';
import checkRole from '../middlewares/checkRoleMiddleware.js';
import { getMembers } from '../controllers/filterAndSortController.js';

const router = express.Router();

router.post('/add-member',authMiddleware,checkRole(['admin']), addMemberControllers);
router.get('/members', authMiddleware, getMembers);
router.get('/get-member/:id', getMemberByIdControllers);
router.delete('/delete-member/:id',authMiddleware, checkRole(['admin']), deleteMemberControllers);
router.put('/update-member/:id', authMiddleware, checkRole(['admin']), updateMemberControllers);
router.get('/profile',authMiddleware ,getProfileControllers);
router.put('/update-profile',authMiddleware ,upload ,updateProfileControllers);
router.post('/check-phone',authMiddleware ,checkPhoneNumberController);
router.post('/change-password', changePasswordController);

export default router;