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
import axios from "axios";
import { useEffect, useState } from "react";
import { IoCalendarClearOutline } from "react-icons/io5";
import { BACKEND_URI, JOB_API_JOBYID, JOB_API_KEY } from "/config";
import MyParticipants from "../coach/MyParticipants";

const ExpandedJobCoach = ({
  setShowExpandedJob,

  auth,
  user,
  expandedJobId,
  setShowAdditionalButtons,
  showAdditionalButtons,
  //setShowParticipantsList,
}) => {
  const [expandedJob, setExpandedJob] = useState([]);
  const [showParticipantsList, setShowParticipantsList] = useState(false);

  useEffect(() => {
    axios(`${BACKEND_URI}/api/jobs/${expandedJobId}`, {
      method: "GET",
      headers: { Authorization: auth },
    }).then((res) => {
      setExpandedJob((expandedJob = [res.data.data]));
    });
  }, []);

  const handleAddJobToMyParticipants = (e) => {
    setShowParticipantsList(true);
    setShowAdditionalButtons(true);
  };

  return (
    <main
      className={`absolute -top-0 h-full min-h-screen w-full overflow-y-auto bg-white bg-opacity-50`}
    >
      {Object.keys(expandedJob).length === 0 && <div>somthing failed</div>}
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
                }}
              />
              Tillbaka
            </p>
            <div className="mx-auto flex h-fit space-x-3 bg-pink-400 p-4 text-white">
              <SpeakerphoneIcon className="h-6 w-6" />
              {job.attributes.headline}
            </div>
          </section>
          <div className="mx-auto flex space-x-4 text-white">
            <a
              href={job.attributes.url}
              target="_blank"
              className="  flex rounded-md bg-cyan-500  px-4 py-2 shadow-xl duration-300 hover:bg-cyan-600"
            >
              <ExternalLinkIcon className="h-6 w-6" href={job.attributes.url} />
              Ansök nu!
            </a>
            <a
              id={job.id}
              className=" flex rounded-md bg-indigo-600 px-4 py-2 shadow-xl duration-300 hover:cursor-pointer hover:bg-indigo-400"
              onClick={handleAddJobToMyParticipants}
            >
              <UserGroupIcon className="mr-2 h-6 w-6" />
              Lägg till jobbet till mina deltagare
            </a>
          </div>
          <section className="grid grid-cols-1 gap-2 rounded-lg  p-4 md:grid-cols-3">
            <p className="flex">
              <LocationMarkerIcon className="h-6 w-6" />
              {job.attributes.municipality},
            </p>
            <p className=" flex">
              <OfficeBuildingIcon className="h-6 w-6" />
              {job.attributes.employer}
            </p>
            <p className="flex">
              <IdentificationIcon className="h-6 w-6" />
              <a>Annons ID</a>
              {job.id}
            </p>
          </section>
          <div className="whitespace-pre-wrap rounded-md bg-indigo-500 p-5 text-white shadow-md">
            <p>{job.attributes.description}</p>
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

export default ExpandedJobCoach;
