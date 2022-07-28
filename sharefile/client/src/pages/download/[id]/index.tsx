import RenderFile from "@components/RenderFile";
import axios from "axios";
import { IFile } from "libs/types";
import { GetServerSidePropsContext, NextPage } from "next";
import React from "react";
import fileDownload from "js-file-download";

const index: NextPage<{
  file: IFile;
}> = ({ file: { format, name, sizeInBytes, id } }) => {
  const handleDownload = async () => {
    const { data } = await axios.get(
      `http://localhost:4000/api/files/${id}/download`,
      {
        responseType: "blob",
      }
    );

    fileDownload(data, name);
  };

  return (
    <div className="flex flex-col items-center justify-center py-3 space-y-4 bg-gray-800 rounded-md shadow-xl w-96">
      {!id ? (
        <span>Oops! File doesn't exist, check the URL</span>
      ) : (
        <>
          <img
            className="w-16 h-16"
            src="/images/file-download.png"
            alt="file icon"
          />
          <h1 className="text-xl">Your file is ready to be downloaded</h1>
          <RenderFile file={{ format, name, sizeInBytes }} />
          <button onClick={handleDownload} className="button">
            Download
          </button>
        </>
      )}
    </div>
  );
};

export default index;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  let file;
  try {
    const { data } = await axios.get(`http://localhost:4000/api/files/${id}`);
    file = data;
  } catch (error) {
    console.log(error.response.data.message);
    file = {};
  }

  return {
    props: {
      file,
    },
  };
}
