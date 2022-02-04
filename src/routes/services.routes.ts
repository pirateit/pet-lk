import express from 'express';
import { checkAdmin, checkAuthenticated } from '../middleware/passport';
import { addService, getService, getServices, registerService, updateService } from '../controllers/services.controllers';
import { getUserData } from '../middleware/interface';
const router = express.Router();

router.get('/services', checkAuthenticated, checkAdmin, getUserData, getServices);
router.get('/services/:id', checkAuthenticated, checkAdmin, getUserData, getService);
router.post('/services/:id', checkAuthenticated, checkAdmin, getUserData, updateService);
router.get('/add-service', checkAuthenticated, checkAdmin, getUserData, addService);
router.post('/services', checkAuthenticated, checkAdmin, getUserData, registerService);

export default router;
