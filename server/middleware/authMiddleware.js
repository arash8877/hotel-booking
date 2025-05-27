import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth || {};

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found in DB" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protect middleware:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
