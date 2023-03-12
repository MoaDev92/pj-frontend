/**JobsWindow will show the jobs of a collection or a subscription */

import { LocationMarkerIcon, ArrowLeftIcon } from "@heroicons/react/outline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { JOB_API, JOB_API_EMPLOYER, JOB_API_KEY } from "../../config";
import ExpandedJob from "../job/ExpandedJobNew";
import SubNavbar from "../Layout/SubNavbar";

const JobsWindow = ({ setShowJobsWindow, choosedOption, auth, user }) => {
  const [jobs, setJobs] = useState([]);
  const [showLoading, setShowLoading] = useState("hidden");
  const [showExpandedJob, setShowExpandedJob] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState(0);
  const [showAddToFavorite, setShowAddToFavorite] = useState(false);

  useEffect(() => {
    const { typeOfJobs, filterQuery } = choosedOption;

    if (typeOfJobs === "subscription") {
      setShowLoading("");
      axios(`${JOB_API_EMPLOYER}${filterQuery}&offset=0&limit=100`, {
        method: "GET",
        headers: {
          "api-key": JOB_API_KEY,
        },
      }).then((res) => {
        setJobs((jobs = res.data.hits));
        setShowLoading("hidden");
      });
    }

    if (typeOfJobs === "collection") {
      setShowLoading("");
      axios(`${JOB_API}?${filterQuery}&offset=0&limit=100`, {
        method: "GET",
        headers: {
          "api-key": JOB_API_KEY,
        },
      }).then((res) => {
        setJobs((jobs = res.data.hits));
        setShowLoading("hidden");
      });
    }
  }, []);

  const handleChooseJob = (e) => {
    setExpandedJobId(e.currentTarget.id);
    setShowAddToFavorite(true);
    setShowExpandedJob(true);
  };

  return (
    <main className="absolute top-0 h-full w-full overflow-y-auto ">
      {!showExpandedJob && (
        <>
          <SubNavbar showWindow={setShowJobsWindow} compTitle={"foo"} />
          {/* <h1 className="mb-2 flex text-blue-500 underline">
            <ArrowLeftIcon
              className="h-6 w-6 hover:cursor-pointer"
              onClick={() => setShowJobsWindow(false)}
            />
            Tillbaka
          </h1> */}
          <div className=" grid grid-cols-4 gap-4 overflow-y-auto p-5">
            {jobs.map((job) => (
              <button
                key={job.id}
                id={job.id}
                className="min-h-36 relative h-auto space-y-2  rounded-lg border-2 border-pink-300 bg-indigo-200 p-5  shadow-md duration-300 hover:scale-105 xl:text-lg"
                onClick={handleChooseJob}
              >
                {/*  <ArrowsExpandIcon className="absolute top-0 left-[90%] h-6 w-6" id={job.id} onClick={handleChooseJob}/> */}
                <h1 className="font-Pacifico absolute -top-3 flex  rounded-lg bg-white px-2 text-pink-400">
                  <LocationMarkerIcon className="h-6 w-6" />
                  {job.workplace_address.municipality}
                </h1>
                <p className="rounded-xl  bg-gradient-to-r from-[#5f16d4] to-[#6292eb] p-2 text-white shadow-lg">
                  {job.headline}
                </p>
              </button>
            ))}
          </div>
          <iframe
            src="https://embed.lottiefiles.com/animation/88796"
            className={`${showLoading} h-35 w-35 absolute top-[40%] left-[40%] justify-center place-self-center`}
          ></iframe>
        </>
      )}
      {showExpandedJob && (
        <ExpandedJob
          expandedJobId={expandedJobId}
          setShowExpandedJob={setShowExpandedJob}
          setShowAddToFavorite={setShowAddToFavorite}
          showAddToFavorite={showAddToFavorite}
          user={user}
          auth={auth}
        />
      )}
    </main>
  );
};

export default JobsWindow;
