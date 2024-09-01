import express from 'express';
import {updateMetrics,fetchMetrics} from '../controllers/healthMetrics.controller.js';
import { verifyJWT } from '../middleware/auth.middlware.js';
const router=express.Router();


router.post('/update', verifyJWT, updateMetrics);
router.get('/getMetrics',verifyJWT,fetchMetrics);

export default router;