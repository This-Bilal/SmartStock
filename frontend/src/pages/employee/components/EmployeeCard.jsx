import React, { useState } from "react";
import { Link } from "react-router-dom";
import { changeEmployeeStatus } from "../../../services/employeeService";

const EmployeeCard = ({ employee, onStatusChange, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const changeStatus = async () => {
    try {
      setLoading(true);

      await changeEmployeeStatus(employee.id);

      // Update employee status in parent component
      onStatusChange(employee.id);

      onSuccess(
        employee.isActive
          ? "Employee deactivated successfully."
          : "Employee activated successfully.",
      );
    } catch (error) {
      onError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to change employee status.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-xl bg-white p-3 shadow-md transition-all duration-200 hover:shadow-lg sm:p-4 md:p-5">
      {/* TOP SECTION */}
      <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
        {/* EMPLOYEE INFO */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4">
          {/* AVATAR */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-500 sm:h-10 sm:w-10 sm:text-base md:h-12 md:w-12 md:text-lg">
            {employee?.name?.charAt(0).toUpperCase()}
          </div>

          {/* NAME & EMAIL */}
          <div className="min-w-0">
            <h3 className="truncate text-xs font-semibold text-gray-800 sm:text-sm md:text-base">
              {employee?.name}
            </h3>

            <p className="mt-0.5 truncate text-[10px] text-gray-500 sm:text-xs md:text-sm">
              {employee?.email}
            </p>
          </div>
        </div>

        {/* STATUS */}
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium sm:px-2.5 sm:py-1 sm:text-xs ${
            employee?.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {employee?.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* DIVIDER */}
      <div className="my-3 border-t border-gray-100 sm:my-4" />

      {/* DETAILS */}
      <div className="flex items-center justify-between">
        {/* ROLE */}
        <div>
          <p className="text-[10px] text-gray-400 sm:text-xs">Role</p>

          <p className="mt-0.5 text-xs font-medium capitalize text-gray-700 sm:mt-1 sm:text-sm">
            {employee?.role}
          </p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3 sm:mt-5 sm:gap-3 sm:pt-4">
        {/* UPDATE */}
        <Link
          to={`/updateEmployee/${employee?.id}`}
          className="flex-1 rounded-lg bg-blue-50 px-2 py-1.5 text-center text-[10px] font-medium text-blue-600 transition-all duration-200 hover:bg-blue-100 sm:px-3 sm:py-2 sm:text-xs md:px-4 md:text-sm"
        >
          Update
        </Link>

        {/* DEACTIVATE / ACTIVATE */}
        <button
          type="button"
          onClick={changeStatus}
          disabled={loading}
          className={`flex-1 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-all duration-200 sm:px-3 sm:py-2 sm:text-xs md:px-4 md:text-sm ${
            employee?.isActive
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "bg-green-50 text-green-600 hover:bg-green-100"
          } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {loading
            ? "Updating..."
            : employee?.isActive
              ? "Deactivate"
              : "Activate"}
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
