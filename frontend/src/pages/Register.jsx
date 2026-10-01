import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerOwner } from "../services/authService";
import { useTitle } from "../hooks/useTitile";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { Toaster, toast } from "sonner";

const Register = () => {
  useTitle("Rigister for SmartStock");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerOwner({
        name: formData.name,
        email: formData.email,
        businessName: formData.businessName,
        phone: formData.phone,
        password: formData.password,
      });

      toast.success("Registration successful");

      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-3 sm:px-4 py-8 sm:py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-5 sm:p-6 md:p-8">
        {/* HEADING */}
        <h1 className="text-xl sm:text-2xl font-semibold text-center text-gray-900 mt-3 sm:mt-5">
          Create Your Account
        </h1>

        <p className="text-xs sm:text-sm text-gray-500 text-center mt-2">
          Start managing your business with SmartStock.
        </p>

        {/* FORM */}
        <form onSubmit={handleRegister} className="mt-5 sm:mt-6">
          {/* NAME */}
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
            />
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
            />
          </div>

          {/* BUSINESS NAME */}
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Business Name
            </label>

            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Enter your business name"
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
            />
          </div>

          {/* PHONE */}
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              />

              <button
                className="absolute right-2 sm:right-3 top-2.5 sm:top-4 text-sm sm:text-base text-gray-700 cursor-pointer"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-5">
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showPasswords ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              />

              <button
                className="absolute right-2 sm:right-3 top-2.5 sm:top-4 text-sm sm:text-base text-gray-700 cursor-pointer"
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? <IoMdEyeOff /> : <IoMdEye />}
              </button>
            </div>
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm rounded-lg hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-xs sm:text-sm text-center mt-5 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
