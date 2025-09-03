import React, { useState, useEffect } from "react";

const Dialog = ({ setShowModal, dialogFun, headline, showModel }) => {
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
        <div className="bg-white shadow-2xl fixed top-4 right-4 z-50 flex flex-col">
          <div className="p-4 flex flex-col justify-between items-center">
            <p>{headline}</p>

            <div className=" flex justify-between w-full mt-5">
              <button
                className=" py-1 px-3 rounded-sm"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className=" py-1 px-5 rounded-sm bg-red-500  text-white"
                onClick={dialogFun}
              >
                Yes
              </button>
            </div>
          </div>

          <div className="relative h-2 bg-gray-200 rounded mt-auto w-full">
            <div
              className="absolute bottom-0 left-0 h-full bg-red-500"
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

export default Dialog;
