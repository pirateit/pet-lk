import express from 'express';
import { checkAuthenticated } from '../middleware/passport';
import { getRequest, getAllUserRequests, registerRequest } from '../controllers/requests.controllers';
const router = express.Router();

router.get('/requests', checkAuthenticated, getAllUserRequests);
router.get('/requests/:id', checkAuthenticated, getRequest);
router.post('/requests', checkAuthenticated, registerRequest);

export default router;
