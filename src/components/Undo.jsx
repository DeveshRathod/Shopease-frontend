import React, { useState, useEffect } from "react";

const Undo = ({ setShowModal, func, data, showModel }) => {
  const [progressWidth, setProgressWidth] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(false);
    }, 5000);

    const interval = setInterval(() => {
      setProgressWidth((prevWidth) => prevWidth - (100 / 5000) * 100);
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [setShowModal]);

  return (
    <>
      {showModel && (
        <div className="bg-white shadow-2xl fixed top-4 right-4 z-50 flex flex-col">
          <div className="p-4 flex flex-col justify-between items-center">
            <p>Are you sure you want to delete?</p>

            <div
              className=" flex justify-end w-full mt-5"
              onClick={() => {
                setShowModal(false);
                func(data);
              }}
            >
              <button className=" py-1 px-5 rounded-sm bg-blue-500  text-white">
                Undo
              </button>
            </div>
          </div>

          <div className="relative h-2 bg-gray-200 rounded mt-auto w-full">
            <div
              className="absolute bottom-0 left-0 h-full bg-blue-500"
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

export default Undo;
