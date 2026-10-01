import React, { useState } from "react";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { changeEmail } from "../../../services/ownerService";
import { useTitle } from "../../../hooks/useTitile";
import BackButton from "../../../components/other/BackButton";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const ChangeEmail = () => {
  useTitle("SmartStock: change email");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({ password: "", newEmail: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await changeEmail(formData);

      navigate("/ownerprofile")
      toast.success(`Email successfully changed to ${data.email}.`)
      setFormData({ password: "", newEmail: "" });
    } catch (error) {
      toast.error(error?.message || "Unable to change email.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-red-50">
      <div className="mx-auto w-full max-w-3xl px-3 py-5 xs:px-4 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-5 sm:mb-6">
          <BackButton />
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="wrap-break-words text-lg font-bold text-gray-800 xs:text-xl sm:text-2xl">
            Change Email
          </h1>

          <p className="mt-1.5 wrap-break-words text-[11px] text-gray-500 xs:text-xs sm:text-sm">
            Update the email address associated with your owner account.
          </p>
        </div>

        <div className="w-full min-w-0 rounded-xl border border-gray-100 bg-white p-3 shadow-sm xs:p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Current Password */}
            <div className="min-w-0">
              <label
                htmlFor="password"
                className="mb-1.5 block wrap-break-words text-[11px] font-medium text-gray-700 xs:text-xs sm:text-sm"
              >
                Current Password
              </label>

              <div className="relative min-w-0">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  required
                  className="w-full min-w-0 rounded-lg border border-gray-200 px-2.5 py-2 pr-10 text-xs outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 xs:px-3 xs:text-sm sm:px-4 sm:py-2.5 sm:text-base"
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

            {/* New Email */}
            <div className="min-w-0">
              <label
                htmlFor="newEmail"
                className="mb-1.5 block wrap-break-words text-[11px] font-medium text-gray-700 xs:text-xs sm:text-sm"
              >
                New Email Address
              </label>

              <input
                id="newEmail"
                name="newEmail"
                type="email"
                value={formData.newEmail}
                onChange={handleChange}
                placeholder="Enter your new email address"
                required
                className="w-full min-w-0 rounded-lg border border-gray-200 px-2.5 py-2 text-xs outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 xs:px-3 xs:text-sm sm:px-4 sm:py-2.5 sm:text-base"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-xs font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60 xs:text-sm sm:w-auto sm:px-4"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-red-500 px-3 py-2.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 xs:text-sm sm:w-auto sm:px-4"
              >
                {loading ? "Changing Email..." : "Change Email"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ChangeEmail;
