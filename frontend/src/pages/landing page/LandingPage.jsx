import React from "react";
import { Link } from "react-router-dom";
import { useTitle } from "../../hooks/useTitile";

const LandingPage = () => {
  useTitle("SmartStock: Inventory made easy");

  return (
    <main className="w-full bg-red-50">
      {/* ================================================= */}
      {/*                    HERO SECTION                   */}
      {/* ================================================= */}

      <section className="w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
          {/* Main Heading */}
          <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-black mb-5">
            Manage Your Stock
          </div>

          <div className="text-3xl sm:text-4xl lg:text-5xl mb-5 font-semibold text-red-700">
            Grow Your Business
          </div>

          {/* Description */}
          <div className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto">
            Inventory, sales, and employees management made simple in a single
            platform.
          </div>

          <div className="text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto">
            Take control of your stock with our powerful, intuitive platform.
            Track inventory and optimize your operations with real-time
            insights.
          </div>

          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center text-sm my-7">
            <Link
              to="/register"
              className="rounded-lg bg-red-500 px-2.5 py-1.5 text-xs text-white transition-all duration-300 hover:bg-red-600 sm:px-3 sm:py-2 sm:text-sm md:px-4"
            >
              Get started
            </Link>

            <Link
              to="/login"
              className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs transition-all duration-300 hover:bg-red-200 sm:px-3 sm:py-2 sm:text-sm md:px-4"
            >
              Sign in
            </Link>
          </div>

          {/* ================= WHY SMARTSTOCK ================= */}

          <div className="mt-12 sm:mt-16 text-red-700 text-xl sm:text-2xl font-semibold">
            Why SmartStock?
            <div
              id="how"
              className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto rounded-lg shadow-md p-4 sm:p-6"
            >
              {/* Inventory */}
              <div className="rounded-lg bg-white text-gray-600 p-5 min-h-24 flex flex-col justify-center shadow-md">
                <div className="text-sm sm:text-base">📦 Inventory</div>
                <div className="text-xs sm:text-sm mt-1">Manage stock</div>
              </div>

              {/* Sales */}
              <div className="rounded-lg bg-white text-gray-600 p-5 min-h-24 flex flex-col justify-center shadow-md">
                <div className="text-sm sm:text-base">💰 Sales</div>
                <div className="text-xs sm:text-sm mt-1">Track sales</div>
              </div>

              {/* Employees */}
              <div className="rounded-lg bg-white text-gray-600 p-5 min-h-24 flex flex-col justify-center shadow-md">
                <div className="text-sm sm:text-base">👥 Employees</div>
                <div className="text-xs sm:text-sm mt-1">Manage employees</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/*              CTA / FEATURE SECTION                */}
      {/* ================================================= */}

      <section className="relative">
        {/* ================= RED CTA ================= */}

        <div className="bg-red-500">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 pb-48 sm:pb-56 lg:pb-64">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
              {/* CTA TEXT */}

              <div className="text-center lg:text-left">
                <span className="font-semibold text-white text-sm sm:text-base">
                  A STEP AWAY
                </span>

                <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-semibold mt-2">
                  Smart inventory and
                  <br className="hidden sm:block" />
                  better business
                </h2>
              </div>

              {/* CTA BUTTON */}

              <Link
                to="/register"
                className="rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs text-white transition-all duration-300 hover:bg-gray-800 sm:px-3 sm:py-2 sm:text-sm md:px-4"
              >
                Sign up for free
              </Link>
            </div>
          </div>
        </div>

        {/* ================= FEATURE CARD ================= */}

        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[45%] sm:translate-y-[50%] md:translate-y-[75%] lg:translate-y-[65%] w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] md:w-[calc(100%-3rem)] lg:w-[calc(100%-3rem)] max-w-250 flex flex-row rounded-lg sm:rounded-xl overflow-hidden shadow-xl z-10">
          {/* IMAGE */}

          <div className="w-[40%] flex items-center justify-center overflow-hidden">
            <img
              src="/download.jpg"
              alt="SmartStock dashboard"
              className="w-full h-full object-contain block"
            />
          </div>

          {/* FEATURES */}

          <div className="flex min-h-45 w-[60%] flex-col items-center justify-center bg-red-50 px-3 py-4 sm:min-h-52.5 sm:px-4 sm:py-5 md:min-h-62.5 md:px-6 md:py-7 lg:min-h-105 lg:p-10">
            <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3.5 lg:gap-5">
              <div className="flex items-center gap-1.5 font-semibold text-[9px] text-gray-700 sm:gap-2 sm:text-[10px] md:text-xs lg:text-lg">
                <span>✅</span>
                <span>Accurate stock tracking</span>
              </div>

              <div className="flex items-center gap-1.5 font-semibold text-[9px] text-gray-700 sm:gap-2 sm:text-[10px] md:text-xs lg:text-lg">
                <span>✅</span>
                <span>Sales accountability</span>
              </div>

              <div className="flex items-center gap-1.5 font-semibold text-[9px] text-gray-700 sm:gap-2 sm:text-[10px] md:text-xs lg:text-lg">
                <span>✅</span>
                <span>Accurate sales tracking</span>
              </div>

              <div className="flex items-center gap-1.5 font-semibold text-[9px] text-gray-700 sm:gap-2 sm:text-[10px] md:text-xs lg:text-lg">
                <span>✅</span>
                <span>Adjust inventory</span>
              </div>

              <div className="flex items-center gap-1.5 font-semibold text-[9px] text-gray-700 sm:gap-2 sm:text-[10px] md:text-xs lg:text-lg">
                <span>✅</span>
                <span>Get reports</span>
              </div>

              <p className="mt-1 text-center text-[9px] font-medium italic text-gray-500 sm:text-[10px] md:text-xs lg:mt-2 lg:text-base">
                And many more...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SPACE AFTER FEATURE SECTION */}

      <div className="h-30 sm:h-60 md:h-100 lg:h-87.5 bg-red-50" />

      {/* ================================================= */}
      {/*                  FINAL CTA SECTION                 */}
      {/* ================================================= */}

      <section className="w-full bg-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-30 lg:py-35 text-center">
          {/* Small Heading */}

          <div className="font-semibold text-red-700 text-base sm:text-lg mb-4 sm:mt-0 md:mt-0">
            Try SmartStock today
          </div>

          {/* Main Heading */}

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
            Ready to take control of your inventory?
          </h2>

          {/* Description */}

          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Start managing your inventory, sales, and business operations
            smarter with SmartStock.
          </p>

          {/* Button */}

          <div className="flex justify-center mt-8">
            <Link
              to="/register"
              className="rounded-lg bg-red-500 px-2.5 py-1.5 text-xs text-white transition-all duration-300 hover:bg-red-600 sm:px-3 sm:py-2 sm:text-sm md:px-4"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
