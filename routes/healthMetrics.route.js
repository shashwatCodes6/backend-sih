import express from 'express';
import updateMetrics from '../controllers/healthMetrics.controller.js';
import { verifyJWT } from '../middleware/auth.middlware.js';
const router=express.Router();


router.post('/update', verifyJWT, updateMetrics);

export default router;