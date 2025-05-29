// Get/api/user

export const getUserData = async (req, res) => {
  try {
    console.log("🔍 Clerk Auth Info:", req.auth);
    console.log("👤 User from DB:", req.user);

    const role = req.user.role;
    const recentSearchCities = req.user.recentSearchCities;
    res.json({ success: true, role, recentSearchCities });
  } catch (error) {
    res.json({ success: false, message: error.message && 'Error occurred while fetching user data' });
  }
};

//Store user recent searched cities in database
export const storeRecentSearchCities = async (req, res) => {
  try {
    const { recentSearchCities } = req.body;
    const user = req.user;

    if (user.recentSearchCities.length < 3) {
      user.recentSearchCities.push(recentSearchCities);
    } else {
      user.recentSearchCities.shift();
      user.recentSearchCities.push(recentSearchCities);
    }
    await user.save();
    res.json({ success: true, message: "City added" }); 
  } catch (error) {
    res.json({ success: false, message: error.message && 'Error occurred while storing recent search cities' });
  }
};
