import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const SettingsWrapper = ({ children }) => {
  return (
    <div className=" min-h-fit">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default SettingsWrapper;
