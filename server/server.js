import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkClient, clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.jsx";

connectDB();

const app = express();
app.use(cors()); //Enable cross-origin resource sharing

app.get("/", (req, res) => res.send("API is working!"));
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(clerkMiddleware());

// API to listen to Clerk webhooks
app.use("/api/clerk", clerkWebhooks);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
