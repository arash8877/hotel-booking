import { useState, useEffect } from "react";
import Title from "../../components/Title";
import { assets, dashboardDummyData } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0,
  });
  const { user, currency, getToken, toast, axios } = useAppContext();

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("/api/bookings/hotel", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (response.data) {
        setDashboardData(response.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error(error.message, "Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subTitle="Monitor your room listing, track bookings and analyze revenue-all in one-place. Stay updated with real-time insights to ensure smooth operations"
      />

      <div className="flex gap-4 my-8">
        {/* ----- Total Bookings ----- */}
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img src={assets.totalBookingIcon} alt="booking-icon" className="max-sm:hidden h-10" />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Bookings</p>
            <p className="text-neutral-400 text-base">{dashboardData.totalBookings}</p>
          </div>
        </div>
        {/* ----- Total Revenue ----- */}
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img src={assets.totalRevenueIcon} alt="revenue-icon" className="max-sm:hidden h-10" />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Revenue</p>
            <p className="text-neutral-400 text-base">{currency} {dashboardData.totalRevenue}</p>
          </div>
        </div>
        {/* ----- Recent Bookings ----- */}
      </div>

      <h2 className="text-xl text-blue-950/70 font-medium mb-5">Recent Bookings</h2>
      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">User Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">Room Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium">Total Amount</th>
              <th className="py-3 px-4 text-gray-800 font-medium">Payment Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {dashboardData.bookings.map((booking) => (
              <tr key={booking._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {booking.user.username}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                  {booking.room.roomType}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:text-center">
                  {currency} {booking.totalPrice}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 flex">
                  <button
                    className={`py-1 px-3 text-xs rounded-full mx-auto ${
                      booking.isPaid
                        ? "bg-green-200 text-green-600"
                        : "bg-amber-200 text-yellow-600"
                    }`}
                  >
                    {booking.isPaid ? "Completed" : "Pending"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
