import {
  ArchiveIcon,
  PencilAltIcon,
  ArrowNarrowLeftIcon,
} from "@heroicons/react/outline";
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { BACKEND_URI } from "../../config";
import ApplicationsArchive from "./ApplicationsArchive";
import ExpandedApplication from "./ExpandedApplication";

const JobApplications = ({
  //myApplications,
  coach,
  user,
  auth,
  showArchive,
  setShowArchive,
  showAdditionalButtons,
  setShowAdditionalButtons,
  setShowParticipantJobApplication,
}) => {
  const [sentApplications, setSentApplications] = useState([]);
  const [interviewApplications, setInterviewApplications] = useState([]);
  const [hiredApplications, setHiredApplications] = useState([]);
  const [dropped, setDropped] = useState(false);
  const [windowOpacity, setWindowOpacity] = useState("");
  const [translateApplicationToArchive, setTanslateApplicationToArchive] =
    useState(0);
  const [expandedApplication, setExpandedApplication] = useState(false);
  const [showExpandApplication, setShowExpandApplication] = useState(false);
  const [showCongrats, setShowCongrats] = useState("hidden");
  const [myApplications, setMyApplications] = useState([]);

  useEffect(async () => {
    const resMyApplications = await axios(
      `${BACKEND_URI}/api/applications?populate=job&filters[user][id][$eq]=${user.id}`,
      {
        method: "GET",
        headers: {
          Authorization: auth,
        },
      }
    );

    setMyApplications((myApplications = await resMyApplications.data.data));

    const sentApplications = myApplications.filter(
      (application) => application.attributes.status === "sent"
    );

    const interviewApplications = myApplications.filter(
      (application) => application.attributes.status === "interview"
    );

    const hiredApplications = myApplications.filter(
      (application) => application.attributes.status === "hired"
    );

    setSentApplications(sentApplications);
    setInterviewApplications(interviewApplications);
    setHiredApplications(hiredApplications);
  }, [dropped]);

  const colStyle =
    "relative bg-gray-200 rounded-md rounded-t-none shadow-xl h-auto  p-3 overflow-x-auto mt-4 ";
  /* let cardStyleSend = ` rounded-lg relative text-white flex flex-col justify-center shadow-md w-42 p-5 h-[200px] mb-5    xl:text-xl bg-gradient-to-r from-[#757F9A] to-[#D7DDE8]`;
  const cardStyleInterview = `${translateApplicationToArchive} duration-300 rounded-lg relative text-white flex flex-col justify-center shadow-md w-42 p-5 h-[200px] mb-5    xl:text-xl bg-gradient-to-r  from-[#1488CC] to-[#2B32B2]`;
  const cardStyleHired = `rounded-lg relative text-white flex flex-col justify-center shadow-md w-42 p-5 h-[200px] mb-5    xl:text-xl  bg-gradient-to-r from-[#00c6ff] to-[#0072ff]`; */

  const handleOnDragEnd = (e) => {
    if (!e.destination || e.source.droppableId === e.destination.droppableId) {
      return;
    }
    setWindowOpacity(" opacity-0");
    let applicationStatus;
    const applicationId = e.draggableId;

    if (e.destination.droppableId === `droppable-sent`) {
      applicationStatus = "sent";
    }
    if (e.destination.droppableId === `droppable-interview`) {
      applicationStatus = "interview";
    }
    if (e.destination.droppableId === `droppable-hired`) {
      applicationStatus = "hired";
      setShowCongrats("");
      setTimeout(() => {
        setShowCongrats("hidden");
      }, 4000);
    }

    axios(`${BACKEND_URI}/api/applications/updateApplicationStatus`, {
      method: "PUT",
      data: {
        applicationId: applicationId,
        status: applicationStatus,
      },
      headers: {
        Authorization: auth,
      },
    })
      .then((res) => {
        myApplications = res.data;
      })
      .catch((err) => console.log(err));

    setDropped(!dropped);

    setTimeout(() => {
      setWindowOpacity(" opacity-100 duration-1000");
    }, 100);
  };

  const handleArchiveApplication = (e) => {
    if (!e.currentTarget.id) return;
    const applicationId = e.currentTarget.id;
    setTanslateApplicationToArchive(
      (translateApplicationToArchive = parseInt(applicationId))
    );

    setTimeout(() => {
      axios(`${BACKEND_URI}/api/applications/updateApplicationStatus`, {
        method: "PUT",
        data: {
          applicationId: applicationId,
          status: "archive",
        },
        headers: {
          Authorization: auth,
        },
      })
        .then((res) => {
          myApplications = res.data;
        })
        .catch((err) => alert(`Somthing went wrong with archive`));

      setDropped(!dropped);
    }, 400);
  };

  const handleExpandedApplication = (e) => {
    e.preventDefault();

    if (!e.currentTarget.id) return;
    const applicationId = e.currentTarget.id;
    /* const application = myApplications.filter(
      (a) => parseInt(a.id) === parseInt(applicationId)
    ); */

    setExpandedApplication(applicationId);

    setShowExpandApplication(true);
  };

  return (
    <main className={` h-full w-full sm:h-[90vh] ${windowOpacity} bg-white `}>
      {showAdditionalButtons && (
        <button
          className="text-blue-500  "
          onClick={() => {
            setShowParticipantJobApplication(false);
            setShowAdditionalButtons(false);
          }}
        >
          <ArrowNarrowLeftIcon className="inline-block h-6 w-6" />
          Tillbaka
        </button>
      )}
      {/* <h1 className=" text-center text-2xl p-3">
        Ha koll på dina jobbansökningar
      </h1> */}
      {/* <section className=" grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-10 px-3 mt-2">
        <div className="relative bg-[#cd7f32] w-full h-full flex place-items-center justify-center rounded-t-md  ">
          <h1 className=" text-white">Skickat</h1>
        </div>

        <div className="relative bg-pink-500 w-full h-full flex place-items-center justify-center rounded-t-md  ">
          <h1 className=" text-white">Kontaktad</h1>
        </div>

        <div className="relative bg-green-600 w-full h-full flex place-items-center justify-center rounded-t-md  ">
          <h1 className=" text-white">Hired</h1>
        </div>
      </section> */}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <section className="relative grid h-full grid-cols-1 gap-1  px-3 sm:grid-cols-3 lg:gap-3  ">
          <Droppable droppableId="droppable-sent" type="APPLICATION">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={colStyle}
              >
                <div className="absolute top-0 left-0 flex h-16 w-full place-items-center justify-center rounded-t-md bg-[#8070db]  ">
                  <h1 className=" text-white">Skickat</h1>
                </div>
                {sentApplications.map((application, index) => (
                  <Draggable
                    key={application.id}
                    draggableId={application.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => {
                      let translate;
                      if (application.id === translateApplicationToArchive) {
                        translate =
                          " translate-x-[120%] opacity-0 duration-1000";
                      }
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          //key={application.id}

                          className={`${translate} w-42 relative top-20 mb-5 flex h-[200px]  flex-col justify-center rounded-lg  bg-[#8070db] p-5 text-white shadow-md  duration-300 xl:text-xl`}
                        >
                          <p className="absolute -top-6 left-[44%] rounded-full bg-white px-2 py-1 text-3xl">
                            👏
                          </p>
                          <div className="absolute top-1 left-0 flex space-x-3  lg:left-[75%] ">
                            <ArchiveIcon
                              className="h-6 w-6   duration-500 hover:scale-150 hover:cursor-pointer"
                              id={application.id}
                              onClick={handleArchiveApplication}
                            />
                            <PencilAltIcon
                              className="h-6 w-6  duration-500 hover:scale-150 hover:cursor-pointer"
                              id={application.id}
                              onClick={handleExpandedApplication}
                            />
                          </div>
                          <p className="mb-2">
                            {/*  <span className="text-sm text-gray-200">
                              Ansökans namn:
                            </span> */}
                            <span className="block text-xl font-bold">
                              {
                                application.attributes.job.data.attributes
                                  .headline
                              }
                            </span>
                          </p>
                          Ansökans ID:
                          {application.attributes.job.data.attributes.jobID}
                          <p>
                            {` Skicakt:
                            ${application.attributes.createdAt.slice(0, 10)}`}
                          </p>
                        </div>
                      );
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="droppable-interview" type="APPLICATION">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={colStyle}
              >
                <div className="absolute top-0 left-0 flex h-16 w-full place-items-center justify-center rounded-t-md bg-pink-500  ">
                  <h1 className=" text-white">Kontaktad</h1>
                </div>
                {interviewApplications.map((application, index) => (
                  <Draggable
                    key={application.id}
                    draggableId={application.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => {
                      let translate;
                      if (application.id === translateApplicationToArchive) {
                        translate =
                          " translate-x-[120%] opacity-0 duration-1000";
                      }
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          //key={application.id}
                          className={`${translate} w-42 relative top-20 mb-5 flex h-[200px] flex-col justify-center rounded-lg   bg-pink-500 bg-gradient-to-r p-5 text-white shadow-md duration-300  xl:text-xl`}
                        >
                          <p className="absolute -top-4 left-[44%] rounded-full bg-white px-2 py-1 text-3xl">
                            🤩
                          </p>
                          <div className="absolute top-1  left-0 flex  space-x-3  lg:left-[75%]">
                            <ArchiveIcon
                              className="h-6 w-6  hover:cursor-pointer "
                              id={application.id}
                              onClick={handleArchiveApplication}
                            />
                            <PencilAltIcon
                              className="h-6 w-6 duration-500 hover:scale-150 hover:cursor-pointer"
                              id={application.id}
                              onClick={handleExpandedApplication}
                            />
                          </div>
                          <p className="text-xl font-bold">
                            {
                              application.attributes.job.data.attributes
                                .headline
                            }
                          </p>
                          Ansökans ID:
                          {application.attributes.job.data.attributes.jobID}
                          <p>
                            {` Skicakt:
                            ${application.attributes.createdAt.slice(0, 10)}`}
                          </p>
                        </div>
                      );
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="droppable-hired" type="APPLICATION">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={colStyle}
              >
                <div className="absolute top-0 left-0 flex h-16 w-full place-items-center justify-center rounded-t-md bg-green-600  ">
                  <h1 className=" text-white">Hired</h1>
                </div>
                {hiredApplications.map((application, index) => (
                  <Draggable
                    key={application.id}
                    draggableId={application.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => {
                      let translate;
                      if (application.id === translateApplicationToArchive) {
                        translate =
                          " translate-x-[120%] opacity-0 duration-1000";
                      }

                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          //key={application.id}
                          className={`${translate} w-42 relative top-20 mb-5 flex h-[200px] flex-col justify-center rounded-lg   bg-green-600 p-5 text-white  shadow-md  duration-300 xl:text-xl`}
                        >
                          <iframe
                            src="https://embed.lottiefiles.com/animation/85744"
                            className={`absolute -top-[200%] h-[1000px] ${showCongrats}`}
                          ></iframe>
                          <p className="absolute -top-5 left-[44%] rounded-full bg-white px-2 py-1 text-3xl">
                            🥳
                          </p>
                          <div className="absolute top-1 left-0 flex min-w-max  space-x-3 lg:left-[75%]">
                            <ArchiveIcon
                              className="h-6 w-6  hover:cursor-pointer "
                              id={application.id}
                              onClick={handleArchiveApplication}
                            />
                            <PencilAltIcon
                              className="h-6 w-6 duration-500 hover:scale-150 hover:cursor-pointer"
                              id={application.id}
                              onClick={handleExpandedApplication}
                            />
                          </div>
                          <p className="text-xl font-bold">
                            {
                              application.attributes.job.data.attributes
                                .headline
                            }
                          </p>
                          Ansökans ID:
                          {application.attributes.job.data.attributes.jobID}
                          <p>
                            {` Skicakt:
                            ${application.attributes.createdAt.slice(0, 10)}`}
                          </p>
                        </div>
                      );
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </section>
      </DragDropContext>
      {showExpandApplication && (
        <ExpandedApplication
          expandedApplicationId={expandedApplication}
          //comments={expandedApplication.attributes.comments}
          setShowExpandApplication={setShowExpandApplication}
          auth={auth}
          user={user}
          coach={coach}
        />
      )}
    </main>
  );
};

export default JobApplications;

/*
  <PaperAirplaneIcon className="absolute -top-4 -left-[2%] rotate-90 w-8 h-8 text-gray-300" />
          <PaperAirplaneIcon className="absolute top-3 left-[97%] rotate-180 w-8 h-8" /> 
           <PaperAirplaneIcon className="absolute -top-4 -left-[2%] rotate-90 w-8 h-8" />
          <PaperAirplaneIcon className="absolute top-3 left-[97%] rotate-180 w-8 h-8" />
           <PaperAirplaneIcon className="absolute top-12 -left-[2%] rotate-90 w-8 h-8" />
          <PaperAirplaneIcon className="absolute top-3 left-[97%] rotate-360 w-8 h-8" />
          */
