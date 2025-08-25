import React from "react";
import productnotfound from "../data/images/productnotfound.png";
import { Link } from "react-router-dom";

const ProductNotFound = () => {
  return (
    <div className="sm:pl-20 pl-10 pr-10 pt-10 sm:pr-20 flex flex-col sm:flex-row md:flex-row w-full justify-center">
      <div className="w-full h-fit flex justify-center items-center flex-col gap-5 border bg-gray-50 pt-6 pb-10 rounded-md">
        <img
          src={productnotfound}
          alt="no_product"
          className="w-full h-full md:w-full md:h-full lg:w-1/3 lg:h-1/3 sm:w-1/3 sm:h-1/3 p-5"
        />
        <p className="text-2xl sm:text-3xl mt-10">
          Product no longer available!
        </p>
        <Link
          to="/explore/all"
          className="px-6 py-2 bg-black text-white rounded-md"
        >
          Explore
        </Link>
      </div>
    </div>
  );
};

export default ProductNotFound;
