import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../store/reducers/cart.slice";
import CheckIcon from "@mui/icons-material/Check";
import refund from "../data/images/refund.png";
import returnable from "../data/images/returnable.png";
import openbox from "../data/images/openbox.png";
import warranty from "../data/images/warranty.png";
import ProductNotFound from "../components/ProductNotFound";
import Loader from "../components/Loader";

const Product = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const { id, colorIndex } = useParams();
  const [color, setColor] = useState(colorIndex);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const cart = useSelector((state) => state.current.cart);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    if (Array.isArray(cart)) {
      const quantity = cart.filter((item) => item.id === id).length;
      setQuantity(quantity);
    }
  }, [cart, id]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/products/getProduct", {
          productId: id,
        });
        setProduct(response.data);
        if (response.data) {
          setIsEmpty(false);
        } else {
          setIsEmpty(true);
        }
      } catch (error) {
        setIsEmpty(true);
      } finally {
        setTimeout(() => {
          setLoading(false);
          window.scrollTo(0, 0);
        }, 2000);
      }
    };

    fetchProduct();
  }, [id]);

  const handleColorChange = (color) => {
    setColor(color);
    setSelectedImageIndex(0);
  };

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to add the product to cart.");
        return;
      }

      const response = await axios.post(
        `/api/products/addToCart`,
        { id, colorIndex: color * 1 },
        { headers: { authorization: token } }
      );

      console.log(response.data);

      dispatch(setCart(response.data));
      setQuantity(quantity + 1);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart");
    }
  };

  const removeCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `/api/products/deleteCart`,
        { colorIndex: color * 1, id },
        { headers: { authorization: token } }
      );

      dispatch(setCart(response.data));
      setQuantity(quantity - 1);
    } catch (error) {
      console.error("Error removing product to cart:", error);
    }
  };

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <div>
          {!isEmpty ? (
            product &&
            product.images && (
              <div className="sm:pl-20 pl-10 pr-10 pt-10 sm:pr-20 flex flex-col sm:flex-row md:flex-row w-full">
                <div className="flex-1 w-full flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-row justify-start items-start sm:flex-col w-fit p-1 sm:p-2 gap-2 overflow-x-scroll">
                    {product.images[color].images.map((image, index) => (
                      <img
                        key={image.id}
                        src={image.url}
                        alt={image.name}
                        loading="lazy"
                        className={`w-28 h-20 object-contain cursor-pointer ${
                          index === selectedImageIndex
                            ? "border-2 border-gray-500"
                            : ""
                        }`}
                        onClick={() => handleImageSelect(index)}
                      />
                    ))}
                  </div>
                  <div className="flex-3 p-1 sm:p-2 flex items-center justify-start flex-col">
                    <div className="min-w-[300px] min-h-[300px] md:min-h-[150px] md:min-w-[150px] sm:min-w-[400px] sm:min-h-[400px]">
                      <img
                        src={
                          product.images[color].images[selectedImageIndex].url
                        }
                        alt={product.images[color].name}
                        className="object-contain w-full h-full"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-1 w-full p-2">
                  {/* Product Title and Description */}
                  <h1 className="text-3xl font-semibold mb-2">
                    {product.name} ({product.images[color].name})
                  </h1>
                  <h2 className="text-lg text-gray-600 mb-4">
                    {product.description}
                  </h2>

                  {/* Pricing and Discounts */}
                  <div className="flex items-center">
                    <h2 className="text-2xl font-semibold mr-2">
                      {product.discount !== 0
                        ? `Rs. ${(
                            product.price -
                            (product.price * product.discount) / 100
                          ).toFixed(2)}`
                        : `Rs. ${product.price}`}
                    </h2>
                    {product.discount !== 0 && (
                      <div className="flex items-center">
                        <h2 className="text-sm text-gray-500 line-through mr-2">
                          Rs. {product.price}
                        </h2>
                        <h2 className="text-sm text-green-500">
                          -{product.discount}% off
                        </h2>
                      </div>
                    )}
                  </div>

                  {/* Color Selection */}
                  <div className="flex justify-start mt-4">
                    {product.images.map((colorData, index) => (
                      <div
                        key={index}
                        className={`relative w-8 h-8 rounded-full mx-1 cursor-pointer ${
                          color === index ? "border-2 border-gray-500" : ""
                        }`}
                        style={{
                          backgroundColor: colorData.color,
                          border: "1px solid #6b7280",
                        }}
                        onClick={() => handleColorChange(index)}
                      >
                        {color === index && (
                          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-transparent rounded-full">
                            <CheckIcon
                              style={{ color: "white", fontSize: "16px" }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add to Cart and Buy Now */}
                  {currentUser && !currentUser.isAdmin && product.stock > 0 ? (
                    <div className="flex pr-2 pb-2 gap-2 mt-4 pt-2">
                      {quantity >= 1 ? (
                        <>
                          <div>
                            <label htmlFor="Quantity" className="sr-only">
                              Quantity
                            </label>
                            <div className="flex items-center rounded border border-black">
                              <button
                                type="button"
                                className="size-10 leading-10 text-black transition hover:opacity-75"
                                onClick={removeCart}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                id="Quantity"
                                value={quantity}
                                className="h-10 w-6 border-transparent text-center sm:text-sm outline-none"
                                readOnly
                              />
                              <button
                                type="button"
                                className="size-10 leading-10 text-black transition hover:opacity-75"
                                onClick={addToCart}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <button
                            className="px-3 py-2 rounded-md bg-black text-white border border-black hover:text-black hover:border hover:border-black hover:bg-white transition-all ease-in-out delay-75"
                            onClick={addToCart}
                          >
                            Add to Cart
                          </button>
                        </>
                      )}
                      <Link
                        to={`/buy/${product.id}/${color}`}
                        className="px-3 py-2 rounded-md text-black border border-black hover:text-white hover:bg-black transition-all ease-in-out delay-75"
                      >
                        Buy Now
                      </Link>
                    </div>
                  ) : (
                    <p className="flex pr-2 pb-2 gap-2 mt-4 pt-2 text-red-600">
                      Product not available for purchase.
                    </p>
                  )}

                  {/* Specifications */}
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">
                      Specifications:
                    </h2>
                    <ul className="list-disc pl-5">
                      {product.specifications.split(",").map((spec, index) => (
                        <li key={index} className="text-gray-600">
                          {spec.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Additional Features */}
                  <div className="mt-4 flex flex-wrap overflow-x-auto justify-start items-center">
                    {product.openbox && (
                      <div
                        className="flex flex-col items-center mb-4 mr-4 p-4"
                        style={{ minWidth: "100px" }}
                      >
                        <img
                          src={openbox}
                          alt="Open Box"
                          className="w-16 h-16"
                          style={{ width: "64px", height: "64px" }}
                        />
                        <span className="text-gray-600 mt-2">Open Box</span>
                      </div>
                    )}
                    {product.warranty > 0 && (
                      <div
                        className="flex flex-col items-center mb-4 mr-4 p-4"
                        style={{ minWidth: "100px" }}
                      >
                        <img
                          src={warranty}
                          alt="Warranty"
                          className="w-16 h-16"
                          style={{ width: "64px", height: "64px" }}
                        />
                        <span className="text-gray-600 mt-2">
                          {(product.warranty / 12).toFixed(0)} Year Warranty
                        </span>
                      </div>
                    )}
                    {product.returnable && (
                      <div
                        className="flex flex-col items-center mb-4 mr-4 p-4"
                        style={{ minWidth: "100px" }}
                      >
                        <img
                          src={returnable}
                          alt="Returnable"
                          className="w-16 h-16"
                          style={{ width: "64px", height: "64px" }}
                        />
                        <span className="text-gray-600 mt-2">Returnable</span>
                      </div>
                    )}
                    {product.refundable && (
                      <div
                        className="flex flex-col items-center mb-4 mr-4 p-4"
                        style={{ minWidth: "100px" }}
                      >
                        <img
                          src={refund}
                          alt="Refundable"
                          className="w-16 h-16"
                          style={{ width: "64px", height: "64px" }}
                        />
                        <span className="text-gray-600 mt-2">Refundable</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          ) : (
            <ProductNotFound />
          )}
        </div>
      )}
    </Layout>
  );
};

export default Product;
