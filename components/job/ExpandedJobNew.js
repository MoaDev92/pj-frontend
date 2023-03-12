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
  ArrowLeftIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import { GiSteeringWheel } from "react-icons/gi";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoCalendarClearOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { BACKEND_URI, JOB_API_JOBYID, JOB_API_KEY } from "../../config";
import { useAddJobFavorit } from "../../hooks/useAddJobFavorit";
import MyParticipants from "../coach/MyParticipants";

const ExpandedJob = ({
  job,
  setShowExpandedJob,
  auth,
  user,
  occuaptions,
  setFavoritUpdated,
  favoritUpdated,
  setShowAddToFavorite,
  showAddToFavorite,
  expandedJobId,
  showAdditionalButtons,
  setShowAdditionalButtons,
  notification,
  setNotification,
}) => {
  console.log(notification);
  const [expandedJob, setExpandedJob] = useState([]);
  const [showParticipantsList, setShowParticipantsList] = useState(false);

  useEffect(() => {
    axios(`${JOB_API_JOBYID}/${expandedJobId}`, {
      method: "GET",
      headers: {
        "api-key": JOB_API_KEY,
      },
    })
      .then((res) => {
        setExpandedJob((expandedJob = [res.data]));
        console.log(res.data);
      })
      .catch((err) => {
        toast.error(" Jobbet hittats ej! 😓 jobbet kan ha raderats!", {
          theme: "colored",
        });
        setShowExpandedJob(false);
        /*  if (err.response.status === 404) {
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
        }*/
      });
  }, [favoritUpdated]);

  console.log(expandedJob);

  // <------------------------- add jobb to favorit ------------------------->;
  const handleAddJobToFavoirt = (e) => {
    if (!e.target.id) {
      return;
    }
    e.preventDefault();

    const data = {
      data: {
        headline: expandedJob[0].headline,
        employer: expandedJob[0].employer.name,
        jobID: expandedJob[0].id,
        occupation: expandedJob[0].occupation.label,
        municipality: expandedJob[0].workplace_address.municipality,
        application_deadline: expandedJob[0].application_deadline,
        occupationGroup: expandedJob[0].occupation_group.legacy_ams_taxonomy_id,
        userID: [user.id],
      },
    };
    useAddJobFavorit(`${BACKEND_URI}/api/jobs/addJobToFavorite`, auth, data);
    setShowExpandedJob(false);
  };

  const handleAddJobToMyParticipants = (e) => {
    setShowParticipantsList(true);
    setShowAdditionalButtons(true);
  };

  return (
    <main
      className={`-top-15 absolute h-full min-h-screen w-full overflow-y-auto bg-white`}
    >
      {/*  {Object.keys(expandedJob).length === 0 && <div>somthing failed</div>} */}
      {expandedJob.map((job) => (
        <div
          key={job.id}
          className=" ] relative mx-auto grid w-auto grid-cols-1 gap-3 space-y-3 rounded-md bg-white p-5 shadow-xl"
        >
          <section className="grid grid-cols-1 gap-2 sm:flex sm:flex-row">
            <p className="flex">
              <ArrowLeftIcon
                className="h-6 w-6 text-blue-600 duration-200 hover:scale-125 hover:cursor-pointer"
                onClick={() => {
                  setShowExpandedJob(false);
                  setShowAddToFavorite(false);
                }}
              />
              Tillbaka
            </p>
            <div className="mx-auto flex h-fit space-x-3 bg-pink-400 p-4 text-white">
              <SpeakerphoneIcon className="h-6 w-6" />
              <h1 className="">{job.occupation.label}</h1>
            </div>
            <div>
              <img src={job.logo_url} alt="log" width={100} className=""></img>
            </div>
          </section>
          <div className="mx-auto flex space-x-4 text-white">
            <a
              href={job.application_details.url}
              target="_blank"
              className="  flex rounded-md bg-cyan-500  px-4 py-2 shadow-xl duration-300 hover:bg-cyan-600"
            >
              <ExternalLinkIcon
                className="h-6 w-6"
                href={job.application_details.url}
              />
              Ansök nu!
            </a>
            {showAddToFavorite && (
              <span
                id={job.id}
                className=" flex rounded-md bg-yellow-400 px-4 py-2 shadow-xl duration-300 hover:cursor-pointer hover:bg-yellow-500"
                onClick={handleAddJobToFavoirt}
              >
                <StarIcon className="h-6 w-6" />
                Lägg till i mina jobb
              </span>
            )}
            {user.username === "Coach1" && (
              <span
                id={job.id}
                className="  flex rounded-md bg-indigo-600 px-4 py-2 shadow-xl duration-300 hover:cursor-pointer hover:bg-indigo-400"
                onClick={handleAddJobToMyParticipants}
              >
                <UserGroupIcon className="h-6 w-6" />
                Lägg till mina deltagare
              </span>
            )}
          </div>
          <section className="grid grid-cols-1 gap-2 rounded-lg  p-4 md:grid-cols-3">
            <p className="flex">
              <LocationMarkerIcon className="mr-2 h-6 w-6" />
              {job.workplace_address.municipality},
              {job.workplace_address.country}
            </p>
            <p className=" flex">
              <OfficeBuildingIcon className="mr-2 h-6 w-6" />
              {job.employer.name}
            </p>
            <p className=" flex w-fit rounded-md">
              <CogIcon className="mr-2 h-6 w-6" />
              {job.occupation.label}
            </p>
            <p className=" flex">
              <ClockIcon className="mr-2 h-6 w-6" />
              {job.working_hours_type.label}
            </p>
            <p className=" flex">
              <RefreshIcon className="mr-2 h-6 w-6" />
              {job.duration.label}
            </p>

            <p className=" flex">
              <DeviceMobileIcon className="mr-2 h-6 w-6" />
              {job.application_contacts.name === null
                ? job.application_contacts.description
                : " "}
              {job.application_contacts.telephone === null
                ? job.application_contacts.email
                : " "}
            </p>
            <p className="w-fit rounded-md bg-green-600 px-2 py-1 text-white">
              <span className="flex">
                <CalendarIcon className="mr-2 h-6 w-6" />
                Puplicerad
              </span>
              {job.publication_date.substring(0, 10)}
            </p>
            <p className="w-fit rounded-md bg-red-600 px-2 py-1 text-white">
              <span className="flex ">
                <CalendarIcon className="mr-2 h-6 w-6" />
                Sista ansökningsdatum
              </span>
              {job.application_deadline.substring(0, 10)}
            </p>
            <p className="flex">
              <IdentificationIcon className="mr-2 h-6 w-6" />
              <span>Annons ID</span>
              {job.id}
            </p>
            {job.driving_license_required && (
              <p className="mt-1 w-fit rounded-lg bg-orange-500 px-2 py-1 text-white">
                <GiSteeringWheel className="animate-wiggle mr-2 inline-block h-6 w-6" />
                körkort
                <ul className="ml-5 list-inside list-disc">
                  {job.driving_license.map((license) => (
                    <li key={license.concept_id}>{license.label}</li>
                  ))}
                </ul>
              </p>
            )}
          </section>
          <div className="whitespace-pre-wrap rounded-md bg-indigo-500 p-5 text-white shadow-md">
            <p className="">{job.description.text}</p>
          </div>
        </div>
      ))}
      {showParticipantsList && (
        <MyParticipants
          user={user}
          auth={auth}
          setShowAdditionalButtons={setShowAdditionalButtons}
          showAdditionalButtons={showAdditionalButtons}
          setShowParticipantsList={setShowParticipantsList}
          expandedJobId={expandedJobId}
        />
      )}
    </main>
  );
};

export default ExpandedJob;
