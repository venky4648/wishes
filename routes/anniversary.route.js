import express from 'express';
import { createAnniversary } from '../controllers/anniversary.controller.js';


const router = express.Router();

router.post('/create-anniversary', createAnniversary);

export default router;