import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createEmployee } from "../../services/employeeService";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import BackButton from "../../components/other/BackButton";
import { useTitle } from "../../hooks/useTitile";
import { toast, Toaster } from "sonner";

const CreateEmployee = () => {
  useTitle("SmartStock: add employee");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await createEmployee(formData);

      toast.success("Employee created successfully.")

      setTimeout(() => {
        navigate("/employeeList");
      }, 1000);
    } catch (error) {
      toast.error(error?.message || "Failed to create employee.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-red-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* BACK BUTTON */}
        <div className="mb-5 sm:mb-6">
          <BackButton />
        </div>

        {/* PAGE CONTENT */}
        <div className="mx-auto w-full max-w-2xl">

          {/* HEADER */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl md:text-3xl">
              Add Employee
            </h1>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm md:text-base">
              Create an employee account for your business.
            </p>
          </div>

          {/* FORM CARD */}
          <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6 md:p-8">
            <form onSubmit={handleSubmit}>

              {/* NAME */}
              <div className="mb-4 sm:mb-5">
                <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter employee name"
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
                />
              </div>

              {/* EMAIL */}
              <div className="mb-4 sm:mb-5">
                <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter employee email"
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-4 sm:mb-5">
                <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create employee password"
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 transition hover:text-gray-800"
                  >
                    {showPassword ? (
                      <IoMdEyeOff className="text-base sm:text-lg" />
                    ) : (
                      <IoMdEye className="text-base sm:text-lg" />
                    )}
                  </button>
                </div>

                <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
                  This password will be used by the employee to log in.
                </p>
              </div>

              {/* ROLE */}
              <div className="mb-4 sm:mb-5">
                <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
                  Employee Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 capitalize outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5 text-sm"
                >
                  <option value="cashier">Cashier</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-2 border-t border-gray-100 pt-4 sm:gap-3 sm:pt-5">

                {/* CANCEL */}
                <Link
                  to="/employeeList"
                  className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-center text-xs font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 sm:px-4 sm:py-2.5 sm:text-sm md:text-base"
                >
                  Cancel
                </Link>

                {/* CREATE */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-red-600 sm:px-4 sm:py-2.5 sm:text-sm md:text-base ${
                    loading ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  {loading ? "Creating..." : "Create Employee"}
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateEmployee;