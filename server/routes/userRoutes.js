import express from "express";
import { protect } from "../middleware/authMiddleware.js"; 
import { getUserData, storeRecentSearchCities } from "../controllers/userController.js";
import { requireAuth } from "@clerk/express";

const userRouter = express.Router();

userRouter.get("/",requireAuth, protect, getUserData);
userRouter.post("/store-recent-search",requireAuth, protect, storeRecentSearchCities);

export default userRouter;
