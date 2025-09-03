import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `/api/admin/getOrder`,
        { orderId },
        {
          headers: { authorization: token },
        }
      );

      const fetchedOrder = response.data.order;
      setOrder(fetchedOrder);
      setStatus(fetchedOrder.status);
    };

    fetchOrder();
  }, [orderId]);

  const handleSubmit = async () => {
    if (!order) return;

    setIsSubmitting(true);

    const token = localStorage.getItem("token");

    try {
      console.log(order);
      await axios.post(
        `/api/admin/updateOrder`,
        {
          state: status,
          orderId: order.orderId,
          transactionId: order.transactionId,
          userId: order.userId,
          typeOfPayment: order.typeOfPayment,
          products: order.products,
          comment: comment.trim(),
        },
        {
          headers: { authorization: token },
        }
      );

      alert("Order updated successfully.");
      setComment("");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) return null;

  return (
    <DashboardLayout>
      <div className="mx-auto p-6 bg-white ">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Order Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-semibold">Order ID:</span> {order.orderId}
            </p>
            <p>
              <span className="font-semibold">Transaction ID:</span>{" "}
              {order.transactionId}
            </p>
            <p>
              <span className="font-semibold">Payment Type:</span>{" "}
              {order.typeOfPayment}
            </p>
            <p>
              <span className="font-semibold">Total Amount:</span> ₹
              {order.totalAmount}
            </p>
          </div>

          <div className="space-y-3">
            <label className="block font-semibold text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Placed">Placed</option>
              <option value="Requested cancellation">
                Requested Cancellation
              </option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Shipping Address
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg border space-y-1 text-gray-700">
            <p>{order.address.name}</p>
            <p>{order.address.mobile}</p>
            <p>{order.address.addressLine1}</p>
            <p>{order.address.addressLine2}</p>
            <p>{order.address.addressLine3}</p>
            <p>{order.address.pincode}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Products</h3>
          <div className="space-y-4">
            {order.products.map((product) => (
              <div
                key={product.id}
                className="flex items-center border p-4 rounded-lg bg-gray-50"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded mr-4"
                />
                <div className="text-gray-700">
                  <p className="font-semibold">{product.name}</p>
                  <p>Price: ₹{product.price}</p>
                  <p>Discount: {product.discount}%</p>
                  <p>Stock: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {order.status !== "Delivered" ? (
          <>
            <div className="mt-10 border-t pt-6">
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Admin Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Enter any notes or comments regarding this order..."
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded disabled:opacity-50"
              >
                {isSubmitting ? "Updating..." : "Update Order"}
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrderDetails;
