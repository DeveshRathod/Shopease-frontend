import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleImageChange = (index, e) => {
    setSelectedImageIndex(index);
    e.stopPropagation();
  };

  const discountedPrice = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(2);
  };

  return (
    <div key={product.id} className="relative">
      <Link
        to={`/product/${product.id}/${selectedImageIndex}`}
        className="block"
      >
        <div
          className="w-42 h-80 overflow-hidden rounded-md"
          onMouseEnter={() =>
            setHoverTimeout(setTimeout(() => setIsHovered(true), 500))
          }
          onMouseLeave={() => {
            clearTimeout(hoverTimeout);
            setIsHovered(false);
          }}
        >
          <img
            id={`product_${product.id}`}
            src={
              isHovered && product.images[selectedImageIndex].images[1]
                ? product.images[selectedImageIndex].images[1].url
                : product.images[selectedImageIndex].images[0].url
            }
            loading="lazy"
            alt={product.name}
            className="w-full h-full object-contain transition duration-1000 transform hover:scale-105"
          />
        </div>
        <div className="bg-white p-4 w-42">
          <h2 className="text-base mb-2">
            {product.name} ({product.images[selectedImageIndex].name})
          </h2>
          {product.discount !== 0 ? (
            <div className="flex items-center">
              <p className="text-base text-black mr-2">
                ₹
                {discountedPrice(
                  product.price,
                  product.discount
                ).toLocaleString("en-IN")}
              </p>
              <p className="text-sm text-gray-500 line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
              <p className="text-sm text-green-500 ml-2">
                -{product.discount}% off
              </p>
            </div>
          ) : (
            <p className="text-gray-700 text-base">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          )}
        </div>
      </Link>
      <div className="flex">
        <div className="flex justify-start pl-4 gap-2 w-full">
          {product.images.map((image, index) => (
            <button
              key={index}
              className={`rounded-full w-6 h-6 border-2 ${
                index === selectedImageIndex ? "border-gray-500 p-2" : ""
              }`}
              style={{ backgroundColor: image.color }}
              onClick={(e) => handleImageChange(index, e)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
