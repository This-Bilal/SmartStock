import React from "react";
import { useTitle } from "../../hooks/useTitile";
import CategoryList from "./components/CategoryList";
import BackButton from "../../components/other/BackButton";

const Category = () => {
  useTitle("SmartStock: categories");

  return (
    <main className="w-full bg-red-50">
      <div className="mx-auto w-full max-w-7xl">
        
        {/* PAGE HEADER */}
        <section className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <BackButton/>
          <div>
            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
              Categories
            </h1>

            <p className="mt-1.5 text-xs text-gray-500 sm:mt-2 sm:text-sm lg:text-base">
              Manage and view your product categories.
            </p>
          </div>
        </section>

        {/* CATEGORY LIST */}
        <CategoryList />
      </div>
    </main>
  );
};

export default Category;
