import React, { useEffect, useState } from "react";
import ExpandedJob from "../job/ExpandedJobNew";
import {
  ArrowsExpandIcon,
  PaperAirplaneIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  AnnotationIcon,
  IdentificationIcon,
  LocationMarkerIcon,
  OfficeBuildingIcon,
  PlusIcon,
  StarIcon,
} from "@heroicons/react/solid";
import axios from "axios";
import DeleteWarning from "../DeleteWarning";
import { BACKEND_URI } from "/config";
import CreateJob from "../job/CreateJob";
import ExpandedJobCoach from "./ExpandedJobCoach";

const CoachJobs = ({
  user,
  auth,
  setFavoritUpdated,
  favoritUpdated,
  setShowAddToFavorite,
  showAddToFavorite,
  setShowAdditionalButtons,
  showAdditionalButtons,
  setNotification,
}) => {
  const [showExpandedJob, setShowExpandedJob] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState({});
  const [deletedJobId, setDeletedJobId] = useState(0);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [jobToApplicationId, setJobToApplicationId] = useState(0);
  const [showAddToApplicationWarning, setShowAddToApplicationWarning] =
    useState(false);
  const [coachJobs, setCoachJobs] = useState([]);
  const [showCreateJob, setShowCreateJob] = useState(false);

  useEffect(() => {
    axios(
      `${BACKEND_URI}/api/jobs?populate=*&filters[created_of_user][id][$eq]=${user.id}`,
      {
        method: "GET",
        headers: {
          Authorization: auth,
        },
      }
    )
      .then((res) => {
        setCoachJobs((coachJobs = res.data.data));
      })
      .catch((err) => {
        setNotification((pre) => ({
          ...pre,
          type: "error",
          showNotification: true,
          message: err.message,
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
      });
  }, [favoritUpdated]);

  if (coachJobs.length === 0) {
    return (
      <div className="mx-auto flex h-[90vh] w-auto place-items-center justify-center text-2xl">
        Du har inga jobb i favorit ännu! 😓
      </div>
    );
  }

  const handleExpandedJob = (e) => {
    e.preventDefault();
    setExpandedJobId(e.currentTarget.id);
    setShowAddToFavorite(false);
    setShowExpandedJob(!showExpandedJob);
  };

  const handleDeleteJob = (e) => {
    let deletedJobId = e.currentTarget.id;
    axios(`${BACKEND_URI}/api/jobs/${deletedJobId}`, {
      method: "DELETE",
      headers: { Authorization: auth },
    })
      .then((res) => setFavoritUpdated(!favoritUpdated))
      .catch((err) => {
        setNotification((pre) => ({
          ...pre,
          type: "error",
          showNotification: true,
          message: err.message,
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
      });
  };

  return (
    <main className="h-[100vh]">
      <header className="flex justify-end">
        {" "}
        {showAdditionalButtons && (
          <button
            className="m-2 rounded-lg bg-green-500 px-3 py-1 text-white"
            onClick={() => setShowCreateJob(true)}
          >
            Lägg till jobb
            <PlusIcon className="inline-block h-6 w-6" />
          </button>
        )}
      </header>
      <div
        className={`relative grid grid-cols-1 gap-5 p-5 md:grid-cols-2 xl:grid-cols-3  `}
      >
        {coachJobs.map((job) => {
          let jobStatus =
            "bg-gradient-to-r from-[#56ab2f] to-[#a8e063] text-white";
          /* const jobDate = new Date(job.attributes.application_deadline);
          let jobStatus =
            "bg-gradient-to-r from-[#56ab2f] to-[#a8e063] text-white";

          // the job card will be gray after announce deadline.

          if (new Date().getTime() > jobDate.getTime()) {
            jobStatus = "bg-gray-500 opacity-30";
          } */
          return (
            <div
              key={job.id}
              className={`w-42 relative  rounded-lg p-5 shadow-md ${jobStatus}   space-y-2`}
            >
              <div className="absolute top-2 left-[70%] flex space-x-3">
                {/* {!showAdditionalButtons && (
                  <PaperAirplaneIcon
                    className="h-6 w-6 text-green-700 hover:cursor-pointer hover:scale-150 duration-300"
                    id={job.id}
                    onClick={handleAddToApplications}
                  />
                )} */}
                <ArrowsExpandIcon
                  className="h-6 w-6  text-blue-900 duration-300 hover:scale-150 hover:cursor-pointer"
                  id={job.id}
                  onClick={handleExpandedJob}
                />
                <TrashIcon
                  className="h-6 w-6  text-red-600 duration-300 hover:scale-150 hover:cursor-pointer"
                  id={job.id}
                  onClick={handleDeleteJob}
                />
              </div>

              <StarIcon className="absolute -top-5 left-[50%] h-8 w-8 rounded-full bg-white text-yellow-400" />
              <p className=" text-xl">
                <AnnotationIcon className="mr-2 inline-block h-6 w-6" />
                {job.attributes.headline}
              </p>
              {/*  <p className="flex">
                {" "}
                <IdentificationIcon className="w-6 h-6" />
                {job.id}
              </p> */}
              <p className="flex  ">
                <LocationMarkerIcon className="mr-2 inline-block h-6 w-6" />
                {job.attributes.municipality}
              </p>
              <p className="flex ">
                <OfficeBuildingIcon className="mr-2 inline-block h-6 w-6" />
                {job.attributes.employer}
              </p>
            </div>
          );
        })}
        {showExpandedJob && (
          <ExpandedJobCoach
            expandedJobId={expandedJobId}
            auth={auth}
            user={user}
            setShowExpandedJob={setShowExpandedJob}
            setShowAddToFavorite={setShowAddToFavorite}
            showAddToFavorite={showAddToFavorite}
            setShowAdditionalButtons={setShowAdditionalButtons}
            showAdditionalButtons={showAdditionalButtons}
          />
        )}
        {showDeleteWarning && (
          <DeleteWarning
            deletedJobId={deletedJobId}
            auth={auth}
            user={user}
            setShowDeleteWarning={setShowDeleteWarning}
            setFavoritUpdated={setFavoritUpdated}
            favoritUpdated={favoritUpdated}
          />
        )}
        {/*  {showAddToApplicationWarning && (
          <AddToApplicationWarning
            jobToApplicationId={jobToApplicationId}
            auth={auth}
            user={user}
            setShowAddToApplicationWarning={setShowAddToApplicationWarning}
            setFavoritUpdated={setFavoritUpdated}
            favoritUpdated={favoritUpdated}
          />
        )} */}
      </div>
      {/* <div className=" text-center space-x-4">
        {pages.map((p) => (
          <a
            key={p}
            className="rounded-full bg-yellow-100 text-xl text-blue-400"
          >
            {p}
          </a>
        ))}
      </div> */}
      {showCreateJob && <CreateJob auth={auth} user={user} />}
    </main>
  );
};

export default CoachJobs;
