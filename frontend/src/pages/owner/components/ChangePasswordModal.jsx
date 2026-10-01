import React from "react";

const ChangePasswordModal = ({ onClose, onContinue }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 xs:px-4">
      <div className="w-full min-w-0 max-w-md rounded-xl bg-white p-3 shadow-xl xs:p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 sm:mb-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-lg xs:h-11 xs:w-11 xs:text-xl">
            🔒
          </div>

          <h2 className="wrap-break-words text-base font-bold text-gray-800 xs:text-lg sm:text-xl">
            Change Password
          </h2>

          <p className="mt-2 wrap-break-words text-xs leading-5 text-gray-500 xs:text-sm xs:leading-6">
            You are about to change the password associated with your SmartStock
            account. You will need to provide your current password and choose a
            new password.
          </p>
        </div>

        {/* Warning */}
        <div className="mb-4 w-full min-w-0 rounded-lg border border-yellow-200 bg-yellow-50 p-2.5 xs:mb-5 xs:p-3">
          <p className="wrap-break-words text-[11px] leading-5 text-yellow-700 xs:text-xs sm:text-sm">
            Make sure you remember your new password. Your current password will
            no longer work once the password is successfully changed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-xs font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-200 xs:text-sm sm:w-auto sm:px-4"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="w-full rounded-lg bg-red-500 px-3 py-2.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-red-600 xs:text-sm sm:w-auto sm:px-4"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
