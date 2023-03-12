import axios from "axios";
import React, { useEffect, useState } from "react";
import { JOB_API_KEY } from "../config";

export const useFetchExternaJob = (url) => {
  const [jobs, setJobs] = useState([]);
  const [notifcation, setNotification] = useState({});

  const getJobs = () => {
    axios(url, {
      method: "GET",
      headers: {
        "api-key": JOB_API_KEY,
      },
    })
      .then((res) => {
        setExpandedJob((previousState) => {
          return [...previousState, res.data];
        });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setNotification((pre) => ({
            ...pre,
            type: "error",
            showNotification: true,
            message: "Jobbet hittats ej! Jobbet kan ha raderats!",
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
        }
      });
  };

  useEffect(() => {
    getJobs();
  }, [url]);

  return { jobs, notifcation };
};

//`${JOB_API_JOBYID}/${expandedJobId}`;

/* export const useNotify = (type, message) => {
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
}; */
