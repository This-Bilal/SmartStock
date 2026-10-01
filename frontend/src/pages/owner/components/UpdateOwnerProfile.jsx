import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTitle } from "../../../hooks/useTitile";
import BackButton from "../../../components/other/BackButton";
import {
  getOwnerProfile,
  updateOwnerProfile,
} from "../../../services/ownerService";
import { toast, Toaster } from "sonner";

const UpdateOwnerProfile = () => {
  useTitle("SmartStock: update profile");

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getOwnerProfile();

        setFormData({
          name: data?.name || "",
          businessName: data?.businessName || "",
          phone: data?.phone || "",
        });
      } catch (error) {
        toast.error(error?.message || "Unable to load profile.")
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = await updateOwnerProfile(formData);

      setFormData({
        name: data?.name || formData.name,
        businessName: data?.businessName || formData.businessName,
        phone: data?.phone || formData.phone,
      });
      navigate("/ownerprofile")
      toast.success("Profile updated successfully.")
    } catch (error) {
      toast.error(error?.message || "Unable to update profile.")
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-red-50">
      <div className="mx-auto w-full max-w-4xl px-3 py-5 xs:px-4 sm:px-6 sm:py-8 lg:px-8">
        {/* Back Button */}
        <div className="mb-5 sm:mb-6">
          <BackButton />
        </div>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="wrap-break-words text-lg font-bold text-gray-800 xs:text-xl sm:text-2xl lg:text-3xl">
            Update Profile
          </h1>

          <p className="mt-1.5 wrap-break-words text-[11px] text-gray-500 xs:text-xs sm:text-sm">
            Update your personal and business information.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-40 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
          >
            {/* Form Header */}
            <div className="border-b border-gray-200 px-3 py-3.5 xs:px-4 sm:px-6 sm:py-4">
              <h2 className="wrap-break-words text-xs font-semibold text-gray-800 xs:text-sm sm:text-base">
                Profile Information
              </h2>

              <p className="mt-1 wrap-break-words text-[11px] text-gray-500 xs:text-xs">
                Make changes to your account information below.
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid w-full min-w-0 grid-cols-1 gap-4 p-3 xs:p-4 sm:grid-cols-2 sm:gap-5 sm:p-6">
              {/* Name */}
              <div className="min-w-0">
                <label
                  htmlFor="name"
                  className="mb-1.5 block wrap-break-words text-[11px] font-medium text-gray-600 xs:text-xs"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full min-w-0 rounded-lg border border-gray-200 px-2.5 py-2 text-xs outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 xs:px-3 xs:text-sm sm:px-4 sm:py-2.5"
                />
              </div>

              {/* Business Name */}
              <div className="min-w-0">
                <label
                  htmlFor="businessName"
                  className="mb-1.5 block wrap-break-words text-[11px] font-medium text-gray-600 xs:text-xs"
                >
                  Business Name
                </label>

                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter business name"
                  className="w-full min-w-0 rounded-lg border border-gray-200 px-2.5 py-2 text-xs outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 xs:px-3 xs:text-sm sm:px-4 sm:py-2.5"
                />
              </div>

              {/* Phone */}
              <div className="min-w-0">
                <label
                  htmlFor="phone"
                  className="mb-1.5 block wrap-break-words text-[11px] font-medium text-gray-600 xs:text-xs"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full min-w-0 rounded-lg border border-gray-200 px-2.5 py-2 text-xs outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 xs:px-3 xs:text-sm sm:px-4 sm:py-2.5"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-3 py-3.5 xs:px-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 sm:py-4">
              <Link
                to="/ownerprofile"
                className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-xs font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100 xs:text-sm sm:w-auto sm:px-4"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center rounded-lg bg-red-500 px-3 py-2.5 text-xs font-medium text-white transition-all duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 xs:text-sm sm:w-auto sm:px-4"
              >
                {saving ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};

export default UpdateOwnerProfile;
