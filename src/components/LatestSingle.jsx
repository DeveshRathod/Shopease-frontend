import React from "react";
import { Link } from "react-router-dom";

const LatestSingle = ({ latestSingleProduct }) => {
  return (
    <section>
      <div>
        <header>
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
            You might also like
          </h2>
        </header>

        {latestSingleProduct ? (
          <div className="mx-auto max-w-screen-xl mt-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
              <div className="grid place-content-center rounded bg-gray-100 p-6 sm:p-8">
                <div className="mx-auto max-w-md text-center lg:text-left">
                  <header>
                    <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                      {latestSingleProduct.category.charAt(0).toUpperCase() +
                        latestSingleProduct.category.slice(1)}
                    </h2>

                    <p className="mt-4 text-gray-500">
                      {latestSingleProduct.description}
                    </p>
                  </header>

                  <Link
                    to={`/product/${latestSingleProduct._id}/0`}
                    className="bg-black text-white w-full px-8 py-3 border border-black hover:border-black rounded-md hover:bg-white hover:text-black transition duration-300 ease-in-out mt-8 flex justify-center items-center gap-2"
                  >
                    Shop All
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-2 lg:py-8">
                <ul className="grid grid-cols-2 gap-4">
                  <li>
                    <div className="group block">
                      <img
                        src={latestSingleProduct.images[0].images[0].url}
                        alt="Image"
                        className="aspect-square w-full rounded object-cover"
                      />
                    </div>
                  </li>

                  <li>
                    <div className="group block">
                      <img
                        src={latestSingleProduct.images[0].images[1].url}
                        alt=""
                        className="aspect-square w-full rounded object-cover"
                      />
                    </div>
                  </li>
                  <div className="mt-3">
                    <h3 className="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4">
                      {latestSingleProduct.name} By {latestSingleProduct.brand}
                    </h3>

                    <p className="mt-1 text-sm text-gray-700">
                      ₹
                      {(
                        latestSingleProduct.price *
                        (1 - latestSingleProduct.discount / 100)
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </section>
  );
};

export default LatestSingle;
