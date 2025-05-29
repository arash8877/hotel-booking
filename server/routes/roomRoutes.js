import express from "express";
import multer from "multer";
import {
  createRoom,
  getOwnerRooms,
  getRooms,
  toggleRoomAvailability,
} from "../controllers/roomController.js";
import { protect } from "../middleware/authMiddleware.js";

const roomRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

roomRouter.post("/", upload.array("images", 4), protect, createRoom);
roomRouter.get("/", getRooms);
roomRouter.get("/owner", protect, getOwnerRooms);
roomRouter.post("/toggle-availability", protect, toggleRoomAvailability);

export default roomRouter;
