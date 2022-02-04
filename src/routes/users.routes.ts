import express from 'express';
import { checkAdmin, checkAuthenticated } from '../middleware/passport';
import { getProfile, getUser, getUsers, updateUser, deleteUser } from '../controllers/users.controllers';
import { getUserData } from '../middleware/interface';
const router = express.Router();

router.get('/profile', checkAuthenticated, getUserData, getProfile);
router.get('/users', checkAuthenticated, checkAdmin, getUserData, getUsers);
router.get('/users/:id', checkAuthenticated, checkAdmin, getUserData, getUser);
router.post('/users/:id', checkAuthenticated, getUserData, updateUser);
router.delete('/users/:id', checkAuthenticated, getUserData, deleteUser);

export default router;
