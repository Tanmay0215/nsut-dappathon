import { useState } from 'react';

const FileUploadButton = () => {
  const [fileName, setFileName] = useState(null);

  const handleFileChange = (event) => {
    setFileName(event.target.files[0]?.name || null);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <label className="flex flex-col items-center w-64 px-4 py-6 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
        <svg
          className="w-8 h-8"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M16.88 3.55a4.88 4.88 0 00-8.76-1.8H6.62C4.3 1.75 2.5 3.55 2.5 5.88v8.75c0 2.33 1.8 4.13 4.12 4.13H15.5c2.33 0 4.12-1.8 4.12-4.13V8.25a4.88 4.88 0 00-2.74-4.7zm-6.7 5.63H6.12V8.25H10.2l1.38-1.88 3.75 4.13-3.76 4.13-1.37-1.88z" />
        </svg>
        <span className="mt-2 text-base leading-normal">Upload NFT Here:</span>
        <input type="file" className="hidden" onChange={handleFileChange} />
      </label>
      {fileName && (
        <p className="mt-2 text-sm text-gray-600">Uploaded NFT: {fileName}</p>
      )}
    </div>
  );
};

export default FileUploadButton;
