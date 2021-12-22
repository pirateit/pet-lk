import express from 'express';
import { checkAuthenticated } from '../middleware/passport';
import { getProfile, updateUser, deleteUser } from '../controllers/users.controllers';
const router = express.Router();

router.get('/profile', checkAuthenticated, getProfile);
// router.post('/signup', createUser);
router.post('/users/:id', checkAuthenticated, updateUser);
router.delete('/users/:id', checkAuthenticated, deleteUser);

export default router;
