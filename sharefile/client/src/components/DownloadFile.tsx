import React from "react";

const DownloadFile = ({ downloadPageLink }) => {
  return (
    <div className="p-1">
      <h1 className="my-2 text-lg font-medium">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Et eius
        expedita incidunt dolore reiciendis nobis aliquam ab. Facere dolore,
        tenetur eaque consectetur rem facilis amet ipsam optio perspiciatis
        eligendi illo.
      </h1>
      <div className="flex space-x-3">
        <span className="break-all">{downloadPageLink}</span>
        <img
          className="w-8 h-8 object-contain cursor-pointer"
          src="/images/copy.png"
          alt="copy"
          onClick={() => navigator.clipboard.writeText(downloadPageLink)}
        />
      </div>
    </div>
  );
};

export default DownloadFile;
