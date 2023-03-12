import { ExclamationCircleIcon } from "@heroicons/react/solid";
import React from "react";

const ErrorWarning = ({ errorMessage }) => {
  return (
    <div className="absolute top-5 p-5 text-white rounded-lg left-[60%] duration-300 bg-red-500">
      <ExclamationCircleIcon className="w-6 h-6 mx-auto" />
      {errorMessage}
    </div>
  );
};

export default ErrorWarning;
