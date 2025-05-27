import express from "express";
import multer from "multer";
import {
  createRoom,
  getOwnerRooms,
  getRooms,
  toggleRoomAvailability,
} from "../controllers/roomController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireAuth } from "@clerk/express";

const roomRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

roomRouter.post("/", upload.array("images", 4), requireAuth, protect, createRoom);
roomRouter.get("/", getRooms);
roomRouter.get("/owner", requireAuth, protect, getOwnerRooms);
roomRouter.post("/toggle-availability", requireAuth, protect, toggleRoomAvailability);

export default roomRouter;
