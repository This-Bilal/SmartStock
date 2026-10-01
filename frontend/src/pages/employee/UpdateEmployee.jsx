import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAnEmployee, updateEmployee } from "../../services/employeeService";
import BackButton from "../../components/other/BackButton";
import { useTitle } from "../../hooks/useTitile";
import { toast, Toaster } from "sonner";

const UpdateEmployee = () => {
  useTitle("SmartStock: update employee");

  const navigate = useNavigate()

  const { employeeId } = useParams();

  const [employee, setEmployee] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Get employee details
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);

        const data = await getAnEmployee(employeeId);

        setEmployee(data);

        setFormData({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "",
        });
      } catch (error) {
        toast.error(error.message || "Failed to load employee.")
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdating(true);

    try {
      const updatedEmployee = await updateEmployee(employeeId, formData);

      setEmployee(updatedEmployee);

      setFormData({
        name: updatedEmployee.name,
        email: updatedEmployee.email,
        role: updatedEmployee.role,
      });
      
      navigate("/employeeList")

      toast.success("Employee updated successfully.")
    } catch (error) {
      toast.error(error.message || "Failed to update employee.")
    } finally {
      setUpdating(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen w-full bg-red-50 flex flex-col items-center justify-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>

        <p className="mt-3 text-xs text-gray-500 sm:text-sm">Loading employee details...</p>
      </main>
    );
  }

  // Error while getting employee
  if (!employee) {
    return (
      <main className="min-h-screen w-full bg-red-50">
        <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="rounded-xl bg-red-50 p-4 text-center sm:p-5">
            <p className="text-xs text-red-600 sm:text-sm">
              {error || "Employee not found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

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
              Update Employee
            </h1>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm md:text-base">
              Update the employee's information below.
            </p>
          </div>

          {/* FORM CARD */}
          <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {/* NAME */}
              <div className="mb-4 sm:mb-5">
                <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
                  Name
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

              {/* ROLE */}
              <div className="mb-5 sm:mb-6">
                <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
                  Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 capitalize outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5 text-sm"
                >
                  <option value="">Select role</option>
                  <option value="manager">Manager</option>
                  <option value="cashier">Cashier</option>
                </select>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-2 border-t border-gray-100 pt-4 sm:gap-3 sm:pt-5">
                {/* CANCEL */}
                <button
                  type="button"
                  onClick={() => navigate("/employeeList")}
                  className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 sm:px-4 sm:py-2.5 sm:text-sm md:text-base"
                >
                  Cancel
                </button>

                {/* UPDATE */}
                <button
                  type="submit"
                  disabled={updating}
                  className={`flex-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-red-600 sm:px-4 sm:py-2.5 sm:text-sm md:text-base ${
                    updating ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  {updating ? "Updating..." : "Update Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UpdateEmployee;
