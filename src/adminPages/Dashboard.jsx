import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import people from "../data/images/people.png";
import pending from "../data/images/pending.png";
import completed from "../data/images/completed.png";
import products from "../data/images/products.png";
import axios from "axios";

const Dashboard = () => {
  const [details, setDetails] = useState({
    userCount: 0,
    productCount: 0,
    pendingOrdersCount: 0,
    completedOrdersCount: 0,
  });

  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          headers: {
            authorization: token,
          },
        };

        const [detailsRes, outOfStockRes, latestOrdersRes] = await Promise.all([
          axios.get(`/api/admin/getDashboardDetails`, headers),
          axios.get(`/api/admin/getOutOfStock`, headers),
          axios.get(`/api/admin/getLatestOrders`, headers),
        ]);

        setDetails(detailsRes.data);
        setOutOfStockProducts(outOfStockRes.data.outOfStockProducts);
        setLatestOrders(latestOrdersRes.data.latestOrders);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDetails();
  }, []);

  const boxes = [
    {
      image: people,
      number: details.userCount,
      label: "Users",
    },
    {
      image: products,
      number: details.productCount,
      label: "Products",
    },
    {
      image: completed,
      number: details.completedOrdersCount,
      label: "Completed Orders",
    },
    {
      image: pending,
      number: details.pendingOrdersCount,
      label: "Pending Orders",
    },
  ];

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-10">
        {boxes.map((box, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border shadow-md">
            <img
              src={box.image}
              alt={box.label}
              className="h-24 w-24 object-cover mb-4 mx-auto"
            />
            <p className="text-xl font-bold text-gray-800 text-center">
              {box.number}
            </p>
            <p className="text-gray-600 text-center">{box.label}</p>
          </div>
        ))}
      </div>

      {/* Side-by-side tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-10 pb-10">
        {/* Out of Stock Table */}
        <div className="bg-white rounded-lg border shadow-md overflow-x-auto h-96 overflow-y-auto">
          <h2 className="text-xl font-semibold p-4 border-b">
            Out of Stock Products
          </h2>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Brand</th>
                <th className="px-4 py-2">Discount</th>
              </tr>
            </thead>
            <tbody>
              {outOfStockProducts && outOfStockProducts.length > 0 ? (
                outOfStockProducts.map((product, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.Brand?.name}</td>
                    <td className="px-4 py-2">{product.discount}%</td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td className="px-4 py-2" colSpan="3">
                      No out of stock products
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Latest Orders Table */}
        <div className="bg-white rounded-lg border shadow-md overflow-x-auto h-96 overflow-y-auto">
          <h2 className="text-xl font-semibold p-4 border-b">Latest Orders</h2>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Payment Type</th>
                <th className="px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders && latestOrders.length > 0 ? (
                latestOrders.map((order, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{order.orderId}</td>
                    <td className="px-4 py-2">{order.typeOfPayment}</td>
                    <td className="px-4 py-2">₹{order.totalAmount}</td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td className="px-4 py-2" colSpan="3">
                      No recent orders
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
