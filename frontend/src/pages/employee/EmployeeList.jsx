import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllEmployee } from "../../services/employeeService";
import EmployeeCard from "./components/EmployeeCard";
import BackButton from "../../components/other/BackButton";
import { useTitle } from "../../hooks/useTitile";
import { toast, Toaster } from "sonner";
import { MdArrowBack } from "react-icons/md";

const EmployeeList = () => {
  useTitle("SmartStock: employee list");

  const navigate = useNavigate()

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);

        const data = await getAllEmployee();
        setEmployees(data);
      } catch (error) {
        toast.error(error?.message || "Failed to load employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Update employee status in the UI
  const handleStatusChange = (employeeId) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === employeeId
          ? {
              ...employee,
              isActive: !employee.isActive,
            }
          : employee,
      ),
    );
  };

  const handleSuccess = (message) => {
    toast.success(message);
  };

  const handleError = (message) => {
    toast.error(message);
  };

  // Filter by name and status
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name
      ?.toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && employee.isActive) ||
      (filter === "deactivated" && !employee.isActive);

    return matchesSearch && matchesFilter;
  });

  return (
    <section className="min-h-screen w-full bg-red-50 px-3 py-6 sm:px-5 sm:py-8 md:px-6 lg:px-8">
      <Toaster position="top-right" richColors />

      <div className="mx-auto w-full max-w-7xl">
        {/* BACK BUTTON */}
        <div className="mb-4 sm:mb-5">
          <button onClick={() => navigate("/ownerhomepage")}
                className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors duration-200 hover:text-gray-800 hover:cursor-pointer sm:text-sm"
              >
                <MdArrowBack className="text-base sm:text-lg" />
                Back
              </button>
        </div>

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">
              Employees
            </h1>

            <p className="mt-1 text-[11px] text-gray-500 sm:text-xs md:text-sm">
              View and manage your business employees.
            </p>
          </div>

          <Link
            to="/createemployee"
            className="w-full rounded-lg bg-red-500 px-3 py-2 text-center text-[11px] font-medium text-white transition-all duration-200 hover:bg-red-600 sm:w-auto sm:px-4 sm:py-2.5 sm:text-xs md:text-sm"
          >
            + Add Employee
          </Link>
        </div>

        {/* SEARCH + FILTER SECTION */}
        {!loading && employees.length > 0 && (
          <div className="mb-5 rounded-xl bg-white p-3 shadow-sm sm:mb-6 sm:p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* DESCRIPTION */}
              <div>
                <p className="text-[11px] font-semibold text-gray-700 sm:text-xs md:text-sm">
                  Employee List
                </p>

                <p className="mt-0.5 text-[10px] text-gray-400 sm:text-[11px] md:text-xs">
                  Showing {filteredEmployees.length} employee
                  {filteredEmployees.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* SEARCH */}
              <div className="w-full md:w-64 lg:w-72">
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search employee by name..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-9 text-xs text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 sm:px-4 sm:py-2.5 sm:text-sm"
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                  </span>
                </div>
              </div>

              {/* FILTER BUTTONS */}
              <div className="flex w-full gap-2 md:w-auto">
                <button
                  type="button"
                  onClick={() => setFilter("active")}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-all duration-200 sm:flex-none sm:px-3 sm:py-2 sm:text-xs md:px-4 md:text-sm ${
                    filter === "active"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Active
                </button>

                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-all duration-200 sm:flex-none sm:px-3 sm:py-2 sm:text-xs md:px-4 md:text-sm ${
                    filter === "all"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>

                <button
                  type="button"
                  onClick={() => setFilter("deactivated")}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-all duration-200 sm:flex-none sm:px-3 sm:py-2 sm:text-xs md:px-4 md:text-sm ${
                    filter === "deactivated"
                      ? "bg-gray-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Deactivated
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 py-10 shadow-md sm:p-5 lg:p-6">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>

            <p className="mt-3 text-xs text-gray-500 sm:text-sm">
              Loading employees...
            </p>
          </div>
        )}

        {/* NO EMPLOYEES AT ALL */}
        {!loading && employees.length === 0 && (
          <div className="rounded-xl bg-white p-6 text-center shadow-md sm:p-8 md:p-10">
            <p className="text-xs font-medium text-gray-700 sm:text-sm md:text-base">
              No employees found.
            </p>

            <p className="mt-1 text-[11px] text-gray-500 sm:text-xs md:text-sm">
              Employees you add to your business will appear here.
            </p>

            <Link
              to="/createemployee"
              className="mt-4 inline-block rounded-lg bg-red-500 px-3 py-2 text-[11px] font-medium text-white transition-all duration-200 hover:bg-red-600 sm:mt-5 sm:px-4 sm:text-xs md:text-sm"
            >
              Add Your First Employee
            </Link>
          </div>
        )}

        {/* NO SEARCH/FILTER RESULTS */}
        {!loading && employees.length > 0 && filteredEmployees.length === 0 && (
          <div className="rounded-xl bg-white p-6 text-center shadow-md sm:p-8 md:p-10">
            <p className="text-xs font-medium text-gray-700 sm:text-sm md:text-base">
              No employees found.
            </p>

            <p className="mt-1 text-[11px] text-gray-500 sm:text-xs md:text-sm">
              {search
                ? `No employee matches "${search}".`
                : `There are currently no ${
                    filter === "active" ? "active" : "deactivated"
                  } employees.`}
            </p>
          </div>
        )}

        {/* EMPLOYEE LIST */}
        {!loading && filteredEmployees.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onStatusChange={handleStatusChange}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EmployeeList;
