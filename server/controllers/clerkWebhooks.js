import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  console.log("🔥 Clerk webhook hit!", req.body);

  try {
    // Create a Svix instance with clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    // Getting headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-signature": req.headers["svix-signature"],
      "svix-timestamp": req.headers["svix-timestamp"],
    };
    // Verifying headers
    await whook.verify(JSON.stringify(req.body), headers);

    //Getting data from request body
    const { data, type } = req.body;
    console.log("📦 Webhook data:", data);
    const userData = {
      _id: data.id,
      clerkId: data.id, 
      email: data.email_addresses[0].email_address,
      userName: data.first_name + data.last_name,
      image: data.image_url,
      recentSearchCities: [], 
    };

    // Switch cases for different webhook events
    switch (type) {
      case "user.created": {
        await User.create(userData);
        break;
      }

      case "user.updated": {
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        break;s
    }
    res.json({
      status: "success",
      message: "Webhook received",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default clerkWebhooks;
