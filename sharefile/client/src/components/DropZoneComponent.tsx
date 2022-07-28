import React, { Dispatch, FunctionComponent, useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Props = {};

const DropZoneComponent: FunctionComponent<{ setFile: Dispatch<any> }> = ({
  setFile,
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpeg", "jpg"],
        "audio/mpeg": [".mp3", ".mpeg"],
        "text/plain": [".txt"],
      },
      // accept: 'text/plain, image/jpeg, image/png, audio/mpeg'
    });

  return (
    <div className="p-4 w-full">
      <div
        {...getRootProps()}
        className="w-full h-80 rounded-md cursor-pointer focus:outline-none"
      >
        <input {...getInputProps()} />

        <div
          className={
            "flex flex-col items-center justify-center border-2 border-dashed border-yellow-light rounded-xl h-full space-y-3 " +
            (isDragReject === true ? "border-red-500" : "") +
            (isDragAccept === true ? "border-green-500" : "")
          }
        >
          <img src="/images/folder.png" alt="folder" className="h-16 w-16" />

          {isDragReject ? (
            <p>Sorry, it supports only images, mp3 files and text files</p>
          ) : (
            <>
              <p>Drag & Drop files here</p>
              <p className="mt-2 text-base text-gray-300">
                Only jpeg, png, txt & mp3 files are supported
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropZoneComponent;
