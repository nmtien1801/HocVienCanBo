import React, { useState, useEffect } from 'react';
import { loadImage } from "../utils/constants.js"; // hàm async của bạn

export default function ImageLoader({ imagePath, onClick, className, alt }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (!imagePath) {
      setSrc(null);
      return;
    }

    let isMounted = true;
    let objectUrl = null;

    const fetchImage = async () => {
      const imgUrl = await loadImage(imagePath);

      if (isMounted) {
        objectUrl = imgUrl;
        setSrc(imgUrl); // Blob URL
      }
    };

    fetchImage();

    return () => {
      isMounted = false;

      // cleanup Blob URL tránh memory leak
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imagePath]);

  return (
    <img
      src={src ?? "/no-image.png"}
      alt={alt || "image"}
      className={className}
      onClick={onClick}
    />
  );
}
