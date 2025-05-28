import { useMemo, useState } from "react";
import { assets, facilityIcons, roomsDummyData } from "../assets/assets";
import { useNavigate, useSearchParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input type="radio" name="sortOptions" checked={selected} onChange={(e) => onChange(label)} />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};
//----------------------- Main Component -----------------------
const AllRooms = () => {
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({ roomTypes: [], priceRange: [] });
  const [selectedSort, setSelectedSort] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { rooms, currency } = useAppContext();
  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRange = ["0-500", "500-1000", "1000-2000", "2000-3000"];
  const sortOptions = ["Price: Low to High", "Price: High to Low", "Newest First"];

  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (checked) {
        updatedFilters[type].push(value);
      } else {
        updatedFilters[type] = updatedFilters[type].filter((item) => item !== value);
      }
      return updatedFilters;
    });
  };

  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
  };

  // function to check if a room matches the selected filters
  const matchRoomType = (room) => {
    return (
      selectedFilters.roomTypes.length === 0 || selectedFilters.roomTypes.includes(room.roomType)
    );
  };

  // function to check if a room matches the selected price range
  const matchesPriceRange = (room) => {
    return (
      selectedFilters.priceRange.length === 0 ||
      selectedFilters.priceRange.some((range) => {
        const [min, max] = range.split("-").map(Number);
        return room.pricePerNight >= min && room.pricePerNight <= max;
      })
    );
  };

  // function to sort rooms based on selected sort option
  const sortRooms = (rooms) => {
    if (selectedSort === "Price: Low to High") {
      return [...rooms].sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (selectedSort === "Price: High to Low") {
      return [...rooms].sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (selectedSort === "Newest First") {
      return [...rooms].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return rooms;
  };

  // filter destination
  const filterDestination = (room) => {
    const destination = searchParams.get("destination") || "";
    if (!destination) return true;
    return room.hotel.city.toLowerCase().includes(destination.toLowerCase());
  };

  // filter and sort rooms based on the selected filters and sort option
  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => matchRoomType(room) && matchesPriceRange(room) && filterDestination(room))
      .sort(sortRooms);
  }, [rooms, selectedFilters, selectedSort, searchParams]);

  // clear all filters
  const clearFilters = () => {
    setSelectedFilters({ roomTypes: [], priceRange: [] });
    setSelectedSort("");
    setSearchParams({});
  };

  //--------------------------- JSX ----------------------------
  return (
    <div className="flex flex-col items-start gap-6 justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div>
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take advantage of our limited-time offers and special packages to enhance your stay and
            create unforgettable memories.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between w-full gap-8 lg:flex-row-reverse">
        <div className="bg-white w-80 h-fit border border-gray-300 text-gray-600 max-lg:mb-8">
          <div
            className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${
              openFilters && "border-b"
            }`}
          >
            <p className="text-base font-medium text-gray-800">FILTERS</p>
            <div className="text-xs cursor-pointer">
              <span onClick={() => setOpenFilters(!openFilters)} className="lg:hidden">
                {openFilters ? "HIDE" : "SHOW"}
              </span>
              <span className="hidden lg:block">CLEAR</span>
            </div>
          </div>

          <div
            className={`${
              openFilters ? "h-auto" : "h-0 lg:h-auto overflow-hidden transition-all duration-700"
            }`}
          >
            <div className="px-5 pt-5">
              <p className="font-medium text-gray-800 pb-2">Popular filters</p>

              {roomTypes.map((room, index) => (
                <CheckBox
                  key={index}
                  label={room}
                  selected={selectedFilters.roomTypes.includes(room)}
                  onChange={(checked) => handleFilterChange(checked, room, "roomTypes")}
                />
              ))}
            </div>

            <div className="px-5 pt-5">
              <p className="font-medium text-gray-800 pb-2">Price Range</p>

              {priceRange.map((range, index) => (
                <CheckBox
                  key={index}
                  label={`DKK ${range}`}
                  selected={selectedFilters.priceRange.includes(range)}
                  onChange={(checked) => handleFilterChange(checked, range, "priceRange")}
                />
              ))}
            </div>

            <div className="px-5 pt-5 pb-6">
              <p className="font-medium text-gray-800 pb-2">Sort By</p>

              {sortOptions.map((option, index) => (
                <RadioButton
                  key={index}
                  label={option}
                  selected={selectedSort === option}
                  onChange={() => handleSortChange(option)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {filteredRooms.map((room) => (
            <div
              key={room._id}
              className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0"
            >
              <img
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                src={room.images[0]}
                alt="hotel-img"
                title="View Room Details"
                className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
              />
              <div className="md:w-1/2 flex flex-col gap-2">
                <p className="text-gray-500">{room.hotel.city}</p>
                <p
                  onClick={() => {
                    navigate(`/rooms/${room._id}`);
                    scrollTo(0, 0);
                  }}
                  className="text-gray-800 text-3xl font-playfair cursor-pointer"
                >
                  {room.hotel.name}
                </p>
                <div className="flex items-center">
                  <StarRating rating={room.rating} />
                  <p className="ml-2">200+ reviews</p>
                </div>
                <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                  <img src={assets.locationIcon} alt="location-icon" className="" />
                  <span>{room.hotel.address}</span>
                </div>

                <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                  {room.amenities.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]"
                    >
                      <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                      <p className="text-xs">{item}</p>
                    </div>
                  ))}
                </div>

                <p
                  className="text-xl font-medium text-gray-700
        "
                >
                  DKK {room.pricePerNight} /night
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
