import Hotel from "../models/Hotel";

// API to create a new room for a hotel
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    const hotel = await Hotel.findById({ owner: req.auth.userId });

    if (!hotel) return res.json({ success: false, message: "Hotel not found" });

    // upload images to cloudinary
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    // Wait for all uploads to complete
    const images = await Promise.all(uploadImages);

    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });

    res.json({
      success: true,
      message: "Room created successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get all rooms
export const getRooms = async (req, res) => {};

// API to get all rooms for a specific hotel
export const getOwnerRooms = async (req, res) => {};
