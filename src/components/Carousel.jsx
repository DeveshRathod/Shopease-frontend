import React from "react";
import Marquee from "react-fast-marquee";

const Carousel = ({ brands }) => {
  return (
    <div className="w-full overflow-hidden">
      <Marquee direction="left" speed={20} gradient={false}>
        {brands.map((item, index) => (
          <div key={index} className="flex items-center justify-center">
            <img
              src={item}
              alt="brand"
              className="w-40 h-20 object-contain mx-6"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Carousel;
