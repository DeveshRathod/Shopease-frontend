import React, { useEffect } from "react";
import { HashLoader } from "react-spinners";

const Loader = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <div
      className="min-w-screen flex justify-center items-center"
      style={{ height: "calc(100vh - 28vh)" }}
    >
      <HashLoader size={100} />
    </div>
  );
};

export default Loader;
