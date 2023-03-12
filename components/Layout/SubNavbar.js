import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/outline";

const SubNavbar = ({ showWindow, compTitle }) => {
  return (
    <div className="flex w-full  bg-indigo-50">
      <button
        className="text-indigo-500 underline"
        onClick={() => showWindow(false)}
      >
        <ArrowLeftIcon
          className="inline-block h-4 w-4  hover:cursor-pointer"
          onClick={() => showWindow(false)}
        />
        Tillbaka
      </button>
      <h1 className="mx-auto text-center font-bold">{compTitle}</h1>
    </div>
  );
};

export default SubNavbar;
