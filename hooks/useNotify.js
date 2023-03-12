import React, { useState } from "react";

export const useNotify = (type, message) => {
  const [notifcation, setNotification] = useState({});

  setNotification((pre) => ({
    ...pre,
    type,
    showNotification: true,
    message,
  }));
  setTimeout(() => {
    setNotification((pre) => ({
      ...pre,
      type: "",
      showNotification: false,
      message: "",
    }));
    setShowExpandedJob(false);
  }, 2000);

  return { notifcation };
};
