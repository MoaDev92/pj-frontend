import React, { useCallback, useEffect, useState } from "react";
import ExpandedJob from "./ExpandedJobNew";
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
import AddToApplicationWarning from "../AddToApplicationWarning";
import { BACKEND_URI } from "/config";
import CreateJob from "../job/CreateJob";
import ExpandedJobCoach from "../coach/ExpandedJobCoach";
import { toast } from "react-toastify";

const MinaJobb = ({
  user,
  auth,
  setFavoritUpdated,
  favoritUpdated,
  setShowAddToFavorite,
  showAddToFavorite,
  setShowAdditionalButtons,
  showAdditionalButtons,
}) => {
  const [showExpandedJob, setShowExpandedJob] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState([]);
  const [deletedJobId, setDeletedJobId] = useState(0);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [jobToApplicationId, setJobToApplicationId] = useState(0);
  const [showAddToApplicationWarning, setShowAddToApplicationWarning] =
    useState(false);
  const [myJobs, setMyJobs] = useState([]);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showExpandedJobCoach, setShowExpandedJobCoach] = useState(false);

  useEffect(() => {
    axios(
      `${BACKEND_URI}/api/jobs?populate=*&filters[users][id][$eq]=${user.id}`,
      {
        method: "GET",
        headers: {
          Authorization: auth,
        },
      }
    )
      .then((res) => {
        setMyJobs((myJobs = res.data.data));
        console.log(myJobs);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, [favoritUpdated]);

  const handleExpandedJob = (e) => {
    e.preventDefault();
    const idObject = e.currentTarget.id.split(",");
    const expandedJobId = idObject[0];
    const expandedJobType = idObject[1];

    setExpandedJobId(expandedJobId);
    if (expandedJobType === "coach") {
      return setShowExpandedJobCoach(true);
    } else {
      setShowExpandedJob(true);
      setShowAddToFavorite(false);
      setShowExpandedJob(!showExpandedJob);
    }
  };

  const handleDeleteJob = (e) => {
    /* toast.warning(
      <button>
        <TrashIcon className="h-6 w-6" /> Radera
      </button>,
      {
        position: "top-center",
        autoClose: false,
        className: "border-2 border-pink-500 translate-y-64 duration-300",
      }
    ); */
    setDeletedJobId(e.currentTarget.id);
    setShowDeleteWarning(true);
  };

  const handleAddToApplications = useCallback((e) => {
    const jobID = e.currentTarget.id;
    setJobToApplicationId(jobID);
    setShowAddToApplicationWarning(true);
  });

  return (
    <main className="realtive h-screen max-h-screen overflow-y-auto">
      <header className="flex justify-end">
        {setShowAdditionalButtons && (
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
        {myJobs.length !== 0 ? (
          myJobs.map((job) => {
            let jobType;
            const jobDate = new Date(job.attributes.application_deadline);
            let jobStatus =
              "bg-gradient-to-r from-[#56ab2f] to-[#a8e063] text-white";
            //

            if (new Date().getTime() > jobDate.getTime()) {
              // the job card will be gray after announce deadline.

              jobStatus = "bg-gray-500 opacity-30";
            }
            if (
              !job.attributes.application_deadline &&
              job.attributes.created_of_user.data.attributes.username !== null
            ) {
              jobType = "coach";
              jobStatus =
                "bg-gradient-to-r from-blue-700 to-sky-300 text-white";
            }

            return (
              <div
                key={job.attributes.jobID}
                className={`w-42 relative  rounded-lg p-5 shadow-md ${jobStatus}   space-y-2`}
              >
                <div className="absolute top-2  left-[70%] flex space-x-3">
                  {!showAdditionalButtons && (
                    <PaperAirplaneIcon
                      className="h-6 w-6 text-green-700 duration-300 hover:scale-150 hover:cursor-pointer"
                      id={job.id}
                      onClick={handleAddToApplications}
                    />
                  )}
                  <ArrowsExpandIcon
                    className="h-6 w-6  text-blue-900 duration-300 hover:scale-150 hover:cursor-pointer"
                    id={`${job.attributes.jobID || job.id},${jobType}`}
                    onClick={handleExpandedJob}
                  />
                  <TrashIcon
                    className="h-6 w-6  text-red-600 duration-300 hover:scale-150 hover:cursor-pointer"
                    id={job.id}
                    onClick={handleDeleteJob}
                  />
                </div>

                <StarIcon className="absolute -top-5 left-[50%] h-8 w-8 rounded-full bg-white p-1 text-yellow-400" />
                <p className="flex">
                  {" "}
                  <IdentificationIcon className="mr-2 h-6 w-6" />
                  {job.attributes.jobID === null
                    ? job.attributes.created_of_user.data.attributes.username
                    : job.attributes.jobID}
                </p>
                <p className="flex  ">
                  <LocationMarkerIcon className="mr-2 h-6 w-6" />
                  {job.attributes.municipality}
                </p>
                <p className="flex ">
                  <OfficeBuildingIcon className="mr-2 h-6 w-6" />
                  {job.attributes.employer}
                </p>
                <p className="flex ">
                  <AnnotationIcon className="mr-2 h-6 w-6" />
                  {job.attributes.headline}
                </p>
              </div>
            );
          })
        ) : (
          <div className="mx-auto flex h-[90vh] w-auto place-items-center justify-center text-2xl">
            Du har inga jobb i favorit ännu! 😓
          </div>
        )}
        {showExpandedJob && (
          <ExpandedJob
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
        {showExpandedJobCoach && (
          <ExpandedJobCoach
            expandedJobId={expandedJobId}
            auth={auth}
            user={user}
            setShowExpandedJob={setShowExpandedJobCoach}
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
        {showAddToApplicationWarning && (
          <AddToApplicationWarning
            jobToApplicationId={jobToApplicationId}
            auth={auth}
            user={user}
            setShowAddToApplicationWarning={setShowAddToApplicationWarning}
            setFavoritUpdated={setFavoritUpdated}
            favoritUpdated={favoritUpdated}
          />
        )}
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
      {showCreateJob && (
        <CreateJob
          auth={auth}
          user={user}
          setShowCreateJob={setShowCreateJob}
        />
      )}
    </main>
  );
};

export default MinaJobb;
