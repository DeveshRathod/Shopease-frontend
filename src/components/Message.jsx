import React, { useState, useEffect } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import CheckIcon from "@mui/icons-material/Check";

const Message = ({ message, setShowModal, showModel, isError }) => {
  const [progressWidth, setProgressWidth] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(false);
    }, 3000);

    const interval = setInterval(() => {
      setProgressWidth((prevWidth) => prevWidth - (100 / 3000) * 100);
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [setShowModal]);

  return (
    <>
      {showModel && (
        <div className="bg-white shadow-md fixed top-4 right-4 z-50 flex flex-col">
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center">
              {isError ? (
                <ErrorIcon sx={{ fontSize: 24, color: "#FF0000" }} />
              ) : (
                <CheckIcon sx={{ fontSize: 24, color: "#008000" }} />
              )}
              <p className="ml-2 text-sm text-gray-700">{message}</p>
            </div>
          </div>

          <div className="relative h-2 bg-gray-200  mt-auto w-full">
            <div
              className={`absolute bottom-0 left-0 h-full ${
                isError ? "bg-red-500" : "bg-green-500"
              } ${progressWidth === 0 ? "w-full" : ""}`}
              style={{
                width: `${progressWidth}%`,
                transition: "width 0.1s ease-out",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
