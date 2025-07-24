import express from 'express';
import { getUtilities } from '../controller/utilityController.js';

const router = express.Router();

router.get('/', getUtilities);

export default router;
