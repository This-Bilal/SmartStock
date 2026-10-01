import { apiRequest, OWNER_ENDPOINTS } from "../config/api";

const transformData = (data) => ({
  id: data?._id,
  name: data?.name,
  email: data?.email,
  businessName: data?.businessName,
  phone: data?.phone,
  role: data?.role,
});

// Get Owner profile
export const getOwnerProfile = async () => {
  try {
    const response = await apiRequest(OWNER_ENDPOINTS.GET_OWNER_PROFILE);

    const transformedData = transformData(response);

    return transformedData
  } catch (error) {
    throw new Error(error?.message || "Failed to get profile");
  }
};

// Update owner profile
export const updateOwnerProfile = async (details) => {
    const {name, businessName, phone} = details

    const update = {}

    if (name !== undefined) {
        if (!name.trim()) {
            throw new Error("Name is required")
        }

        update.name = name.trim()
    }

    if (businessName !== undefined) {
        if (!businessName.trim()) {
            throw new Error("Business name is required")
        }

        update.businessName = businessName.trim()
    }

    if (phone !== undefined) {
        if (!phone.trim()) {
            throw new Error("Phone is required")
        }

        update.phone = phone.trim()
    }

    if (Object.keys(update).length === 0) {
        throw new Error("No changes made")
    }

    try {
        const response = await apiRequest(OWNER_ENDPOINTS.UPDATE_OWNER_PROFILE, {
        method: "PATCH",
        body: update
    })

    const transformedData = transformData(response)

    return transformedData
    } catch (error) {
        throw new Error(error?.message || "Failed to update profile.")
    }
}

// Change email
export const changeEmail = async (details) => {
    const {password, newEmail} = details

    if (!password) {
        throw new Error("Password is required.")
    }

    if (!newEmail) {
        throw new Error("New email is required.")
    }

    try {
        const response = await apiRequest(OWNER_ENDPOINTS.CHANGE_EMAIL, {
            method: "PATCH",
            body: {
                password,
                newEmail
            }
        })

        const transformedData = transformData(response)

        return transformedData
    } catch (error) {
        throw new Error(error.message || "Failed to change email.")
    }
}

// Change password 
export const changePassword = async (details) => {
    const {currentPassword, newPassword, confirmPassword} = details

    if (!currentPassword) {
        throw new Error("Current password is required.")
    }

    if (!newPassword) {
        throw new Error("New password is required.")
    }

    if (!confirmPassword) {
        throw new Error("Confirm new password.")
    }

    try {
        const response = await apiRequest(OWNER_ENDPOINTS.CHANGE_PASSWORD, {
            method: "PATCH",
            body: {
                currentPassword,
                newPassword,
                confirmPassword
            }
        })

        return response
    } catch (error) {
        throw new Error(error.message || "Failed to change password.")
    }
}


const ownerService = {
    getOwnerProfile,
    updateOwnerProfile,
    changeEmail,
    changePassword
}

export default ownerService