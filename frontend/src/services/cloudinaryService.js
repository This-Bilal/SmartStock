const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();

export const uploadProductImage = async (file) => {
  if (!file) {
    return "";
  }

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Cloudinary upload is not configured for the frontend.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  let response;

  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(CLOUDINARY_CLOUD_NAME)}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
  } catch {
    throw new Error("Unable to connect to Cloudinary. Check your connection and try again.");
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.error?.message || `Cloudinary upload failed (${response.status}).`,
    );
  }

  if (!result?.secure_url) {
    throw new Error("Cloudinary did not return a secure image URL.");
  }

  return result.secure_url;
};