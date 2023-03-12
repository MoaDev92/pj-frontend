import { ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/solid";
import React from "react";

const NotificationCard = ({ notification }) => {
  if (notification.type === "error") {
    return (
      <div className="absolute top-5 p-5 text-white rounded-lg left-[60%] duration-300 bg-red-500">
        <ExclamationCircleIcon className="w-6 h-6 mx-auto" />
        {notification.message}
      </div>
    );
  }
  if (notification.type === "success") {
    return (
      <div className="absolute top-5 p-5 text-white rounded-lg left-[60%] duration-300 bg-green-500">
        <CheckCircleIcon className="w-6 h-6 mx-auto" />
        {notification.message}
      </div>
    );
  }
};

export default NotificationCard;
