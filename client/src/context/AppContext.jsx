import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [token, setToken] = useState("")

  const currency = import.meta.env.VITE_CURRENCY || "DKK";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();


  useEffect(() => {
    const logToken = async () => {
      try {
        const token = await getToken();
        setToken(token);
        console.log("Resolved token:", token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    logToken();
  }, [getToken]);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms");

      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message && "Failed to fetch rooms");
      }
    } catch (error) {
      console.error("❌ fetchUser error:", error); // <== Log full error
      toast.error(error.message && "Failed to fetch rooms");
    }
  };

  const fetchUser = async (accessToken) => {
    console.log("📦 Fetching user with token:", accessToken);
    try {
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("📦 User data fetched:", data);
      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
      }
    } catch (error) {
      console.error("🚨 fetchUser failed!");
      console.error("🔥 Error Status:", error?.response?.status);
      console.error("🔥 Error Data:", error?.response?.data);
      console.error("🔥 Full Error Object:", error);   
    
      toast.error(error?.response?.data?.message || "Failed to fetch user data");}
  };

  useEffect(() => {
    if (user && token) {
      console.log("📦 Calling fetchUser with token:", token);
      fetchUser(token);
    }
  }, [user, token]);


  useEffect(() => {
    fetchRooms();
  }, []);

  const value = {
    currency,
    navigate,
    user,
    token,
    getToken,
    isOwner,
    setIsOwner,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,
    axios,
    
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
