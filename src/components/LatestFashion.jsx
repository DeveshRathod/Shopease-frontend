import React from "react";
import { Link } from "react-router-dom";

const LatestFashion = ({ fashionLatest }) => {
  return (
    <div>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <header className="text-center">
            <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Latest in collection from {fashionLatest.brand}
            </h2>
          </header>

          <ul className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {fashionLatest.resultArray.map((item, index) => (
              <li
                key={index}
                className={`group relative block ${
                  index === 2
                    ? "lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 border"
                    : ""
                }`}
              >
                <Link
                  to={`/product/${item.id}/0`}
                  className="group relative block"
                >
                  <img
                    src={item.images[0].images[0].url}
                    alt={item.name}
                    className="aspect-square w-full object-cover transition duration-500 group-hover:opacity-90 border border-black rounded-md"
                  />
                  <div className="absolute inset-0 flex items-end">
                    <div className=" bg-black p-4 rounded-tr-md rounded-bl-md">
                      <h3 className="text-xl font-medium text-white mb-2">
                        {item.name}
                      </h3>
                      <span className="inline-block bg-white px-5 py-2 text-xs font-medium uppercase tracking-wide text-black rounded">
                        Shop Now
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default LatestFashion;
