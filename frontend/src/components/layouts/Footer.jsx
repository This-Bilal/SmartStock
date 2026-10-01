import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-7 sm:py-9 lg:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link to="/" className="mx-auto flex w-fit items-center justify-center">
          <span className="text-lg font-semibold text-red-700 sm:text-xl lg:text-2xl">S</span>
          <img src="/UntitledDesign.png" alt="SmartStock logo" className="h-7 -ml-1 sm:h-8 lg:h-10" />
          <span className="text-lg font-semibold text-red-700 sm:text-xl lg:text-2xl">artStock</span>
        </Link>

        {/* DESCRIPTION */}
        <p className="mx-auto mt-2 max-w-md px-3 text-center text-[11px] text-gray-400 sm:mt-3 sm:text-xs lg:text-sm">
          Manage your inventory. Track your sales. Grow your business.
        </p>

        {/* LINKS */}
        <div className="mx-auto mt-8 grid w-full max-w-4xl grid-cols-2 gap-x-5 gap-y-8 sm:mt-10 sm:grid-cols-4 sm:gap-6 lg:mt-12 lg:gap-12">

          {/* COMPANY */}
          <div className="flex flex-col items-center gap-1.5 text-center text-xs text-gray-400 sm:items-start sm:text-left sm:text-sm">
            <span className="mb-1 text-xs font-semibold text-white sm:text-sm">COMPANY</span>
            <Link to="#" className="transition-colors duration-200 hover:text-white">About</Link>
            <Link to="#" className="transition-colors duration-200 hover:text-white">Contact</Link>
          </div>

          {/* SUPPORT */}
          <div className="flex flex-col items-center gap-1.5 text-center text-xs text-gray-400 sm:items-start sm:text-left sm:text-sm">
            <span className="mb-1 text-xs font-semibold text-white sm:text-sm">SUPPORT</span>
            <Link to="#" className="transition-colors duration-200 hover:text-white">Help Center</Link>
            <Link to="#" className="transition-colors duration-200 hover:text-white">Contact Support</Link>
            <Link to="#" className="transition-colors duration-200 hover:text-white">FAQ</Link>
          </div>

          {/* LEGAL */}
          <div className="flex flex-col items-center gap-1.5 text-center text-xs text-gray-400 sm:items-start sm:text-left sm:text-sm">
            <span className="mb-1 text-xs font-semibold text-white sm:text-sm">LEGAL</span>
            <Link to="#" className="transition-colors duration-200 hover:text-white">Privacy Policy</Link>
            <Link to="#" className="transition-colors duration-200 hover:text-white">Terms of Service</Link>
          </div>

          {/* SOCIALS */}
          <div className="flex flex-col items-center gap-1.5 text-center text-xs text-gray-400 sm:items-start sm:text-left sm:text-sm">
            <span className="mb-1 text-xs font-semibold text-white sm:text-sm">SOCIALS</span>
            <Link to="#" className="transition-colors duration-200 hover:text-white">Facebook</Link>
            <Link to="#" className="transition-colors duration-200 hover:text-white">Instagram</Link>
            <Link to="#" className="transition-colors duration-200 hover:text-white">Twitter</Link>
            <Link to="#" className="transition-colors duration-200 hover:text-white">Threads</Link>
            <Link to="#" className="transition-colors duration-200 hover:text-white">LinkedIn</Link>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="mt-8 border-t border-gray-700 px-3 pt-5 text-center text-[10px] text-gray-400 sm:mt-10 sm:pt-6 sm:text-xs lg:text-sm">
          &copy; {new Date().getFullYear()} SmartStock Technologies. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;