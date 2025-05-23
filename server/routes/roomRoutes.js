import express from 'express';
import { createRoom } from '../controllers/roomController';
import { protect } from '../middleware/authMiddleware.js';

const roomRouter = express.Router();

roomRouter.post('/', upload.array('images', 4), protect, createRoom)

export default roomRouter;