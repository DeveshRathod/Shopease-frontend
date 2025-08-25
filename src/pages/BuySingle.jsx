import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

const BuySingle = () => {
  const { id, colorIndex } = useParams();
  const [product, setProduct] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.post(`/api/products/getProduct`, {
          productId: id,
        });
        setProduct(response.data);
      } catch (error) {
        setIsEmpty(true);
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      const totalPrice = product.price;
      const totalDiscount = (product.price * product.discount) / 100;
      const discountedTotalAmount = totalPrice - totalDiscount;
      const deliveryCharges = discountedTotalAmount >= 500 ? 0 : 40;
      const totalAmount = discountedTotalAmount + deliveryCharges;

      setDiscountedPrice(discountedTotalAmount.toFixed(2) * 1);
      setDiscountAmount(totalDiscount.toFixed(2) * 1);
      setDeliveryCharges(deliveryCharges);
      setTotalAmount(totalAmount.toFixed(2) * 1);
    }
  }, [product]);

  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(`/api/user/getAddress`, {
            headers: {
              authorization: `${token}`,
            },
          });
          setAddresses(response.data);
          if (response.data.length > 0) {
            setSelectedAddress(response.data[0].id);
            setIsEmpty(false);
          } else {
            setIsEmpty(true);
          }
        } catch (error) {
          setIsEmpty(true);
          console.error("Failed to fetch addresses", error);
          navigate("/signin");
        } finally {
          setTimeout(() => setLoading(false), 2000);
        }
      } else {
        navigate("/signin");
      }
    };

    fetchAddress();
  }, []);

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  const proceedPayment = async (typeOfPayment) => {
    if (!product) return;

    try {
      const token = localStorage.getItem("token");
      const successPath = window.location.origin + "/orders";
      const cancelPath = window.location.origin + `/buy/${id}/${colorIndex}`;
      const response = await axios.post(
        `/api/payment/placeOrder`,
        {
          totalAmount,
          product: [
            {
              id: product.id,
              name: product.name + "(" + product.images[colorIndex].name + ")",
              price: product.price,
              image: product.images[colorIndex].images[0].url,
              colorIndex: colorIndex * 1,
              brand: product.brand,
              discount: product.discount,
              stock: product.stock,
            },
          ],
          typeOfPayment,
          address: selectedAddress,
          userId: currentUser.id,
          successURL: successPath,
          cancelURL: cancelPath,
        },
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );

      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <div className="sm:pl-20 pl-10 pr-10 pt-10 sm:pr-20 flex flex-col sm:flex-row md:flex-row w-full">
          <div className="flex-1 p-4 m-2 border rounded-lg overflow-auto">
            <h2 className="text-lg font-semibold mb-4">Your Product</h2>
            <div className="flex flex-col max-h-[580px] overflow-auto">
              <div className="flex flex-col sm:flex-row items-start mb-4 p-2 relative">
                <img
                  src={product.images[colorIndex].images[0].url}
                  alt={product.name}
                  className="w-20 h-20 mr-4 sm:w-24 sm:h-24 object-cover"
                />
                <div className="flex flex-col justify-between w-full">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {product.name} ({product.images[colorIndex].name})
                    </h2>
                    <p className="text-gray-600">by {product.brand}</p>
                    {product.stock - product.sold <= 5 && (
                      <p className="text-red-500 text-xs">
                        Only {product.stock - product.sold} left
                      </p>
                    )}
                  </div>
                  <div className="flex justify-start items-center mt-2">
                    <p className="text-xs sm:text-lg">{discountedPrice}</p>
                    {product.discount !== 0 && (
                      <p className="text-gray-500 line-through text-xs pl-3">
                        {product.price}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 m-2 border rounded-lg max-w-full">
            {/* Address Selection */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Select Delivery Address
              </h2>
              <div className="max-h-64 overflow-auto border border-gray-200 rounded-md p-2">
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <div key={address.id} className="w-full mb-3">
                      <input
                        type="radio"
                        id={address.id}
                        name="address"
                        value={address.id}
                        onChange={handleAddressChange}
                        checked={selectedAddress === address.id}
                        className="hidden"
                      />
                      <label
                        htmlFor={address.id}
                        className="w-full block cursor-pointer"
                      >
                        <div
                          className={`border p-4 rounded ${
                            selectedAddress === address.id
                              ? "border-blue-500"
                              : ""
                          } hover:border-blue-500 transition duration-200`}
                        >
                          <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded-sm mb-2">
                            {address.type}
                          </button>
                          <div className="flex justify-between items-center">
                            <h1 className="font-semibold">{address.name}</h1>
                            <p>{address.mobile}</p>
                          </div>
                          <p className="text-xs text-gray-700 mt-2">
                            {address.addressLine1}, {address.addressLine2},{" "}
                            {address.addressLine3}, {address.pincode}
                          </p>
                        </div>
                      </label>
                    </div>
                  ))
                ) : (
                  <div>No addresses found. Please add an address.</div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Billing Info</h2>
              <div className="text-sm mb-4 space-y-2">
                <div className="flex justify-between">
                  <p>Total Price:</p>
                  <p className="font-medium">{product.price}</p>
                </div>
                <div className="flex justify-between">
                  <p>Total Discount:</p>
                  <p className="text-red-500">-{discountAmount}</p>
                </div>
                <div className="flex justify-between">
                  <p>Delivery Charges:</p>
                  <p className="font-medium">{deliveryCharges}</p>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <p>Total Amount:</p>
                  <p className="text-blue-600">Rs.{totalAmount.toFixed(2)}</p>
                </div>
              </div>
              <button
                className={`mt-4 w-full py-2 px-4 font-semibold rounded border ${
                  isEmpty
                    ? "bg-gray-600 text-white border-black"
                    : "bg-white text-black border-black hover:bg-black hover:text-white hover:border-black"
                }`}
                onClick={() => proceedPayment("COD")}
                disabled={isEmpty}
              >
                Buy Cash On Delivery
              </button>
              <p className="text-center my-4">Or</p>
              <button
                className={`w-full py-2 px-4 font-semibold rounded border ${
                  isEmpty
                    ? "bg-gray-600 text-white border-black"
                    : "bg-black text-white hover:bg-white hover:text-black hover:border-black"
                }`}
                onClick={() => proceedPayment("Stripe")}
                disabled={isEmpty}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BuySingle;
