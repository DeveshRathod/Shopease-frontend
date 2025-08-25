import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";

const Address = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [showForm, setShowForm] = useState(false);

  const [addressData, setAddressData] = useState({
    type: "",
    name: "",
    mobile: currentUser ? currentUser.mobile : "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    pincode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData({ ...addressData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.post(`/api/user/addAddress`, addressData, {
          headers: {
            authorization: `${token}`,
          },
        });
        setAddresses([...addresses, response.data.address]);
        setShowForm(false);
        setAddressData({
          type: "",
          name: "",
          mobile: currentUser ? currentUser.mobile : "",
          addressLine1: "",
          addressLine2: "",
          addressLine3: "",
          pincode: "",
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/signin");
    }
  };

  const handleRemoveAddress = async (addressId) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.delete(`/api/user/deleteAddress`, {
          headers: {
            authorization: `${token}`,
          },
          data: {
            addressId: addressId,
          },
        });

        setAddresses((prev) =>
          prev.filter((address) => address.id !== addressId)
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/signin");
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(`/api/user/getAddress`, {
            headers: {
              authorization: `${token}`,
            },
          });
          setAddresses(response.data);
        } catch (error) {
          console.log(error);
        }
      } else {
        navigate("/signin");
      }
    };

    fetchAddresses();
  }, [navigate]);

  const handleToggleForm = () => setShowForm(!showForm);

  return (
    <div className="">
      {!currentUser.isAdmin && (
        <div className="min-w-screen min-h-fit mt-10 bg-white">
          <div className="relative mx-auto max-w-screen-lg pl-8 pr-8 sm:pl-0 sm:pr-0 md:pl-8 lg:pl-0 lg:pr-0 md:pr-8">
            <div className="p-6 bg-white shadow border rounded-lg">
              <h1 className="text-xl sm:text-3xl font-bold mb-4">Addresses</h1>
              {!showForm ? (
                <button
                  onClick={handleToggleForm}
                  className="flex p-2 gap-2 border w-full rounded-md"
                >
                  <AddIcon />
                  <p className="uppercase">New Adress</p>
                </button>
              ) : (
                <button
                  onClick={handleToggleForm}
                  className="flex p-2 gap-2 border w-full rounded-md"
                >
                  <CancelIcon />
                  <p className="uppercase">Close</p>
                </button>
              )}
              {showForm && (
                <div className="min-w-screen min-h-fit mt-4 bg-white">
                  <div className="relative mx-auto max-w-screen-lg">
                    <div className="p-4 bg-white shadow border rounded-lg">
                      <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-4 md:gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3"
                      >
                        <div>
                          <label
                            htmlFor="type"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Address Type
                          </label>
                          <select
                            id="type"
                            name="type"
                            value={addressData.type}
                            onChange={handleInputChange}
                            className="w-full p-2 outline-none rounded-md shadow-sm"
                            required
                          >
                            <option value="" disabled>
                              Select Type
                            </option>
                            <option value="home">Home</option>
                            <option value="office">Office</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={addressData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 outline-none rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="mobile"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Mobile
                          </label>
                          <input
                            type="text"
                            id="mobile"
                            name="mobile"
                            value={addressData.mobile}
                            onChange={handleInputChange}
                            className="w-full p-2 outline-none rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="addressLine1"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Address Line 1
                          </label>
                          <input
                            type="text"
                            id="addressLine1"
                            name="addressLine1"
                            value={addressData.addressLine1}
                            onChange={handleInputChange}
                            className="w-full p-2 outline-none rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="addressLine2"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            id="addressLine2"
                            name="addressLine2"
                            value={addressData.addressLine2}
                            onChange={handleInputChange}
                            className="w-full p-2 outline-none rounded-md shadow-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="addressLine3"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Address Line 3
                          </label>
                          <input
                            type="text"
                            id="addressLine3"
                            name="addressLine3"
                            value={addressData.addressLine3}
                            onChange={handleInputChange}
                            className="w-full p-2 outline-none rounded-md shadow-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="pincode"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Pincode
                          </label>
                          <input
                            type="text"
                            id="pincode"
                            name="pincode"
                            value={addressData.pincode}
                            onChange={handleInputChange}
                            className="w-full p-2 outline-none rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div className="col-span-full md:col-span-2 lg:col-span-3">
                          <button
                            type="submit"
                            className=" p-3 rounded-md bg-green-500 text-white"
                          >
                            Add address
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap mt-4 gap-4">
                {addresses.length > 0 ? (
                  addresses.map((address, index) => (
                    <div key={index} className="w-full">
                      <div className="border p-4 rounded-md flex flex-row justify-between items-center">
                        <div>
                          <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded-sm mb-2">
                            {address.type}
                          </button>
                          <div className="flex justify-start">
                            <div className="flex justify-center items-center gap-5">
                              <h1 className="text-lg font-semibold">
                                {address.name}
                              </h1>
                              <p>{address.mobile}</p>
                            </div>
                          </div>
                          <div className="pb-2">
                            <p>
                              {address.addressLine1}, {address.addressLine2},{" "}
                              {address.addressLine3} - {address.pincode}
                            </p>
                          </div>
                        </div>
                        <div
                          className=" cursor-pointer"
                          onClick={() => handleRemoveAddress(address.id)}
                        >
                          <DeleteIcon />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center">No addresses found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;
