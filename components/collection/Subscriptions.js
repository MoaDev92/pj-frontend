import { ArrowsExpandIcon, TrashIcon, XIcon } from "@heroicons/react/outline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_URI } from "../../config";

export const Subscriptions = ({
  user,
  auth,
  employersUpdated,
  setEmployersUpdated,
  showJobsWindow,
  setShowJobsWindow,
  handleChooseJobs,
  setChoosedOption,
}) => {
  const [employers, setEmployers] = useState([]);

  const handleDeleteSubscription = (e) => {
    const subscriptionId = e.currentTarget.id;
    axios(`${BACKEND_URI}/api/subscription-employers/`, {
      method: "put",
      data: { data: { subscriptionId, userId: user.id } },
      headers: { Authorization: auth },
    }).then((res) => {
      setEmployersUpdated(!employersUpdated);
    });
  };

  useEffect(() => {
    axios
      .get(
        `${BACKEND_URI}/api/subscription-employers?filters[users][id][$eq]=${user.id}`,
        {
          headers: { Authorization: auth },
        }
      )
      .then((res) => {
        setEmployers((employers = res.data.data));
        console.log(employers);
      });
  }, [employersUpdated]);
  return (
    <>
      <div className="h-auto w-full ">
        <h1 className="mt-2 block p-2  text-center text-indigo-500 underline decoration-yellow-400 md:text-3xl">
          Prenumerationer{" "}
          <span className="inline-block rounded-full bg-indigo-500 px-2 text-sm text-white">
            {employers.length}
          </span>
        </h1>

        {employers.length === 0 && (
          <h1 className="font-Pacifico mx-auto mt-10 flex w-full justify-center border border-dashed border-indigo-600 bg-gray-100 p-20 text-center text-3xl text-yellow-400">
            Du har inga prenumerationer
          </h1>
        )}
      </div>
      <div className="grid  w-full grid-cols-1 gap-3 p-5 ">
        {employers.map((employer) => (
          <div
            key={employer.id}
            className="relative flex h-32 place-items-center justify-center rounded-md bg-white p-2"
          >
            <img
              className="w-24"
              src={employer.attributes.logo_url}
              alt={employer.attributes.employer}
              id="subscription"
              value={employer.attributes.employer}
            ></img>
            <div className="absolute top-0 right-0 flex space-x-2">
              <TrashIcon
                className="h-5 w-5 cursor-pointer duration-300 hover:scale-105"
                className="h-5 w-5 text-red-600 duration-300 hover:scale-125 hover:cursor-pointer"
                id={employer.id}
                onClick={handleDeleteSubscription}
              />
              <ArrowsExpandIcon
                className="h-5 w-5 cursor-pointer duration-300 hover:scale-125"
                id={{
                  typeOfJobs: "subscription",
                  filterQuery: employer.attributes.employer,
                }}
                onClick={() => {
                  setShowJobsWindow(true);
                  setChoosedOption({
                    typeOfJobs: "subscription",
                    filterQuery: employer.attributes.employer,
                  });
                }}
              />
            </div>
          </div>
          /*  <div
            className="relative "
            key={employer.id}
          >
            <div
              className="flex  h-32 place-items-center justify-center rounded-2xl border shadow-xl shadow-indigo-100 duration-300 hover:scale-105 hover:cursor-pointer"
            >
              <img
                className="w-16 "
                src={employer.attributes.logo_url}
                alt={employer.attributes.employer}
              ></img>
            </div>
            <button
              className="bg-pink-500"
              key={employer.id}
              id="subscription"
              value={employer.attributes.employer}
              onClick={handleChooseJobs}
            ></button>
            <XIcon
              className="absolute -top-3 left-[92%] h-6 w-6 text-red-600 duration-300 hover:scale-125 hover:cursor-pointer"
              id={employer.id}
              onClick={handleDeleteSubscription}
            />
          </div> */
        ))}
      </div>
    </>
  );
};
