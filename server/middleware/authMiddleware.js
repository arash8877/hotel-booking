import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authData = req.auth ? req.auth() : null;
    const userId = authData?.userId;
    console.log("🔑 User ID from auth:", userId);

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const user = await User.findById( userId );


    if (!user) {
      console.log("🕳 User not found in DB");
      return res.status(404).json({ success: false, message: "User not found in DB" });
    }

    req.user = user;


    console.log("✅ User authenticated:", user.email);


    next();
  } catch (error) {
    console.error("Error in protect middleware:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


