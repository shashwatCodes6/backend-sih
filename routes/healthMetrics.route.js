import express from 'express';
import updateMetrics from '../controllers/healthMetrics.controller.js';
const router=express.Router();


router.post('/update',updateMetrics);
export default router;