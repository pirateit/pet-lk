import express from 'express';
import { checkAdmin, checkAuthenticated } from '../middleware/passport';
import { getAdminRequest, getAdminPage, getAllRequests, updateAdminRequest } from '../controllers/requests.controllers';
import { getUser, getUsers } from '../controllers/users.controllers';
const router = express.Router();

router.get('/admin', checkAuthenticated, checkAdmin, getAdminPage);
router.get('/admin/requests', checkAuthenticated, checkAdmin, getAllRequests);
router.get('/admin/requests/:id', checkAuthenticated, checkAdmin, getAdminRequest);
router.post('/admin/requests/:id', checkAuthenticated, checkAdmin, updateAdminRequest);
router.get('/admin/users', checkAuthenticated, checkAdmin, getUsers);
router.get('/admin/users/:id', checkAuthenticated, checkAdmin, getUser);
// router.post('/admin/users/:id', checkAuthenticated, checkAdmin, );

export default router;
