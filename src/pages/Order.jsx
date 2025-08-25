import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import noOrder from "../data/images/noOrder.png";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { setNewNotificationCount } from "../store/reducers/notification.slice";
import { useDispatch, useSelector } from "react-redux";

const Order = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const notificationCount = useSelector(
    (state) => state.notification.newNotificationCount
  );

  useEffect(() => {
    fetchOrders(selectedDate);
  }, [selectedDate]);

  const fetchOrders = async (date) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          authorization: `${token}`,
        },
      };

      const response = await axios.get(
        `/api/user/getOrders?date=${date}`,
        config
      );
      const ordersData = response.data.orders.map((order) => ({
        ...order,
        expanded: true,
      }));
      setOrders(ordersData);
      setIsEmpty(ordersData.length === 0);
    } catch (error) {
      setIsEmpty(true);
      console.error("Error fetching orders:", error);
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const cancelOrder = async (orderId, transactionId) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          authorization: `${token}`,
        },
      };

      const response = await axios.post(
        `/api/user/cancelOrder`,
        { orderId, transactionId },
        config
      );
      fetchOrders(selectedDate);
      dispatch(setNewNotificationCount(notificationCount + 1));
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(2);
  };

  const indexOfLastOrder = currentPage * 4;
  const indexOfFirstOrder = indexOfLastOrder - 4;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {isEmpty ? (
            <div className="flex flex-col sm:flex-row md:flex-row w-full justify-center">
              <div className=" w-full h-fit flex justify-center items-center flex-col gap-5 border bg-gray-50 pt-6 pb-10 rounded-md">
                <img
                  src={noOrder}
                  alt="empty_cart"
                  className=" w-full h-full md:w-full md:h-full lg:w-1/3 lg:h-1/3 sm:w-1/3 sm:h-1/3 p-5"
                />
                <p className=" text-2xl sm:text-3xl mt-10">No orders yet!</p>
                <Link
                  to="/explore/all"
                  className=" px-6 py-2 bg-black text-white rounded-md"
                >
                  Explore
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full sm:w-1/3">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <ul className="space-y-4 mt-4">
                {currentOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className={`order-item p-4 border rounded mb-4`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg">
                          {order.orderId} ({order.typeOfPayment})
                        </p>
                        <p className="text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p>
                          {order.address.addressLine1},
                          {order.address.addressLine2},
                          {order.address.addressLine3} - {order.address.pincode}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-gray-500">₹{order.totalAmount}</p>
                        <p
                          className={`ml-4 text-gray-500 ${
                            order.status === "Shipped"
                              ? "text-yellow-500"
                              : order.status === "Cancelled"
                              ? "text-red-500"
                              : order.status === "Requested cancellation"
                              ? "text-red-500"
                              : order.status === "Delivered"
                              ? "text-green-500"
                              : "text-green-500"
                          }`}
                        >
                          {order.status}
                        </p>
                      </div>
                    </div>
                    {/* Expanded details section */}
                    <div className="mt-4">
                      <div className="mt-4">
                        <div className="mt-2">
                          <p className="font-semibold">Products:</p>
                          <div className="list-disc list-inside">
                            {order.products.map((product, index) => (
                              <li key={index} className="text-gray-600">
                                {product.name} - {product.price}
                              </li>
                            ))}
                          </div>
                        </div>
                      </div>

                      {order.status === "Placed" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelOrder(order.orderId, order.transactionId);
                          }}
                          className="bg-black border border-black hover:text-black hover:bg-white text-white px-4 py-2 rounded mt-2"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </ul>

              {/* Pagination */}
              <div className="mt-4 flex justify-center">
                {orders.length > 4 && (
                  <ul className="flex list-none">
                    {Array.from({ length: Math.ceil(orders.length / 4) }).map(
                      (_, index) => (
                        <li
                          key={index}
                          onClick={() => paginate(index + 1)}
                          className={`cursor-pointer px-3 py-1 mx-1 rounded ${
                            currentPage === index + 1
                              ? "bg-gray-800 text-white"
                              : "bg-gray-300"
                          }`}
                        >
                          {index + 1}
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Order;
