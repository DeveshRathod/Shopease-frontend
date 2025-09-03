import React from "react";
import { Link } from "react-router-dom";

const calculateDiscountedPrice = (price, discount) => {
  const discountedAmount = price * (1 - discount / 100);
  const amount = discountedAmount.toFixed(0);
  return Number(amount).toLocaleString("en-IN");
};

const LatestProducts = ({ latestProducts }) => {
  return (
    <section className="p-2 sm:p-0 md:p-2">
      {latestProducts.length !== 0 && (
        <div>
          <header className="p-2 sm:p-0">
            <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Latest Products In Collection
            </h2>
            <p className="mt-4 max-w-md text-gray-500">
              Explore the newest additions in each category below.
            </p>
          </header>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latestProducts.slice(0, 4).map((product) => (
              <li key={product.id} className="shadow-md rounded-lg">
                <Link
                  to={`/product/${product.id}/0`}
                  className="group block overflow-hidden w-full"
                >
                  <img
                    src={product.images[0].images[0].url}
                    alt={product.name}
                    className="h-[350px] w-full object-contain transition duration-500 group-hover:scale-105 sm:h-[270px]"
                  />
                  <div className="relative bg-white mt-3 p-6">
                    <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
                      {product.name}
                    </h3>
                    <p className="mt-2">
                      <span className="sr-only">Regular Price</span>
                      <span className="tracking-wider text-gray-900">
                        ₹
                        {calculateDiscountedPrice(
                          product.price,
                          product.discount
                        )}
                      </span>
                      {product.discount > 0 && (
                        <span className="ml-1 text-sm text-gray-500 line-through">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default LatestProducts;
