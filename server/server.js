import express from "express";
import { clerkMiddleware } from "@clerk/express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

connectDB();
connectCloudinary();

const app = express();
app.use(cors());

// ✨ Middleware ✨
app.use(express.json());
app.use(clerkMiddleware()); // This populates req.auth

app.use((req, res, next) => {
    console.log("📦 req.auth after Clerk middleware:", req.auth);
    next();
  });


// Routes
app.use("/api/clerk", clerkWebhooks); 
app.get("/", (req, res) => res.send("API is working!"));
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Server is running on port ${PORT}`));
