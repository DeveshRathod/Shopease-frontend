import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const Footer = () => {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="min-w-screen min-h-fit mt-16 bg-white">
      <div className="relative mx-auto max-w-screen-xl lg:pt-24 px-12 md:px-12 sm:px-0 py-4">
        <div className="absolute end-4 top-4 sm:end-6 sm:top-6 lg:end-8 lg:top-8">
          <button
            className="inline-block rounded-full bg-black p-2 text-white shadow transition sm:p-3 lg:p-4 focus:outline-none"
            onClick={handleScrollToTop}
          >
            <span className="sr-only">Back to top</span>
            <ExpandLessIcon />
          </button>
        </div>

        <div className="lg:flex lg:items-end lg:justify-between">
          <div>
            <div className="flex justify-center text-gray-600 lg:justify-start">
              <h1 className="text-3xl">ShopEase</h1>
            </div>

            <p className="mx-auto mt-6 leading-relaxed text-gray-500 text-left text-base">
              ShopEase is your one-stop destination for all your shopping needs.
              From the latest fashion trends to cutting-edge gadgets, we've got
              you covered. Our mission is to provide an unparalleled shopping
              experience, offering high-quality products and exceptional
              customer service. Join our community today and discover the ease
              of shopping with ShopEase!
            </p>
          </div>
        </div>

        <div className=" w-fit mt-6">
          <div className=" flex gap-8 justify-start">
            <a
              href="https://www.facebook.com/devesh.naik.92/"
              className="mx-auto max-w-md text-center leading-relaxed text-gray-500 lg:text-left"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://www.instagram.com/devesh.naik.92/"
              className="mx-auto max-w-md text-center leading-relaxed text-gray-500 lg:text-left"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://x.com/devnaik9302"
              className="mx-auto max-w-md text-center leading-relaxed text-gray-500 lg:text-left"
            >
              <TwitterIcon />
            </a>
            <a
              href="https://github.com/DeveshRathod/"
              className="mx-auto max-w-md text-center leading-relaxed text-gray-500 lg:text-left"
            >
              <GitHubIcon />
            </a>
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-gray-500 lg:text-right">
          Copyright &copy; 2024. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
