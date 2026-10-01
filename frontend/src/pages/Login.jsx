import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginEmployee, loginOwner } from "../services/authService";
import { useTitle } from "../hooks/useTitile";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { Toaster, toast } from "sonner";


const Login = () => {
  useTitle("Login to SmartStock");

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("employee");
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      let response;

      const authDetails = {
        email,
        password,
      };

      if (loginType === "owner") {
        response = await loginOwner(authDetails);
      } else {
        response = await loginEmployee(authDetails);
      }

      // Navigate according to account type
      if (loginType === "owner") {
        navigate("/ownerhomepage");
      } else {
        const role = response.role;

        if (role === "manager") {
          navigate("/managerhomepage");
        } else if (role === "cashier") {
          navigate("/cashierhomepage");
        }
      }
      toast.success("Logged in successfully")
    } catch (error) {
      toast.error(error.message || "Login failed");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50 px-3 py-8 sm:px-4 sm:py-10">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg sm:p-6">
        {/* HEADER */}
        <h1 className="text-center text-xl font-semibold sm:text-2xl">
          Welcome Back
        </h1>

        <p className="mt-1.5 text-center text-xs text-gray-500 sm:mt-2 sm:text-sm">
          Login to your SmartStock account
        </p>

        <form onSubmit={handleLogin} className="mt-5 sm:mt-6">
          {/* EMAIL */}
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium sm:text-sm">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium sm:text-sm">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
                placeholder="Enter your password"
                required
              />

              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-gray-700"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
              </button>
            </div>
          </div>

          {/* ACCOUNT TYPE */}
          <div className="mb-5">
            <p className="mb-2 text-xs font-medium sm:text-sm">Login as:</p>

            <div className="flex gap-4 sm:gap-6">
              <label className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
                <input
                  type="radio"
                  name="loginType"
                  value="employee"
                  checked={loginType === "employee"}
                  onChange={(e) => setLoginType(e.target.value)}
                />
                Employee
              </label>

              <label className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
                <input
                  type="radio"
                  name="loginType"
                  value="owner"
                  checked={loginType === "owner"}
                  onChange={(e) => setLoginType(e.target.value)}
                />
                Owner
              </label>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-500 py-2 text-xs text-white transition-all duration-300 hover:bg-red-600 disabled:opacity-50 sm:py-2.5 sm:text-sm"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* REGISTER */}
        <p className="mt-4 text-center text-xs sm:mt-5 sm:text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-red-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
