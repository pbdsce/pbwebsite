export const convertToWebP = (url: string): string => {
    if (url.startsWith("/images")) {
      return url.replace(/\.(jpg|jpeg|png)$/, ".webp"); // Convert local images
    }
    if (!url.includes("cloudinary.com")) return url; // If not Cloudinary, return as is
    return url.replace("/upload/", "/upload/f_webp/"); // Modify Cloudinary URL
  };