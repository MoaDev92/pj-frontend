import React from "react";
import { XIcon, TrashIcon } from "@heroicons/react/outline";
import { ExclamationIcon } from "@heroicons/react/solid";
import axios from "axios";
import { BACKEND_URI } from "../config";

const DeleteWarning = ({
  deletedJobId,
  auth,
  user,
  setFavoritUpdated,
  favoritUpdated,
  setShowDeleteWarning,
}) => {
  const handleDeleteJob = (e) => {
    axios(`${BACKEND_URI}/api/jobs/deleteJobFromFavorite`, {
      method: "PUT",
      data: { jobDBId: deletedJobId, userID: user.id },
      headers: {
        Authorization: auth,
      },
    })
      .then((res) => setFavoritUpdated(!favoritUpdated))
      .catch((err) => console.log(err));

    setShowDeleteWarning(false);
  };

  return (
    <main className="absolute bg-gray-100 bg-opacity-50 w-[100vw] h-[100vh] flex ">
      <div className="bg-white border-2 border-red-600 relative rounded-xl space-y-4 mx-auto my-36 h-[200px] shadow-2xl ">
        <h1 className="bg-red-600 text-white p-2 w-full text-center rounded-t-md">
          Är du säker att du vill radera?😥
        </h1>
        <ExclamationIcon className="w-8 h-8 absolute text-red-600 -top-12 left-[45%] " />

        <section className=" flex "></section>
        <h1 className="px-4">{deletedJobId}</h1>
        <div className="flex space-x-4  justify-center text-white">
          <a
            className="  flex px-4 py-2  bg-cyan-500 rounded-md shadow-xl hover:bg-cyan-600 duration-300 cursor-pointer"
            onClick={() => {
              setShowDeleteWarning(false);
            }}
          >
            Avbryt
            <XIcon
              className="w-6 h-6 cursor-pointer"
              onClick={() => {
                setShowDeleteWarning(false);
              }}
            />
          </a>
          <a
            className="  flex px-4 py-2  bg-red-600 rounded-md shadow-xl hover:bg-red-300 duration-300 cursor-pointer"
            id={deletedJobId}
            onClick={handleDeleteJob}
          >
            Radera
            <TrashIcon className="w-6 h-6 cursor-pointer" id={deletedJobId} />
          </a>
        </div>
      </div>
    </main>
  );
};

export default DeleteWarning;
