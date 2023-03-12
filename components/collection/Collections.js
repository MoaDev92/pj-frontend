import {
  PuzzleIcon,
  OfficeBuildingIcon,
  LocationMarkerIcon,
  CogIcon,
  FolderOpenIcon,
  CollectionIcon,
  PlusIcon,
  XIcon,
  TrashIcon,
  ArrowsExpandIcon,
} from "@heroicons/react/outline";
import { BellIcon } from "@heroicons/react/solid";
import axios from "axios";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { BACKEND_URI } from "/config";
import BuildCollection from "./BuildCollection";
import JobsWindow from "./JobsWindow";
import SubscribeEmployer from "./SubscribeEmployer";
import { Subscriptions } from "./Subscriptions";

const Collections = ({ auth, user, notification }) => {
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [userCollections, setUsrCollections] = useState([]);
  const [collectionsUpdated, setCollectionsUpdated] = useState(false);
  const [showSubscribe, setShowSubcribe] = useState(false);
  const [showSubscriptions, setShowSubscriptions] = useState(true);
  const [employersUpdated, setEmployersUpdated] = useState(false);
  const [showJobsWindow, setShowJobsWindow] = useState(false);
  const [choosedOption, setChoosedOption] = useState("");

  const handleDeleteCollection = (e) => {
    const collectionId = e.currentTarget.id;

    axios
      .delete(`${BACKEND_URI}/api/collections/${collectionId}`, {
        headers: { Authorization: auth },
      })
      .then((res) => {
        setCollectionsUpdated(!collectionsUpdated);
      })
      .catch(
        (err) =>
          console.log(err) && alert("somthing wrong with deleting collection")
      );
  };

  const handleChooseJobs = (e) => {
    setShowJobsWindow(true);
    //console.log(e.target.value);
    setChoosedOption(e.target.id);
    /*  setChoosedOption({
      typeOfJobs: e.currentTarget.id,
      filterQuery: e.target.value,
    }); */
  };

  useEffect(() => {
    axios
      .get(`${BACKEND_URI}/api/collections?filters[user][id][$eq]=${user.id}`, {
        headers: { Authorization: auth },
      })
      .then((res) => {
        setUsrCollections((userCollections = res.data.data)),
          console.log(userCollections);
      });
  }, [collectionsUpdated]);

  //bg-[#e9ebf2]
  return (
    <main className=" h-full w-full">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Gwendolyn&family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </Head>
      {!showJobsWindow && (
        <>
          <div className="m-4 flex justify-center space-x-3">
            <button
              className="rounded bg-indigo-600 px-10 text-white  shadow-xl"
              onClick={() => setShowCreateCollection(true)}
            >
              Skapa
              <PuzzleIcon className="float-right h-6 w-6" />
            </button>
            <button
              className="rounded bg-indigo-600 px-10 py-2 text-white shadow-xl hover:cursor-pointer"
              onClick={() => setShowSubcribe(true)}
            >
              <span className="float-right flex">
                <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500 "></span>
              </span>
              Subscribe
            </button>
          </div>
          <section className="mt-10 grid h-[90vh] grid-cols-1 gap-10 sm:grid-cols-3 2xl:grid-cols-5  ">
            <div className="col-span-2  ml-10 rounded-xl bg-gray-50 2xl:col-span-4">
              <h1 className="p-2 text-center text-indigo-500 underline decoration-pink-500  md:text-3xl">
                Samlingar
              </h1>
              {userCollections.length !== 0 && (
                <p className="p-2 text-center text-gray-500">
                  Du har {userCollections.length} samling(ar)
                </p>
              )}
              {userCollections.length === 0 && (
                <h1 className="font-Pacifico mx-auto mt-10 flex w-[70%] justify-center border border-dashed border-indigo-600 bg-gray-100 p-20 text-center text-3xl text-pink-500">
                  Du har inga samlingar
                </h1>
              )}
              <ul className="mx-auto flex h-full flex-col  place-items-center ">
                {userCollections.map((collection) => (
                  <div
                    className="relative w-full min-w-[300px] max-w-full"
                    key={collection.id}
                  >
                    <li
                      key={collection.id}
                      value={collection.attributes.filterQuery}
                      style={{
                        borderLeftColor: ` ${collection.attributes.color}`,
                        color: ` ${collection.attributes.color}`,
                        /*  backgroundColor: ` ${collection.attributes.color}`, */
                      }}
                      //style={"background-color:blue"}
                      className={`relative flex h-24 w-full place-items-center justify-center rounded-l-lg border border-l-8  bg-white p-4 font-bold hover:cursor-pointer`}
                    >
                      {collection.attributes.name}
                      <div className="absolute top-0 right-0 flex space-x-2">
                        <TrashIcon
                          className=" h-5 w-5 cursor-pointer text-red-600 duration-300 hover:scale-125"
                          id={collection.id}
                          onClick={handleDeleteCollection}
                        />
                        <ArrowsExpandIcon
                          id="collection"
                          className="h-5 w-5 cursor-pointer duration-300 hover:scale-125"
                          onClick={() => {
                            setShowJobsWindow(true);
                            setChoosedOption({
                              typeOfJobs: "collection",
                              filterQuery: collection.attributes.filterQuery,
                            });
                          }}
                        ></ArrowsExpandIcon>
                      </div>
                    </li>
                  </div>
                ))}
              </ul>
            </div>
            <div className="mr-10 rounded-xl bg-gray-50">
              {
                <Subscriptions
                  setShowSubcribe={setShowSubcribe}
                  user={user}
                  auth={auth}
                  employersUpdated={employersUpdated}
                  setEmployersUpdated={setEmployersUpdated}
                  showJobsWindow={showJobsWindow}
                  setShowJobsWindow={setShowJobsWindow}
                  handleChooseJobs={handleChooseJobs}
                  setChoosedOption={setChoosedOption}
                />
              }
            </div>
          </section>
        </>
      )}
      {showCreateCollection && (
        <BuildCollection
          setShowCreateCollection={setShowCreateCollection}
          user={user}
          auth={auth}
          collectionsUpdated={collectionsUpdated}
          setCollectionsUpdated={setCollectionsUpdated}
        />
      )}
      {showSubscribe && (
        <SubscribeEmployer
          setShowSubcribe={setShowSubcribe}
          user={user}
          auth={auth}
          employersUpdated={employersUpdated}
          setEmployersUpdated={setEmployersUpdated}
        />
      )}
      {showJobsWindow && (
        <JobsWindow
          showJobsWindow={showJobsWindow}
          setShowJobsWindow={setShowJobsWindow}
          user={user}
          auth={auth}
          choosedOption={choosedOption}
          notification={notification}
        />
      )}
    </main>
  );
};

export default Collections;
