import {
  ClockIcon,
  XIcon,
  RefreshIcon,
  OfficeBuildingIcon,
  SpeakerphoneIcon,
  LocationMarkerIcon,
  CogIcon,
  DeviceMobileIcon,
  ExternalLinkIcon,
  BadgeCheckIcon,
  StarIcon,
  CalendarIcon,
  IdentificationIcon,
} from "@heroicons/react/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoCalendarClearOutline } from "react-icons/io5";
import { BACKEND_URI, JOB_API_JOBYID, JOB_API_KEY } from "../config";
import { useAddJobFavorit } from "../hooks/useAddJobFavorit";

const ExpandedJob = ({
  job,
  setShowExpandedJobb,
  auth,
  user,
  occuaptions,
  setFavoritUpdated,
  favoritUpdated,
  setShowAddToFavorite,
  showAddToFavorite,
  expandedJobId,
}) => {
  const [expandedJob, setExpandedJob] = useState("");

  /* useEffect(() => {
    axios(`${JOB_API_JOBYID}/${expandedJobId}`, {
      method: "GET",
      headers: {
        "api-key": JOB_API_KEY,
      },
    }).then((res) => {
      console.log(res.data);
    });
  }, []); */

  // <------------------------- add jobb to favorit ------------------------->;
  const handleAddJobToFavoirt = (e) => {
    if (!e.target.id) {
      return;
    }
    e.preventDefault();

    const data = {
      data: {
        headline: job[0].headline,
        jobID: job[0].jobID,
        occupation: job[0].occupation,
        description: job[0].description,
        //employment_type: job[0].employment_type,
        duration: job[0].duration,
        working_hours_type: job[0].working_hours_type,
        employer: job[0].employer,
        url: job[0].url,
        municipality: job[0].municipality,
        region: job[0].region,
        country: job[0].country,
        must_have: job[0].headline,
        publication_date: job[0].publication_date,
        logo_url: job[0].logo_url,
        driving_license_required: job[0].driving_license_required,
        //driving_licens: job[0].driving_licens[0].label,
        application_deadline: job[0].application_deadline,
        occupationGroup: job[0].occupationGroupTaxanomyID,
        userID: user.id,
      },
    };
    useAddJobFavorit(`${BACKEND_URI}/api/jobs/addJobToFavorite`, auth, data);
    setShowExpandedJobb(false);
    setFavoritUpdated(!favoritUpdated);
  };

  return (
    <main className={`absolute w-auto bg-white bg-opacity-50`}>
      {job.map((j) => (
        <div
          key={j.jobID}
          className=" relative mx-auto grid w-auto grid-cols-1 gap-3 space-y-3 rounded-md bg-white p-5 shadow-xl"
        >
          <section className=" flex">
            <div>
              <img src={j.logo_url} alt="log" width={100} className=""></img>
            </div>
            <div className="mx-auto flex space-x-3 bg-pink-400  p-4 text-white">
              <SpeakerphoneIcon className="h-6 w-6" />
              <h1 className="">{j.occupation}</h1>
            </div>
            <XIcon
              className="h-6 w-6 duration-200 hover:scale-125 hover:cursor-pointer hover:text-red-600"
              onClick={() => {
                setShowExpandedJobb(false);
                setShowAddToFavorite(false);
              }}
            />
          </section>
          <div className="mx-auto flex space-x-4 text-white">
            <a
              href={j.url}
              target="_blank"
              className="  flex rounded-md bg-cyan-500  px-4 py-2 shadow-xl duration-300 hover:bg-cyan-600"
            >
              <ExternalLinkIcon className="h-6 w-6" href={j.url} />
              Ansök nu!
            </a>
            {showAddToFavorite && (
              <a
                id={j.jobID}
                className=" flex rounded-md bg-yellow-400 px-4 py-2 shadow-xl duration-300 hover:cursor-pointer hover:bg-yellow-500"
                onClick={handleAddJobToFavoirt}
              >
                <StarIcon className="h-6 w-6" href={j.url} />
                Lägg till i mina jobb
              </a>
            )}
          </div>
          <section className="grid grid-cols-3 gap-2  rounded-lg p-4">
            <p className="flex">
              <LocationMarkerIcon className="h-6 w-6" />
              {j.municipality},{j.country}
            </p>
            <p className=" flex">
              <OfficeBuildingIcon className="h-6 w-6" />
              {j.employer}
            </p>
            <p className=" flex w-fit rounded-md">
              <CogIcon className="h-6 w-6" />
              {j.occupation}
            </p>
            <p className=" flex">
              <ClockIcon className="h-6 w-6" />
              {j.working_hours_type}
            </p>
            <p className=" flex">
              {" "}
              <RefreshIcon className="h-6 w-6" />
              {j.duration}
            </p>

            <p className=" flex">
              <DeviceMobileIcon className="h-6 w-6" />
              {j.application_contacts_name}, {j.application_contacts_telephone}
            </p>
            <p>
              <a className="flex">
                <CalendarIcon className="h-6 w-6" />
                Puplicerad
              </a>
              {j.publication_date}
            </p>
            <p className="w-fit rounded-md bg-red-600 px-3 py-1 text-white">
              <a className="flex ">
                <CalendarIcon className="h-6 w-6 " />
                Sista ansökningsdatum
              </a>
              {j.application_deadline}
            </p>

            <p className="flex">
              <IdentificationIcon className="h-6 w-6" />
              <a>Annons ID</a>
              {j.jobID}
            </p>
          </section>
          <div className="whitespace-pre-wrap rounded-md bg-indigo-500 p-5 text-white shadow-md">
            {/* <a>Om jobbet</a> */}
            <p>{j.description}</p>
          </div>
        </div>
      ))}
    </main>
  );
};

export default ExpandedJob;
