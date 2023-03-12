import React from "react";
import { XIcon, PaperAirplaneIcon } from "@heroicons/react/outline";
import { InformationCircleIcon } from "@heroicons/react/solid";
import axios from "axios";
import { BACKEND_URI } from "../config";

const AddToApplicationWarning = ({
  jobToApplicationId,
  auth,
  user,
  setFavoritUpdated,
  favoritUpdated,
  setShowAddToApplicationWarning,
}) => {
  const handleAddJobToApplications = (e) => {
    axios(`${BACKEND_URI}/api/applications/addJobToapplications`, {
      method: "POST",
      data: { jobDBId: jobToApplicationId, userID: user.id },
      headers: {
        Authorization: auth,
      },
    })
      .then((res) => setFavoritUpdated(!favoritUpdated))
      .catch((err) => console.log(err));

    setShowAddToApplicationWarning(false);
  };

  return (
    <main className="absolute bg-gray-100 bg-opacity-50 w-[100vw] h-[100vh] flex ">
      <div className="bg-white border-2 border-yellow-500 relative rounded-xl space-y-4 mx-auto my-36 h-[200px] w-[300px] shadow-2xl ">
        <h1 className="bg-yellow-500 text-white p-2 w-full text-center rounded-t-md">
          Har du skicakt ansökan om detta job? Lycka till! 😊
        </h1>
        <InformationCircleIcon className="w-8 h-8 absolute text-yellow-500 -top-12 left-[45%] " />

        <section className=" flex "></section>
        <h1 className="px-4">{jobToApplicationId}</h1>
        <div className="flex space-x-4  justify-center text-white">
          <a
            className="  flex px-4 py-2  bg-cyan-500 rounded-md shadow-xl hover:bg-cyan-600 duration-300 cursor-pointer"
            onClick={() => {
              setShowAddToApplicationWarning(false);
            }}
          >
            Avbryt
            <XIcon
              className="w-6 h-6 cursor-pointer"
              onClick={() => {
                setShowAddToApplicationWarning(false);
              }}
            />
          </a>
          <a
            className="  flex px-4 py-2  bg-blue-900 rounded-md shadow-xl hover:bg-blue-300 duration-300 cursor-pointer"
            id={jobToApplicationId}
            onClick={handleAddJobToApplications}
          >
            Ja
            <PaperAirplaneIcon
              className="w-6 h-6 cursor-pointer rotate-45 ml-2"
              id={jobToApplicationId}
            />
          </a>
        </div>
      </div>
    </main>
  );
};

export default AddToApplicationWarning;
