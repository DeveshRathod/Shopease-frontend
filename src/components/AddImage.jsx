import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase/firebase";

const AddImage = ({ allImages, setAllImages }) => {
  const handleDeleteImage = (imageId, id) => {
    const updatedImages = allImages.map((image) => {
      if (image.id === id) {
        const updatedImageList = image.images.filter(
          (img) => img.id !== imageId
        );
        return { ...image, images: updatedImageList };
      }
      return image;
    });
    setAllImages(updatedImages);
  };

  const handleDeleteCard = (id) => {
    const updatedImages = allImages.filter((image) => image.id !== id);
    setAllImages(updatedImages);
  };

  const handleFileUpload = (e, id) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const storage = getStorage(app);

    const storageRef = ref(
      storage,
      `/products/${id}/${new Date().getTime()}_${file.name}`
    );

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error("Error uploading image:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const updatedImages = allImages.map((image) => {
            if (image.id === id) {
              return {
                ...image,
                images: [
                  ...(image.images || []),
                  { id: Date.now(), url: downloadURL, name: file.name },
                ],
              };
            }
            return image;
          });

          setAllImages(updatedImages);
        });
      }
    );
  };

  return (
    <div className="w-full p-3 flex flex-col gap-4">
      {allImages.map((image) => (
        <div
          key={image.id}
          className="relative flex flex-col md:flex-row items-center justify-between p-4 md:p-6 gap-4 border rounded-md bg-white"
        >
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <div
              className="w-10 h-10 md:w-12 md:h-12 rounded-full"
              style={{ backgroundColor: image.color }}
            ></div>
            <p className="ml-2 text-sm md:text-base font-medium">
              {image.name}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {image.images &&
              image.images.map((img) => (
                <div
                  key={img.id}
                  className="w-10 h-10 md:w-12 md:h-12 relative"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    className="absolute top-0 right-0 -mt-2 -mr-2 text-red-600 bg-white p-1 rounded-full hover:bg-red-100 transition duration-200"
                    onClick={() => handleDeleteImage(img.id, image.id)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              ))}
          </div>
          <div className="flex items-center">
            <label
              htmlFor={`file-upload-${image.id}`}
              className="cursor-pointer"
            >
              <FileUploadIcon className="text-blue-600" />
            </label>
            <input
              id={`file-upload-${image.id}`}
              type="file"
              onChange={(e) => handleFileUpload(e, image.id)}
              style={{ display: "none" }}
            />
            <button
              onClick={() => handleDeleteCard(image.id)}
              className="ml-2 text-red-600 bg-white p-1 rounded-full hover:bg-red-100 transition duration-200"
            >
              <DeleteIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddImage;
