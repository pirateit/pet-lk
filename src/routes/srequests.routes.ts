import express from 'express';
import { checkAdmin, checkAuthenticated } from '../middleware/passport';
import { getRequest, getRequests, newRequest, createRequest, updateRequest } from '../controllers/requests.controllers';
import { getUserData } from '../middleware/interface';
var router = express.Router();

router.get('/requests', checkAuthenticated, getUserData, getRequests);
router.get('/requests/:id', checkAuthenticated, getUserData, getRequest);
router.post('/requests/:id', checkAuthenticated, checkAdmin, getUserData, updateRequest);
router.get('/new-request', checkAuthenticated, getUserData, newRequest);
router.post('/requests', checkAuthenticated, getUserData, createRequest);

export default router;
