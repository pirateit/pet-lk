import express from 'express';
import { checkAuthenticated } from '../middleware/passport';
import { getAllServices, registerService } from '../controllers/services.controllers';
const router = express.Router();

router.get('/services', checkAuthenticated, getAllServices);
router.post('/services', checkAuthenticated, registerService);

export default router;
