import { useState } from "react";
import axios from "axios";

function StegDecode(props) {
  const [file, setFile] = useState(null);
  const [fileInputError, setFileInputError] = useState(null);
  const [stegoKey, setStegoKey] = useState(null);
  const [stegoKeyError, setStegoKeyError] = useState(null);
  const [decodingStatus, setDecodingStatus] = useState(null);
  function handleFileChange(e) {
    const supported_file_formats = ["png"];
    if (e.target.files[0]) {
      if (
        !supported_file_formats.includes(e.target.files[0].type.split("/")[1])
      ) {
        setFile(null);
        setFileInputError("Unsupported file format.");
      } else {
        setFileInputError(null);
        setFile(e.target.files[0]);
      }
    }
  }
  function handleStegoKeyChange(e) {
    setStegoKey(e.target.value);
    if (!e.target.value) {
      setStegoKeyError(null);
    }
  }
  function handleFormSubmit(e) {
    setDecodingStatus(true);
    if (!file) {
      setFileInputError("Please choose an image file.");
      setDecodingStatus(false);
      return;
    } else if (!stegoKey) {
      setStegoKeyError("Please enter the Stegokey.");
      setDecodingStatus(false);
      return;
    }

    const url = props.formActionPath;
    const formData = new FormData();
    formData.append("stegoFile", file);
    formData.append("stegoKey", stegoKey);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post(url, formData, config)
      .then((response) => {
        if (response["data"]["success"]) {
          props.onDecodeSuccess(response["data"]);
        } else {
          props.onDecodeSuccess(response["data"]);
        }
        setDecodingStatus(false);
      })
      .catch((error) => {
        props.onDecodeError({ success: false, error: error });
        setDecodingStatus(false);
      });
  }
  return (
    <div className="w-full h-full flex justify-center mx-auto">
      <form className="flex flex-col items-center p-1 sm:p-5 gap-5">
        <div className="p-3 px-4 bg-gray-50 rounded-md w-full group hover:bg-gray-100 sm:px-7">
          <label
            className="block text-gray-400 text-sm font-bold mb-2 group-hover:text-gray-500"
            for="stegoFile"
          >
            Encoded image file ( .png )
          </label>
          <input
            type="file"
            name="stegoFile"
            onChange={handleFileChange}
            className="w-full border border-gray-500 bg-gray-50 rounded-md p-2"
          />
          <p
            className={
              fileInputError ? `block text-red-500 text-sm pt-2` : `hidden`
            }
          >
            {fileInputError}
          </p>
        </div>
        <div className="p-3 px-4 bg-gray-50 rounded-md w-full group hover:bg-gray-100 sm:px-7">
          <label
            className="block text-gray-400 text-sm font-bold mb-2 group-hover:text-gray-500"
            for="stegoKey"
          >
            Secret key
          </label>
          <input
            type="text"
            name="stegoKey"
            onChange={handleStegoKeyChange}
            placeholder="Secret key..."
            className="w-full border border-gray-500 rounded-md p-2"
          />
          <p className={stegoKeyError ? `block text-red-500 text-sm pt-2` : ``}>
            {stegoKeyError}
          </p>
        </div>
        <button
          type="button"
          onClick={
            decodingStatus
              ? () => {
                  alert("na na!");
                }
              : handleFormSubmit
          }
          className={`w-full bg-gray-500 p-3 rounded-md text-gray-50 ${
            decodingStatus ? "cursor-not-allowed" : "hover:bg-gray-600"
          }`}
        >
          {decodingStatus ? "Decoding..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default StegDecode;
