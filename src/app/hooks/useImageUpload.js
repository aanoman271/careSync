"use client";

import { useState } from "react";
import { uploadToImgBB } from "../../lib/imgbb";

const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [error, setError] = useState(null);

  const uploadImage = async (imageFile) => {
    try {
      setUploading(true);
      setError(null);

      // validation
      //   if (!imageFile) {
      //     throw new Error("No image selected");
      //   }

      if (!imageFile.type.startsWith("image/")) {
        throw new Error("Only image files allowed");
      }

      const imageUrl = await uploadToImgBB(imageFile);

      setUploadedImage(imageUrl);

      return imageUrl;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading,
    uploadedImage,
    error,
  };
};

export default useImageUpload;
