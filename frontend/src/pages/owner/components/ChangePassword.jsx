import React, { useState } from "react";
import BackButton from "../../../components/other/BackButton";
import { useTitle } from "../../../hooks/useTitile";
import { changePassword } from "../../../services/ownerService";
import { useNavigate } from "react-router-dom";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { toast } from "sonner";

const ChangePassword = () => {
  useTitle("SmartStock: change password");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [currentShowPasswords, setCurrentShowPasswords] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match.")
      return;
    }

    try {
      setLoading(true);

      await changePassword(formData);

      navigate("/ownerprofile")

      toast.success("Password changed successfully.")

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error?.message || "Failed to change password.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-red-50">
      <div className="mx-auto w-full max-w-7xl px-3 py-5 xs:px-4 sm:px-6 sm:py-8 lg:px-10">
        {/* BACK BUTTON */}
        <div className="mb-5 sm:mb-6">
          <BackButton />
        </div>

        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <h1 className="wrap-break-words text-lg font-bold text-gray-800 xs:text-xl sm:text-2xl lg:text-3xl">
            Change Password
          </h1>

          <p className="mt-1.5 wrap-break-words text-[11px] text-gray-500 xs:text-xs sm:text-sm">
            Update the password associated with your SmartStock account.
          </p>
        </div>

        {/* FORM CONTAINER */}
        <div className="mx-auto w-full min-w-0 max-w-xl rounded-xl border border-gray-100 bg-white p-3 shadow-sm xs:p-4 sm:p-6 lg:p-8">
          {/* ICON */}
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-lg xs:h-11 xs:w-11 xs:text-xl sm:mb-5 sm:h-12 sm:w-12">
            🔒
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* CURRENT PASSWORD */}
            <div className="min-w-0">
              <label
                htmlFor="currentPassword"
                className="mb-1.5 block wrap-break-words text-[11px] font-medium text-gray-700 xs:text-xs sm:text-sm"
              >
                Current Password
              </label>

              <div className="relative min-w-0">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={currentShowPasswords ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  className="w-full min-w-0 rounded-lg border border-gray-200 px-2.5 py-2 text-xs outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 xs:px-3 xs:text-sm sm:px-4 sm:py-2.5"
                />

                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-gray-700"
                  type="button"
                  onClick={() => setCurrentShowPasswords(!currentShowPasswords)}
                >
                  {currentShowPasswords ? <IoMdEyeOff /> : <IoMdEye />}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="min-w-0">
              <label
                htmlFor="newPassword"
                className="mb-1.5 block wrap-break-words text-[11px] font-medium text-gray-700 xs:text-xs sm:text-sm"
              >
                New Password
              </label>

              <div className="relative min-w-0">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  className="w-full min-w-0 rounded-lg border border-gray-200 px-2.5 py-2 pr-10 text-xs outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 xs:px-3 xs:text-sm sm:px-4 sm:py-2.5"
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

            {/* CONFIRM PASSWORD */}
            <div className="min-w-0">
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block wrap-break-words text-[11px] font-medium text-gray-700 xs:text-xs sm:text-sm"
              >
                Confirm New Password
              </label>

              <div className="relative min-w-0">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPasswords ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  className="w-full min-w-0 rounded-lg border border-gray-200 px-2.5 py-2 pr-10 text-xs outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 xs:px-3 xs:text-sm sm:px-4 sm:py-2.5"
                />

                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-gray-700"
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? <IoMdEyeOff /> : <IoMdEye />}
                </button>
              </div>
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
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ChangePassword;
