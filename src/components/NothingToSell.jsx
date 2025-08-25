import React from "react";
import nothingtosell from "../data/images/nothingtosell.png";

const NothingToSell = () => {
  return (
    <div className="sm:pl-20 pl-10 pr-10 sm:pr-20 flex flex-col sm:flex-row md:flex-row w-full justify-center mt-5">
      <div className="w-full h-fit flex justify-start items-center flex-col gap-5 border bg-gray-50 rounded-md">
        <img
          src={nothingtosell}
          alt="no_product"
          className="w-full h-full md:w-full md:h-full lg:w-1/3 lg:h-1/3 sm:w-1/3 sm:h-1/3 p-5"
        />
        <p className="text-2xl sm:text-3xl mt-10 p-4">
          Nothing to sell in this category!
        </p>
      </div>
    </div>
  );
};

export default NothingToSell;
