import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../../components/other/BackButton";
import { getOwnerProfile } from "../../services/ownerService";
import { useTitle } from "../../hooks/useTitile";
import ChangeEmailModal from "./components/ChangeEmailModal";
import ChangePasswordModal from "./components/ChangePasswordModal";
import { MdArrowBack } from "react-icons/md";

const OwnerProfile = () => {
  useTitle("SmartStock: owner profile");

  const navigate = useNavigate();

  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOwnerProfile();
        setOwner(data);
      } catch (error) {
        setError(error?.message || "Unable to load owner profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerProfile();
  }, []);

  return (
    <main className="min-h-screen w-full bg-red-50">
      <div className="mx-auto w-full max-w-7xl px-3 py-5 xs:px-4 sm:px-6 sm:py-8 lg:px-10">
        {/* BACK BUTTON */}
        <div className="mb-5 sm:mb-6">
          <button
            onClick={() => navigate("/ownerhomepage")}
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors duration-200 hover:text-gray-800 hover:cursor-pointer sm:text-sm"
          >
            <MdArrowBack className="text-base sm:text-lg" />
            Back
          </button>
        </div>

        {/* PAGE HEADER */}
        <div className="mb-6 flex w-full min-w-0 flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="wrap-break-words text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
              Owner Profile
            </h1>

            <p className="mt-1.5 wrap-break-words text-xs text-gray-500 sm:text-sm">
              View your personal and business information.
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">
            {/* SETTINGS */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowSettings((prev) => !prev)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
                aria-label="Account settings"
                title="Account settings"
              >
                ⚙️
              </button>

              {showSettings && (
                <div className="absolute left-0 top-full z-50 mt-2 w-48 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSettings(false);
                      setShowEmailModal(true);
                    }}
                    className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                  >
                    Change email
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowSettings(false);
                      setShowPasswordModal(true);
                    }}
                    className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                  >
                    Change password
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/subscriptionPage");
                    }}
                    className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                  >
                    Subscription plan
                  </button>
                </div>
              )}
            </div>
            {/* UPDATE PROFILE */}
            <Link
              to="/updateOwnerProfile"
              className="inline-flex min-w-0 flex-1 items-center justify-center rounded-lg bg-red-500 px-3 py-2.5 text-center text-xs font-medium text-white shadow-sm transition-all duration-200 hover:bg-red-600 hover:shadow-md xs:px-4 sm:flex-none sm:text-sm"
            >
              Update Profile
            </Link>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className=" flex flex-col items-center justify-center rounded-2xl py-10 bg-white p-4 shadow-md sm:p-5 lg:p-6">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>

            <p className="mt-3 text-xs text-gray-500 sm:text-sm">
              Loading profile...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="w-full rounded-xl border border-red-200 bg-red-50 p-3 sm:p-5">
            <p className="wrap-break-words text-xs text-red-600 sm:text-sm">
              {error}
            </p>
          </div>
        )}

        {/* PROFILE */}
        {!loading && !error && owner && (
          <div className="w-full min-w-0 space-y-5 sm:space-y-6">
            {/* PROFILE SUMMARY */}
            <section className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-200 text-2xl font-bold text-red-500 xs:h-20 xs:w-20 xs:text-3xl sm:h-24 sm:w-24 sm:text-4xl">
                  {owner.name?.charAt(0)?.toUpperCase() || "O"}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <h2 className="min-w-0 max-w-full wrap-break-words text-lg font-bold text-gray-800 xs:text-xl sm:text-2xl">
                      {owner.name}
                    </h2>

                    <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-medium capitalize text-red-600 sm:text-xs">
                      {owner.role}
                    </span>
                  </div>

                  <p className="mt-1 break-all text-xs text-gray-500 sm:text-sm">
                    {owner.email}
                  </p>

                  <p className="mt-1 wrap-break-words text-[11px] text-gray-400 sm:text-xs">
                    Account Owner
                  </p>
                </div>
              </div>
            </section>

            {/* PERSONAL INFORMATION */}
            <section className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 py-3.5 sm:px-6 sm:py-4">
                <h2 className="wrap-break-words text-sm font-semibold text-gray-800 sm:text-base">
                  Personal Information
                </h2>

                <p className="mt-1 wrap-break-words text-xs text-gray-500">
                  Your personal account details.
                </p>
              </div>

              <div className="grid w-full min-w-0 grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:gap-5 sm:p-6">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Full Name</p>

                  <p className="mt-1 wrap-break-words text-sm font-medium text-gray-700">
                    {owner.name || "Not provided"}
                  </p>
                </div>

                {/* EMAIL */}
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Email Address</p>

                  <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
                    <p className="min-w-0 break-all text-sm font-medium text-gray-700">
                      {owner.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Phone Number</p>

                  <p className="mt-1 wrap-break-words text-sm font-medium text-gray-700">
                    {owner.phone || "Not provided"}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Account Role</p>

                  <p className="mt-1 wrap-break-words text-sm font-medium capitalize text-gray-700">
                    {owner.role || "Owner"}
                  </p>
                </div>
              </div>
            </section>

            {/* BUSINESS INFORMATION */}
            <section className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 py-3.5 sm:px-6 sm:py-4">
                <h2 className="wrap-break-words text-sm font-semibold text-gray-800 sm:text-base">
                  Business Information
                </h2>

                <p className="mt-1 wrap-break-words text-xs text-gray-500">
                  Information about your business.
                </p>
              </div>

              <div className="grid w-full min-w-0 grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:gap-5 sm:p-6">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Business Name</p>

                  <p className="mt-1 wrap-break-words text-sm font-medium text-gray-700">
                    {owner.businessName || "Not provided"}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Business Owner</p>

                  <p className="mt-1 wrap-break-words text-sm font-medium text-gray-700">
                    {owner.name || "Not provided"}
                  </p>
                </div>
              </div>
            </section>

            {/* ACCOUNT INFORMATION */}
            <section className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 py-3.5 sm:px-6 sm:py-4">
                <h2 className="wrap-break-words text-sm font-semibold text-gray-800 sm:text-base">
                  Account Information
                </h2>

                <p className="mt-1 wrap-break-words text-xs text-gray-500">
                  Basic information about your SmartStock account.
                </p>
              </div>

              <div className="grid w-full min-w-0 grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:gap-5 sm:p-6 lg:grid-cols-3">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Account ID</p>

                  <p className="mt-1 break-all text-[11px] font-medium text-gray-600 sm:text-xs">
                    {owner.id || "Not available"}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Account Type</p>

                  <p className="mt-1 wrap-break-words text-sm font-medium capitalize text-gray-700">
                    {owner.role || "Owner"}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Account Status</p>

                  <span className="mt-1 inline-block rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                    Active
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* CHANGE EMAIL MODAL */}
      {showEmailModal && (
        <ChangeEmailModal
          onClose={() => setShowEmailModal(false)}
          onContinue={() => {
            setShowEmailModal(false);
            navigate("/changeEmail");
          }}
        />
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onContinue={() => {
            setShowPasswordModal(false);
            navigate("/changePassword");
          }}
        />
      )}
    </main>
  );
};

export default OwnerProfile;
