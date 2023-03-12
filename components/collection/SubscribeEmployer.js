import React, { useState } from "react";

import { XIcon } from "@heroicons/react/outline";
import { BACKEND_URI, JOB_API_EMPLOYER, JOB_API_KEY } from "/config";
import axios from "axios";

const SubscribeEmployer = ({
  setShowSubcribe,
  user,
  auth,
  employersUpdated,
  setEmployersUpdated,
}) => {
  const [employersName, setEmployersName] = useState("");

  const handleCreateSubscribe = () => {
    axios(`${BACKEND_URI}/api/subscription-employers`, {
      method: "POST",
      data: {
        data: {
          employer: employersName,
          user: user.id,
        },
      },
      headers: { Authorization: auth },
    })
      .then((res) => {
        let subscriptionId;
        if (res.data) {
          subscriptionId = res.data.id;
          axios
            .get(`${JOB_API_EMPLOYER}${employersName}&limit=1`, {
              headers: {
                "api-key": JOB_API_KEY,
              },
            })
            .then((res) => {
              if (res.data.hits.length === 0) return;
              const employersLogo = res.data.hits[0].logo_url;
              axios(
                `${BACKEND_URI}/api/subscription-employers/${subscriptionId}`,
                {
                  method: "put",
                  data: { data: { logo_url: employersLogo } },
                  headers: { Authorization: auth },
                }
              );
              setTimeout(() => {
                setEmployersUpdated(!employersUpdated);
              }, 1000);
            });
        }
      })
      .catch((err) => setEmployersUpdated(!employersUpdated));
    setShowSubcribe(false);
  };

  return (
    <main className="absolute top-0 h-full w-full bg-white/30 backdrop-blur-sm  ">
      <div className="relative top-5 mx-auto mt-10 h-[30vh] w-[60vw]  rounded-xl border border-indigo-500 bg-white p-5  ">
        <XIcon
          className="absolute -top-4 right-0 m-5 h-6 w-6 text-red-500 duration-300 hover:scale-125 hover:cursor-pointer"
          onClick={() => {
            setShowSubcribe(false);
            setEmployersName("");
          }}
        />
        <h1 className="m-2 font-bold text-red-600">
          Skriv endast en arbestgivare utan mellanslag
        </h1>
        <div className=" mt-8 flex flex-row rounded-full bg-indigo-400 p-2">
          <input
            type="text"
            placeholder="Skriv arbetsgivarensnamn här..."
            className="space w-full bg-indigo-400 px-2 py-2 text-white outline-none placeholder:text-white "
            value={employersName}
            onChange={(e) => setEmployersName(e.target.value.toLowerCase())}
          ></input>
          <button
            className="flex rounded-full bg-white px-5 py-1 text-lg text-indigo-600"
            onClick={handleCreateSubscribe}
          >
            skapa
          </button>
        </div>
      </div>
    </main>
  );
};

export default SubscribeEmployer;
