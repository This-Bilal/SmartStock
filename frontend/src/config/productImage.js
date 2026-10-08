const LEGACY_IMAGE_BASE_URL = "https://smartstock-api-i50s.onrender.com";

export const getProductImageUrl = (image) => {
  if (!image) {
    return "";
  }

  if (/^(https?:)?\/\//i.test(image)) {
    return image;
  }

  return `${LEGACY_IMAGE_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};