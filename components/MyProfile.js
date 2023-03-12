import React, { useCallback, useEffect, useState } from "react";
import { PrinterIcon, UserCircleIcon, CogIcon } from "@heroicons/react/outline";
//import { CogIcon } from "@heroicons/react/solid";
import axios from "axios";
import { BACKEND_URI } from "../config";
import Head from "next/head";

const MyProfile = ({ user, auth, companyInfo }) => {
  const [userOccupations, setUserOccupations] = useState([]);
  const [applicationReport, setApplicationReport] = useState([]);

  useEffect(() => {
    axios(`${BACKEND_URI}/api/occupations?filters[users][id][$eq]=${user.id}`, {
      method: "GET",
      headers: {
        Authorization: auth,
      },
    }).then((res) => {
      setUserOccupations(res.data.data);
    });
  }, []);

  const handleGetReport = useCallback((e) => {
    const date = e.target.value;

    axios(`${BACKEND_URI}/api/applications/report?u=${user.id}&d=${date}`, {
      method: "GET",
      headers: {
        Authorization: auth,
      },
    }).then((res) => {
      setApplicationReport(res.data);
    });
  });

  return (
    <main className="h-[90vh] ">
      <div className=" mx-auto bg-indigo-500 p-5  text-center text-2xl text-white print:hidden ">
        <h1 className="font-FiraSans">
          Välkommen till {companyInfo.name} jobbportal!😊{" "}
        </h1>
      </div>
      <section className="mt-4 grid-cols-1 p-2  sm:grid sm:grid-cols-3">
        <div className="mx-auto grid max-h-[200px] w-[300px] grid-cols-1 print:hidden">
          <div className="relative h-[100px]  rounded-t-md bg-yellow-400">
            <UserCircleIcon className=" absolute left-[43%] top-20 h-12 w-12 rounded-full bg-white text-indigo-500" />
          </div>
          <div className="mt-5 h-[300px] rounded-b-md bg-white px-4 shadow-xl">
            <p className="font-Roboto text-center font-bold text-indigo-600">
              {user.username}
            </p>
            {userOccupations.length !== 0 && (
              <div>
                <h1 className="mt-4 font-bold text-indigo-600 underline decoration-yellow-400">
                  Mina Yrken:
                </h1>
                <ul>
                  {userOccupations.map((occuaption) => (
                    <li key={occuaption.id} className=" flex">
                      <CogIcon className="h-6 w-6 text-indigo-500" />
                      {occuaption.attributes.occupation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex h-full flex-col place-items-center rounded-lg bg-gray-50 sm:col-span-2">
          <h1 className="w-full  text-center text-3xl font-bold print:hidden">
            Ladda ner rapport
            <span className="ml-2 text-sm text-indigo-300">Sökta jobb</span>
            <PrinterIcon
              className=" float-right m-2 inline-block h-6 w-6 duration-300 hover:scale-125 hover:cursor-pointer print:hidden"
              onClick={() => window.print()}
            />
          </h1>
          <div className="mt-2 mb-2 flex space-x-2 print:hidden">
            <label className="text-gray-400">välj månad</label>
            <input
              id="reportMonth"
              type="month"
              className="inline-block rounded-lg border px-2"
              onChange={handleGetReport}
            ></input>
          </div>
          {applicationReport.length !== 0 ? (
            <>
              <h1 className="hidden print:block print:text-3xl">
                {`Rapport för ${new Date(
                  applicationReport[0].createdAt.substring(0, 10)
                )
                  .toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  .substring(8)}`}
              </h1>
              <table className="max-h-screen table-auto overflow-y-auto">
                <thead>
                  <tr className=" rounded-t-lg border  bg-indigo-500 text-white">
                    <th>Jobb</th>
                    <th>Arbetsgivare</th>
                    <th>Annons ID</th>
                    <th>skickat</th>
                  </tr>
                </thead>
                <tbody className="border bg-white">
                  {applicationReport.map((application) => (
                    <tr className="border" key={application.id}>
                      <td className="p-2">{application.job.headline}</td>
                      <td className="p-2">{application.job.employer}</td>
                      <td className="p-2">{application.job.jobID}</td>
                      <td className="p-2">
                        {application.createdAt.substring(0, 10)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div className="flex h-full place-items-center justify-center">
              <h1 className="font-bold text-indigo-500 sm:text-2xl">
                Inga resultat hittades!
                <span className="block text-center text-2xl ">📂</span>
              </h1>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default MyProfile;
