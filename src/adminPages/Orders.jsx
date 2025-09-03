import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Undo from "../components/Undo";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_BASE
            }/api/admin/getOrders?searchquery=${searchQuery}&page=${currentPage}`,
            {
              headers: {
                authorization: `${token}`,
              },
            }
          );
          const data = response.data;
          setOrders(data);
        } catch (error) {
          console.log(error);
        }
      } else {
        localStorage.setItem("token", "");
        window.location.reload();
      }
    };

    fetchOrder();
  }, [searchQuery, currentPage]);

  const getDate = (date) => {
    return date;
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToNextPage = () => {
    if (orders.length === 0) return;
    if (orders.length < 11) return;

    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="p-3 flex justify-between">
        <div className="p-2 bg-gray-100 w-full md:w-1/2 lg:w-1/3 md:mr-2 flex gap-1 items-center rounded-md">
          <SearchIcon />
          <input
            type="text"
            className="outline-none bg-gray-100 w-full"
            placeholder="Search By Name/OrderId/Phone/TransactionId"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="overflow-x-auto w-full min-h-[700px]">
        <table className="min-w-full divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                OrderId
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TransactionID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ammount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                UserId
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pincode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-gray-200">
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td className="px-6 py-4 whitespace-nowrap">{order.orderId}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.transactionId || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.amount || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.pincode || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.date || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.status || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.payment || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      navigate(`/order/orderDetails/${order.orderId}`);
                    }}
                  >
                    <MoreHorizIcon sx={{ fontSize: 20 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-2">
        <button
          onClick={goToPrevPage}
          className="p-2  w-10 text-black flex justify-center"
        >
          <ChevronLeftIcon />
        </button>
        <div className="p-2  w-10 text-black flex justify-center">
          <p className="self-center">{currentPage}</p>
        </div>
        <button
          onClick={goToNextPage}
          className="p-2  w-10 text-black flex justify-center"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
