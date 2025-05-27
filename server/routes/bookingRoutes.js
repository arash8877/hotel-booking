import express from "express";
import {
  checkAvailabilityAPI,
  createBooking,
  getHotelBookings,
  getUserBookings,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireAuth } from "@clerk/express";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityAPI);
bookingRouter.post("/book", requireAuth, protect, createBooking);
bookingRouter.get("/user", requireAuth, protect, getUserBookings);
bookingRouter.get("/hotel", requireAuth, protect, getHotelBookings);

export default bookingRouter;
