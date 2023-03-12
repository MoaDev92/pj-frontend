import {
  PaperAirplaneIcon,
  SearchIcon,
  UserCircleIcon,
  UserIcon,
  XIcon,
} from "@heroicons/react/solid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_URI, JOB_API_JOBYID, JOB_API_KEY } from "../../config";
import CV from "../CV/CV";
//import ErrorWarning from "./ErrorWarning";
import ViewParticipant from "../participant/ViewParticipant";
import JobApplications from "../jobApplications/JobApplications";
import ToDo from "../ToDo/ToDo";

const MyParticipants = ({
  user,
  auth,
  setShowAdditionalButtons,
  showAdditionalButtons,
  setShowParticipantsList,
  expandedJobId,
}) => {
  const [participants, setParticipants] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [searchedUser, setSearchedUser] = useState("");
  const [showParticipant, setShowParticipant] = useState(false);
  const [choosenPaticipantId, setChoosenPaticipantId] = useState(null);
  const [showParticipantCVList, setShowParticipantCVList] = useState(false);
  const [showParticipantJobApplication, setShowParticipantJobApplication] =
    useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showParticipantToDo, setShowParticipantToDo] = useState(false);

  useEffect(() => {
    axios
      .get(`${BACKEND_URI}/api/users?filters[coach][id][$eq]=${user.id}`, {
        headers: { Authorization: auth },
      })
      .then((res) => {
        const { data } = res;
        const newArr = data.map((p) => (p = { ...p, isSelected: false }));
        setParticipants(newArr);
      })
      .catch((err) => console.log(err));
  }, [searchedUser]);

  const handleSearchParticipants = (e) => {
    /* if ((e.target.value = "")) {
      setParticipants(participants);
    } */

    /* var input = document.getElementById("myInput");

   // Execute a function when the user releases a key on the keyboard
   input.addEventListener("keyup", function (event) {
     // Number 13 is the "Enter" key on the keyboard
     if (event.ke === 13) {
       // Cancel the default action, if needed
       event.preventDefault();
       // Trigger the button element with a click
       document.getElementById("myBtn").click();
     }
   });
     */

    //setParticipants(existingsParticpants);
    //const searchedUser = e.target.value;

    //setSearchResult(participants);
    participants.forEach((participant) => {
      if (
        participant.username.toLowerCase().includes(searchedUser.toLowerCase())
      ) {
        setParticipants([
          {
            id: participant.id,
            username: participant.username,
            email: participant.email,
          },
        ]);
      } else {
        setParticipants([]);
      }
    });
  };

  const handleSelectParticipant = (e) => {
    const index = e.target.value;
    const participantId = e.currentTarget.id;

    const selectedParticipant = participants.find(
      (p) => parseInt(p.id) === parseInt(participantId)
    );
    selectedParticipant.isSelected = !selectedParticipant.isSelected;

    const newParticipants = participants.filter(
      (p) => parseInt(p.id) !== parseInt(participantId)
    );
    newParticipants.splice(index, 0, selectedParticipant);
    setParticipants(newParticipants);
  };

  const handleSelectAllParticipants = (e) => {
    setAllChecked(!allChecked);
    let newParticipants = [];
    participants.forEach((p) => {
      p.isSelected = !p.isSelected;
      newParticipants.push(p);
    });

    setParticipants(newParticipants);
  };

  const handleAddJobToParticipants = () => {
    setShowLoading(true);
    let selectedParticipantsId = [];
    participants.forEach((p) => {
      if (p.isSelected === true) selectedParticipantsId.push({ id: p.id });
    });
    //return console.log(selectedParticipantsId);

    axios
      .get(`${JOB_API_JOBYID}/${expandedJobId}`, {
        headers: {
          "api-key": JOB_API_KEY,
        },
      })
      .then((res) => {
        const { data: job } = res;
        axios(`${BACKEND_URI}/api/jobs/addJobToFavorite`, {
          method: "POST",
          headers: { Authorization: auth },
          data: {
            data: {
              headline: job.headline,
              employer: job.employer.name,
              jobID: job.id,
              occupation: job.occupation.label,
              municipality: job.workplace_address.municipality,
              application_deadline: job.application_deadline,
              occupationGroup: job.occupation_group.legacy_ams_taxonomy_id,
              userID: selectedParticipantsId,
            },
          },
          headers: { Authorization: auth },
        });
      })
      .then((res) => {
        setShowParticipantsList(false);
        setShowLoading(false);
      })
      .catch((err) => {
        axios(`${BACKEND_URI}/api/jobs/${expandedJobId}`, {
          method: "PUT",
          headers: { Authorization: auth },
          data: {
            data: {
              users: selectedParticipantsId,
            },
          },
          headers: { Authorization: auth },
        });
        setShowParticipantsList(false);
        setShowLoading(false);
      });
  };

  return (
    <>
      {!showParticipantCVList &&
        !showParticipantJobApplication &&
        !showParticipantToDo && (
          <main className="absolute top-0 h-full w-full bg-white">
            <header className="flex flex-row">
              <h1 className="m-2 text-3xl">
                Mina deltagare{" "}
                <span className="block text-sm">
                  {participants.length} deltagare
                </span>
              </h1>
              {showAdditionalButtons && (
                <div className="ml-auto flex">
                  <button
                    className="ml-auto mr-2 mt-2 flex h-10 rounded-lg bg-indigo-600 px-4 py-2 text-white"
                    onClick={handleAddJobToParticipants}
                  >
                    Lägga till jobbet
                    <PaperAirplaneIcon className="ml-2 h-5 w-5 rotate-90" />
                  </button>
                  <XIcon
                    className="m-2 h-8 w-8 text-red-500 duration-300 hover:scale-125 hover:cursor-pointer"
                    onClick={() => setShowParticipantsList(false)}
                  />
                </div>
              )}
            </header>
            <div className=" m2 m-2 flex shrink rounded-lg border p-2 shadow-indigo-100">
              <SearchIcon className="h-8 w-8 text-gray-300" />
              <input
                type="text"
                className="w-full px-2 py-1 outline-none placeholder:text-gray-300"
                placeholder="Sök deltagare"
                onChange={(e) => setSearchedUser(e.target.value)}
              ></input>
              <button
                id="search"
                className="rounded-md bg-indigo-400 px-2 py-1 text-white"
                onClick={handleSearchParticipants}
              >
                Sök
              </button>
              {showLoading && (
                <iframe
                  src="https://embed.lottiefiles.com/animation/9844"
                  className="absolute left-0 -top-20 h-full w-full bg-white"
                ></iframe>
              )}
            </div>

            <div className="m-2 grid grid-cols-1 divide-y-2 rounded-lg bg-gray-50 p-10">
              <div className="flex p-4">
                {showAdditionalButtons && (
                  <input
                    type="checkbox"
                    className="h-10"
                    checked={allChecked}
                    onChange={handleSelectAllParticipants}
                  ></input>
                )}
                <h4 className="ml-5">ID</h4>
                <h4 className="ml-14">NAMN</h4>

                <h4 className="ml-52">ANSTÄLLNINGSSTÖD</h4>
                <h4 className="ml-10">YRKEN</h4>
              </div>
              {participants.map((participant, index) => (
                <div
                  key={participant.id}
                  className="flex min-w-fit flex-row bg-white p-4 text-blue-700 shadow-md"
                >
                  {showAdditionalButtons && (
                    <input
                      type="checkbox"
                      className="h-10"
                      checked={participant.isSelected}
                      //id={participant.id}
                      id={participant.id}
                      value={index}
                      onChange={handleSelectParticipant}
                    ></input>
                  )}
                  <p className="ml-5 mr-5 mt-2 text-gray-500">
                    {participant.id}{" "}
                  </p>
                  <UserCircleIcon
                    className="h-10 w-10 rounded-full bg-indigo-100 p-2 hover:cursor-pointer "
                    id={participant.id}
                    onClick={(e) => {
                      setChoosenPaticipantId({ id: e.currentTarget.id });
                      setShowParticipant(true);
                    }}
                  />
                  <div className="ml-4 text-left">
                    <p className="">{participant.username}</p>
                    <p className="text-indigo-300">{participant.email}</p>
                  </div>
                </div>
              ))}
            </div>

            {/*  <ErrorWarning /> */}
          </main>
        )}
      {showParticipant && (
        <ViewParticipant
          setShowParticipant={setShowParticipant}
          choosenPaticipantId={choosenPaticipantId}
          setShowParticipantCVList={setShowParticipantCVList}
          setShowParticipantJobApplication={setShowParticipantJobApplication}
          setShowAdditionalButtons={setShowAdditionalButtons}
          showAdditionalButtons={showAdditionalButtons}
          setShowParticipantToDo={setShowParticipantToDo}
          auth={auth}
        />
      )}
      {showParticipantCVList && (
        <CV
          user={choosenPaticipantId}
          auth={auth}
          setShowAdditionalButtons={setShowAdditionalButtons}
          showAdditionalButtons={showAdditionalButtons}
          setShowParticipantCVList={setShowParticipantCVList}
        />
      )}
      {showParticipantJobApplication && (
        <JobApplications
          user={choosenPaticipantId}
          auth={auth}
          coach={user}
          setShowAdditionalButtons={setShowAdditionalButtons}
          showAdditionalButtons={showAdditionalButtons}
          setShowParticipantJobApplication={setShowParticipantJobApplication}
        />
      )}
      {showParticipantToDo && (
        <ToDo
          user={choosenPaticipantId}
          auth={auth}
          coach={user}
          setShowAdditionalButtons={setShowAdditionalButtons}
          showAdditionalButtons={showAdditionalButtons}
          setShowParticipantToDo={setShowParticipantToDo}
        />
      )}
    </>
  );
};

export default MyParticipants;
