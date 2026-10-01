import { apiRequest, EMPLOYEE_ENDPOINTS } from "../config/api";

const transformData = (employee) => ({
  id: employee._id,
  name: employee.name,
  email: employee.email,
  role: employee.role,
  isActive: employee.isActive,
});

// Normalising email
const normaliseEmail = (email = "") => email.trim().toLowerCase();

// Create employee
export const createEmployee = async (employeeDetails) => {
  const { name, email, password, role } = employeeDetails;

  if (!name?.trim() || !email?.trim() || !password || !role) {
    throw new Error("All fields are required.");
  }

  if (!["manager", "cashier"].includes(role)) {
    throw new Error("Invalid employee role.");
  }

  try {
    const response = await apiRequest(EMPLOYEE_ENDPOINTS.CREATE_EMPLOYEE, {
      method: "POST",
      body: {
        name: name.trim(),
        email: normaliseEmail(email),
        password,
        role,
      },
    });

    const transformedData = transformData(response);

    return transformedData;
  } catch (error) {
    throw new Error(error.message || "Failed to create employee");
  }
};

// Get all employee
export const getAllEmployee = async () => {
  try {
    const response = await apiRequest(EMPLOYEE_ENDPOINTS.GET_ALL_EMPLOYEE);

    const transformedData = response.map(transformData);

    return transformedData;
  } catch (error) {
    throw new Error(error.message || "Failed to get employees");
  }
};

// Get an employee
export const getAnEmployee = async (employeeId) => {
  if (!employeeId) {
    throw new Error("Invalid employee ID");
  }

  try {
    const response = await apiRequest(
      EMPLOYEE_ENDPOINTS.GET_SINGLE_EMPLOYEE(employeeId),
    );

    const transformedData = transformData(response);
    return transformedData;
  } catch (error) {
    throw new Error(error.message || "Failed to get employee");
  }
};

// Update an employee
export const updateEmployee = async (employeeId, employeeDetails) => {
  const { name, email, role } = employeeDetails;

  if (!employeeId) {
    throw new Error("Invalid employee ID");
  }

  const updateData = {};

  if (name !== undefined) {
    if (!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    updateData.name = name.trim();
  }

  if (email !== undefined) {
    if (!email.trim()) {
      throw new Error("Email cannot be empty");
    }

    updateData.email = normaliseEmail(email);
  }

  if (role !== undefined) {
    if (!["manager", "cashier"].includes(role)) {
      throw new Error("Invalid employee role.");
    }

    updateData.role = role;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("No changes provided");
  }

  try {
    const response = await apiRequest(
      EMPLOYEE_ENDPOINTS.UPDATE_EMPLOYEE(employeeId),
      {
        method: "PATCH",
        body: updateData,
      },
    );

    const transformedData = transformData(response);

    return transformedData;
  } catch (error) {
    throw new Error(error.message || "Failed to update employee");
  }
};

//
export const changeEmployeeStatus = async (employeeId) => {
  if (!employeeId) {
    throw new Error("Invalid employee Id");
  }

  try {
    const response = await apiRequest(
      EMPLOYEE_ENDPOINTS.TOGGLE_EMPLOYEE_STATUS(employeeId),
      {
        method: "PATCH",
      },
    );

    const transformedData = transformData(response);

    return transformedData;
  } catch (error) {
    throw new Error(error.message || "Failed to change employee status");
  }
};


const employeeService = {
    createEmployee,
    getAllEmployee,
    getAnEmployee, 
    updateEmployee,
    changeEmployeeStatus
}