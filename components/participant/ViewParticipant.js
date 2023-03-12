import {
  ArrowNarrowRightIcon,
  BriefcaseIcon,
  DocumentDuplicateIcon,
  PaperAirplaneIcon,
  XIcon,
} from "@heroicons/react/solid";
import React, { useState } from "react";

const ViewParticipant = ({
  setShowParticipant,
  setShowParticipantCVList,
  setShowParticipantJobApplication,
  setShowAdditionalButtons,
  setShowParticipantToDo,
}) => {
  return (
    <main className="absolute top-0 flex h-full w-full place-content-center place-items-center   backdrop-blur-sm">
      <div className="relative flex h-fit w-[80%] place-items-center gap-5 rounded-xl bg-gray-100 p-10 shadow-xl">
        <XIcon
          className="absolute -top-2 left-[95%] m-5 h-6 w-6 cursor-pointer text-red-600 duration-300 hover:scale-125"
          onClick={() => setShowParticipant(false)}
        />
        {/* <button
          className={`group bg-white rounded-lg text-left space-y-3  p-5 hover:scale-105 duration-500 hover:bg-indigo-600 h-3/6 w-2/5`}
        >
          <BriefcaseIcon className="w-10 h-10 bg-indigo-100 text-indigo-400 rounded-lg p-2 inline-block mr-2 " />
          <span className="font-bold text-indigo-700 group-hover:text-white">
            Jobb
          </span>
          <span className="text-sm text-gray-400 block group-hover:text-white">
            Se jobb som deltagaren lagt i favorit
          </span>
          <ArrowNarrowRightIcon className="w-6 h-6 ml-auto text-indigo-700 group-hover:text-white" />
        </button> */}

        <button
          className={`group h-[200px] w-2/5 space-y-3 rounded-lg  bg-white p-5 text-left duration-300 hover:scale-105 hover:bg-orange-600`}
          onClick={() => {
            setShowAdditionalButtons(true);
            setShowParticipantJobApplication(true);
            setShowParticipant(false);
          }}
        >
          <PaperAirplaneIcon className="mr-2 inline-block h-10 w-10 rounded-lg bg-orange-100 p-2 text-orange-400 " />
          <span className="font-bold text-orange-700 group-hover:text-white">
            Jobbansökningar
          </span>
          <span className="block text-sm text-gray-400 group-hover:text-white">
            Se deltagarens sökta jobb
          </span>
          <ArrowNarrowRightIcon className="ml-auto h-6 w-6 text-orange-700 group-hover:text-white" />
        </button>
        <button
          className={`group h-[200px] w-2/5 space-y-3 rounded-lg  bg-white p-5 text-left duration-300 hover:scale-105 hover:bg-cyan-600`}
          onClick={() => {
            setShowAdditionalButtons(true);
            setShowParticipantCVList(true);
            setShowParticipant(false);
          }}
        >
          <DocumentDuplicateIcon className="mr-2 inline-block h-10 w-10 rounded-lg bg-cyan-100 p-2 text-cyan-400 " />
          <span className="font-bold text-cyan-700 group-hover:text-white">
            CV
          </span>
          <span className="block text-sm text-gray-400 group-hover:text-white">
            Se deltagarens cv
          </span>
          <ArrowNarrowRightIcon className="ml-auto h-6 w-6 text-cyan-700 group-hover:text-white" />
        </button>
        <button
          className={`group h-[200px] w-2/5 space-y-3 rounded-lg  bg-white p-5 text-left duration-100 hover:scale-105 hover:bg-pink-600`}
          onClick={() => {
            setShowAdditionalButtons(true);
            setShowParticipantToDo(true);
            setShowParticipant(false);
          }}
        >
          <DocumentDuplicateIcon className="mr-2 inline-block h-10 w-10 rounded-lg bg-pink-100 p-2 text-pink-400 " />
          <span className="font-bold text-pink-700 group-hover:text-white">
            Att göra
          </span>
          <span className="block text-sm text-gray-400 group-hover:text-white">
            Se deltagarens Att göra lista
          </span>
          <ArrowNarrowRightIcon className="ml-auto h-6 w-6 text-pink-700 group-hover:text-white" />
        </button>
      </div>
    </main>
  );
};

export default ViewParticipant;
