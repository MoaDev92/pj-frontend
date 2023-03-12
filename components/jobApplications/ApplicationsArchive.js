import React, { useCallback, useEffect, useState } from "react";

import {
  ArchiveIcon,
  ArrowsExpandIcon,
  InboxInIcon,
  PaperAirplaneIcon,
  SpeakerphoneIcon,
  TranslateIcon,
  TrashIcon,
} from "@heroicons/react/solid";

import { BACKEND_URI } from "/config";
import axios from "axios";

const ApplicationsArchive = ({
  user,
  auth,
  //archiveApplications,
  setApplicationUpdated,
  applicationUpdated,
}) => {
  const [archiveApplications, setArchiveApplications] = useState([]);
  const [deletedApplication, setApplication] = useState([]);
  const [updated, setUpdated] = useState(false);
  //const [animationArchiveToInbox, setAnimationArchiveToInbox] = useState("");

  useEffect(() => {
    axios(
      `${BACKEND_URI}/api/applications?populate=*&filters[user][id][$eq]=${user.id}&filters[status]=archive`,
      {
        method: "GET",
        headers: {
          Authorization: auth,
        },
      }
    ).then((res) => {
      setArchiveApplications(res.data.data);
    });
  }, [updated]);

  if (archiveApplications.length === 0) {
    return (
      <div className="mx-auto flex h-[90vh] w-auto place-items-center justify-center text-2xl">
        Du har inget i arkiv! 😓
      </div>
    );
  }

  const handleDeleteApplication = async (e) => {
    if (!e.currentTarget.id) {
      return;
    }
    const applicationId = e.currentTarget.id;
    /* const application = archiveApplications.filter(
      (j) => parseInt(j.applicationId) === parseInt(applicationId)
    );
     setApplication(application);
    setShowDeleteWarning(true); */

    fetch(
      `${BACKEND_URI}/api/applications/deleteApplication?applicationId=${applicationId}&u=${user.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: auth,
        },
      }
    )
      .then((res) => setUpdated(!updated))
      .catch((err) => alert("Something went wrong with delete archive!!"));
  };

  const handleReturnApplication = async (e) => {
    if (!e.currentTarget.id) {
      return;
    }
    const applicationId = e.currentTarget.id;
    //setAnimationArchiveToInbox("scale-0 -translate-x-[100%] translate-y-[35%]");
    /* const application = archiveApplications.filter(
      (j) => parseInt(j.applicationId) === parseInt(applicationId)
    );
     setApplication(application);
    setShowDeleteWarning(true); */

    axios(`${BACKEND_URI}/api/applications/updateApplicationStatus`, {
      method: "PUT",
      data: {
        applicationId: applicationId,
        status: "sent",
      },
      headers: {
        Authorization: auth,
      },
    })
      .then((res) => {
        setUpdated(!updated);
        /*  setTimeout(() => {
          setAnimationArchiveToInbox("");
          
        }, 1000); */
      })
      .catch((err) =>
        alert(`Somthing went wrong with return application to inbox`)
      );
  };
  /*  const myApplications = await data.data;

    archiveApplications = myApplications.filter(
      (application) => application.attributes.status === "archive"
    ) */

  return (
    <main className=" h-full min-h-screen overflow-y-auto bg-gradient-to-b from-[#5b4197] to-neutral-900 ">
      <div
        className={`relative grid grid-cols-1 gap-5 p-5 md:grid-cols-2 xl:grid-cols-3  `}
      >
        {archiveApplications.map((application) => {
          /*  const jobDate = new Date(job.application_deadline);

          let jobStatus =
            "bg-gradient-to-r from-[#56ab2f] to-[#a8e063] text-white";

          // the job card will be gray after announce deadline.

          if (new Date().getTime() > jobDate.getTime()) {
            jobStatus = "bg-gray-500 opacity-30";
          } */

          return (
            <div
              key={application.id}
              className={`w-42 {jobStatus}  relative space-y-2 rounded-2xl bg-[#2c1e4d] p-5 text-white shadow-lg shadow-fuchsia-600 duration-1000 `}
            >
              <div className="absolute top-2 left-[75%] flex space-x-3">
                <InboxInIcon
                  className="h-6 w-6 text-green-300 duration-300  hover:scale-150  hover:cursor-pointer"
                  id={application.id}
                  onClick={handleReturnApplication}
                />
                <TrashIcon
                  className="h-6 w-6  text-red-300 duration-300 hover:scale-150 hover:cursor-pointer"
                  id={application.id}
                  onClick={handleDeleteApplication}
                />
              </div>

              {/* <ArchiveIcon className="w-10 h-10 absolute -top-5 left-[50%] rounded-full bg-yellow-200  text-yellow-400" /> */}
              <p className="flex text-xl  ">
                Ansökans ID:
                {application.attributes.job.data.attributes.jobID}
              </p>
              <p className="flex ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                {application.attributes.job.data.attributes.employer}
              </p>
              <p className="flex ">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                {application.attributes.job.data.attributes.headline}
              </p>
              <p className="">
                {" "}
                🔧 {application.attributes.job.data.attributes.occupation}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default ApplicationsArchive;
