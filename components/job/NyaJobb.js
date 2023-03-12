import React, { useCallback, useEffect, useState } from "react";
import ExpandedJob from "./ExpandedJobNew";
import axios from "axios";
import {
  BACKEND_URI,
  JOB_API,
  JOB_API_KEY,
  JOB_API_REGION,
} from "../../config";
import {
  ArrowsExpandIcon,
  SpeakerphoneIcon,
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
  CogIcon,
  PlusIcon,
  PlusCircleIcon,
  XIcon,
  LocationMarkerIcon,
  OfficeBuildingIcon,
} from "@heroicons/react/outline";
import ErrorWarning from "../ErrorWarning";
import { toast } from "react-toastify";

const NyaJobb = ({
  user,
  auth,
  setFavoritUpdated,
  favoritUpdated,
  jobsWithoutFav,
  setShowAddToFavorite,
  showAddToFavorite,
  setShowAdditionalButtons,
  showAdditionalButtons,
  occuaptionCodes,
  notification,
  setNotification,
}) => {
  /* if (!jobsWithoutFav) {
    return <div>Du ska logga in</div>;
  } */

  // <-------------------------  ------------------------->;

  const [showExpandedJob, setShowExpandedJob] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRegionsList, setShowRegionsList] = useState(false);
  const [scaleRegionsList, setScaleRegionsList] = useState("h-0");
  const [jobsPage, setJobsPage] = useState(1);
  const [jobPagesCount, setJobsPagesCount] = useState(10);
  const [newJobs, setNewJobs] = useState([]);
  const [pages, setPages] = useState([]);
  const [showLoading, setShowLoading] = useState(" ");
  const [filterQuery, setFilterQuery] = useState("");
  const [filterList, setFilterList] = useState([]);
  const [jobsReigons, setJobsReigons] = useState("");

  useEffect(() => {
    const jobsLimit = 15;
    const jobsSkip = (jobsPage - 1) * jobsLimit;
    axios(
      `${JOB_API}?${occuaptionCodes}${filterQuery}&offset=${jobsSkip}&limit=${jobsLimit}`,
      {
        method: "GET",
        headers: {
          "api-key": JOB_API_KEY,
        },
      }
    )
      .then((res) => {
        setJobsPagesCount(
          (jobPagesCount = Math.ceil(res.data.total.value / jobsLimit))
        );
        setNewJobs((newJobs = res.data.hits));
        setShowLoading("hidden");
        let pagesArray = [];
        for (let i = 1; i <= jobPagesCount; i++) {
          pagesArray.push(i);
        }
        setPages((pages = pagesArray));
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("något gick fel!", {
          position: "top-center",
          autoClose: true,
          icon: "😓",
        });
      });
  }, [jobsPage, filterQuery]);

  const handleCreateFilter = () => {
    axios.get(JOB_API_REGION).then((res) => {
      setJobsReigons(res.data);
      setShowRegionsList(!showRegionsList);
    });
  };

  const handleAddToFilterList = (e) => {
    if (!e.currentTarget.id) return;

    const region = e.currentTarget.id;
    const regionId = e.currentTarget.title;
    const newFilterList = [...filterList];
    newFilterList.push({ region, regionId });
    setFilterList(newFilterList);

    //remove the region from regions list
    const newRegionsList = jobsReigons.filter(
      (r) => r["taxonomy/preferred-label"] !== region
    );

    setJobsReigons(newRegionsList);

    let newFilterQuery;
    newFilterQuery = `${filterQuery}&region=${regionId}`;
    setFilterQuery(newFilterQuery);
    setJobsPage(1);
  };

  const handleClearFilterItem = (e) => {
    if (!e.currentTarget.id) return;
    const removedRegion = e.currentTarget.id;
    const regionId = e.currentTarget.title;

    const newFilterList = filterList.filter((r) => r.region !== removedRegion);
    setFilterList(newFilterList);

    // return the region to reigons list
    const newRegionsList = [...jobsReigons];
    newRegionsList.push({
      "taxonomy/preferred-label": removedRegion,
      "taxonomy/id": regionId,
    });
    setJobsReigons(newRegionsList);

    let newFilterQuery = "";
    newFilterList.forEach((filterObject) => {
      newFilterQuery += `region=${filterObject.regionId}&`;
    });
    setFilterQuery(newFilterQuery);
    setJobsPage(1);
  };

  // create filter query
  /* const createFilterQuery = useCallback(() => {
    let filterQuery = "";

    filterList.forEach((filterObject) => {
      filterQuery += `region=${filterObject.regionId}&`;
    });
    setFilterQuery(filterQuery);
    console.log(filterQuery);
  }, [filterList]); */

  const handleExpandedJob = (e) => {
    e.preventDefault();

    const jobID = e.currentTarget.id;

    /**Replace fetch the expanded job and send it from state
     * Create state with the jobs comming from minaSidor
     *
     */

    /* const job = jobsWithoutFav.filter(
      (j) => parseInt(j.jobID) === parseInt(jobID)
    );
 */
    setExpandedJobId((expandedJobId = jobID));
    setShowAddToFavorite(true);
    setShowExpandedJob(true);
  };

  const handleCurrentPage = (e) => {
    setCurrentPage((currentPage = e.target.id));

    setJobsPage(currentPage);
    console.log(currentPage);
  };

  return (
    <main className="relative">
      {!showExpandedJob && (
        <>
          <div className=" top-0 flex flex-row">
            <button className="flex rounded-md bg-indigo-500 px-2 text-white ">
              Skapa filter
              <PlusCircleIcon
                className="h-6 w-6"
                onClick={handleCreateFilter}
              />
            </button>
            <div className="flex space-x-2">
              {filterList.map((filter) => (
                <button
                  key={filter.region}
                  id={filter.region}
                  className="ml-2 flex flex-row rounded-md bg-orange-500 px-2 text-white"
                  onClick={handleClearFilterItem}
                >
                  {filter.region}
                  <XIcon className="h-6 w-6" key={filter.region} />
                </button>
              ))}
            </div>
          </div>
          <div
            className={`relative grid h-[93vh] grid-cols-1 gap-5 overflow-y-auto p-8 md:grid-cols-2 xl:grid-cols-3 `}
          >
            {newJobs.map((job) => (
              <div
                key={job.id}
                className="relative space-y-2 rounded-lg bg-gradient-to-r  from-[#601dca] to-[#3c31db] p-5 shadow-md xl:text-lg"
              >
                <ArrowsExpandIcon
                  className="absolute top-2 left-[90%] h-6 w-6 text-white duration-300 hover:scale-150 hover:cursor-pointer"
                  id={job.id}
                  onClick={handleExpandedJob}
                />
                <SpeakerphoneIcon className="absolute -top-5 left-[50%] h-8 w-8 rounded-full bg-white p-1 text-indigo-600" />
                <h1 className="text-xl font-bold text-white">{job.headline}</h1>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-50 ">
                    <CogIcon className="mr-2 mb-1 inline-block h-6 w-6" />{" "}
                    {job.occupation.label}
                  </p>
                  <p className=" text-sm text-gray-50">
                    <OfficeBuildingIcon className="mr-2 mb-1 inline-block h-6 w-6" />
                    {job.employer.name}
                  </p>
                  <p className="text-sm text-gray-50 ">
                    <LocationMarkerIcon className="mr-2 mb-1 inline-block h-6 w-6" />
                    {job.workplace_address.municipality},
                    {job.workplace_address.country}
                  </p>
                </div>
              </div>
            ))}
            {/*   <div
              className={`${showLoading} flex place-items-center justify-items-center `}
            >
              <iframe
                src="https://embed.lottiefiles.com/animation/88796"
                className="h-screen w-screen "
              ></iframe>
            </div> */}

            {showRegionsList && (
              <ul
                className={`absolute top-2 left-0 h-auto w-auto space-y-2 rounded-md bg-indigo-600 p-3 text-white ${scaleRegionsList} duration-1000 hover:translate-y-0`}
              >
                <XIcon
                  className="float-right h-6 w-6 cursor-pointer"
                  onClick={() => setShowRegionsList(false)}
                />
                {jobsReigons.map((region) => (
                  <li
                    key={region["taxonomy/preferred-label"]}
                    id={region["taxonomy/preferred-label"]}
                    title={region["taxonomy/id"]}
                    className="rounded-md px-2 duration-300 hover:cursor-pointer hover:bg-indigo-300"
                    onClick={handleAddToFilterList}
                  >
                    {region["taxonomy/preferred-label"]}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <section className="mx-auto flex sm:w-max ">
            <ArrowCircleLeftIcon
              className="h-6 w-6 "
              onClick={() => {
                const pages = document.getElementById("pagesBar");

                pages.scrollTo({
                  left: -(pages.scrollWidth * 2),
                  behavior: "smooth",
                });
              }}
            />
            <div
              className="flex w-fit max-w-[80vw] flex-row space-x-6 overflow-x-auto rounded-lg bg-gray-100 p-2  text-center"
              id="pagesBar"
            >
              {pages.map((p) => {
                let focus;
                if (parseInt(p) === parseInt(currentPage)) {
                  focus = "bg-indigo-100";
                }
                {
                  return (
                    <button
                      key={p}
                      id={p}
                      className={`rounded-full px-2 duration-300 hover:cursor-pointer hover:bg-sky-400 ${focus}`}
                      onClick={handleCurrentPage}
                    >
                      {p}
                    </button>
                  );
                }
              })}
            </div>
            <ArrowCircleRightIcon
              className="h-6 w-6  "
              onClick={() => {
                const pages = document.getElementById("pagesBar");
                pages.scrollTo({
                  left: pages.scrollWidth / 2,
                  behavior: "smooth",
                });
              }}
            />
          </section>
        </>
      )}
      {showExpandedJob && (
        <ExpandedJob
          user={user}
          auth={auth}
          expandedJobId={expandedJobId}
          setShowExpandedJob={setShowExpandedJob}
          favoritUpdated={favoritUpdated}
          setFavoritUpdated={setFavoritUpdated}
          setShowAddToFavorite={setShowAddToFavorite}
          showAddToFavorite={showAddToFavorite}
          setShowAdditionalButtons={setShowAdditionalButtons}
          showAdditionalButtons={showAdditionalButtons}
          notification={notification}
        />
      )}
    </main>
  );
};

export default NyaJobb;
