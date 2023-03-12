import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_URI } from "../../config";
import { useAddJobFavorit } from "../../hooks/useAddJobFavorit";

const CreateJob = ({ auth, user, setShowCreateJob }) => {
  const [job, setJob] = useState({});

  const handleCreateJob = () => {
    const data = {
      data: { ...job, created_of_user: user.id },
    };

    axios(`${BACKEND_URI}/api/jobs`, {
      method: "POST",
      data: data,
      headers: { Authorization: auth },
    }).then((res) => {
      console.log(res);
      setShowCreateJob(false);
    });
  };

  return (
    <main className="absolute top-0 left-0 h-full w-full bg-white">
      <h1 className="m-4 text-center text-3xl text-gray-400">Skapa jobb</h1>
      <div className="mx-auto  max-w-3xl rounded-lg bg-indigo-300 p-5 ">
        <label className="text-indigo-600">Rubrik</label>
        <input
          type="text"
          className="mb-4 block w-full rounded-lg p-1 px-2 outline-none"
          onChange={(e) =>
            setJob((pre) => ({ ...pre, headline: e.target.value }))
          }
        ></input>
        <label className="text-indigo-600">Jobbeskrivning</label>
        <textarea
          type="text"
          className="mb-4 block max-h-32 w-full rounded-lg bg-gray-100 p-1 px-2 outline-none"
          onChange={(e) =>
            setJob((pre) => ({ ...pre, description: e.target.value }))
          }
        ></textarea>
        <label className="text-indigo-600">Ort</label>
        <input
          type="text"
          className="mb-4 block w-full rounded-lg p-1 px-2 outline-none"
          onChange={(e) =>
            setJob((pre) => ({ ...pre, municipality: e.target.value }))
          }
        ></input>
        <label className="text-indigo-600">Arbetsgivare</label>
        <input
          type="text"
          className="mb-4 block w-full rounded-lg p-1 px-2 outline-none"
          onChange={(e) =>
            setJob((pre) => ({ ...pre, employer: e.target.value }))
          }
        ></input>
        <label className="text-indigo-600">Länk</label>
        <input
          type="text"
          className="block w-full rounded-lg p-1 px-2 outline-none"
          onChange={(e) => setJob((pre) => ({ ...pre, url: e.target.value }))}
        ></input>
        <button
          onClick={handleCreateJob}
          className=" float-right m-2 mt-10 rounded bg-indigo-600 px-2 py-1 text-white"
        >
          Skapa
        </button>
      </div>
    </main>
  );
};

export default CreateJob;
