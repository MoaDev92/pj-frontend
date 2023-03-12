import React, { useEffect, useState } from "react";

import {
  CogIcon,
  ColorSwatchIcon,
  PlusCircleIcon,
  SearchIcon,
  XIcon,
} from "@heroicons/react/outline";
import axios from "axios";
import {
  BACKEND_URI,
  JOB_API_MUNICIPALITIES,
  JOB_API_REGION,
  JOB_SSYK_OCCUPATIONS,
} from "../../config";

const BuildCollection = ({
  setShowCreateCollection,
  auth,
  user,
  collectionsUpdated,
  setCollectionsUpdated,
}) => {
  const [occupations, setOccupations] = useState([]);
  const [regions, setRegions] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [searchType, setSearchType] = useState("");
  const [choosedOccupations, setChoosedOccupations] = useState([]);
  const [choosedRegions, setChoosedRegions] = useState([]);
  const [choosedMunicipalities, setChoosedMunicipalities] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [collectionColor, setCollectionColor] = useState("#000000");

  const handleCreateCollection = () => {
    let regionsString = "";
    choosedRegions.forEach(
      (region) => (regionsString += `&region=${region.regionId}`)
    );

    let occupationsString = "";

    choosedOccupations.forEach(
      (occupation) =>
        (occupationsString += `&occupation-group=${occupation.occupationId}`)
    );

    let municipalitiesString = "";
    choosedMunicipalities.forEach(
      (municipality) =>
        (municipalitiesString += `&municipality=${municipality.municipalityId}`)
    );

    const queryString =
      regionsString + occupationsString + municipalitiesString;

    axios(`${BACKEND_URI}/api/collections`, {
      method: "POST",
      data: {
        data: {
          name: collectionName,
          filterQuery: queryString,
          color: collectionColor,
          user: [user.id],
        },
      },
      headers: { Authorization: auth },
    })
      .then((res) => {
        setCollectionsUpdated(!collectionsUpdated);
        setShowCreateCollection(false);
      })
      .catch(
        (err) =>
          console.log(err) && alert("somthing wrong with creating collection")
      );
  };

  const handleChooseOccupation = (e) => {
    setSearchType(e.currentTarget.id);
    /*  if (!e.currentTarget.id) return;
    console.log(e.currentTarget); */
    setShowSearch(true);

    axios.get(JOB_SSYK_OCCUPATIONS).then((res) => {
      setOccupations((occupations = res.data));
    });
  };

  const handleChooseRegion = (e) => {
    setSearchType(e.currentTarget.id);
    setShowSearch(true);

    axios.get(JOB_API_REGION).then((res) => {
      setRegions((regions = res.data));
      // console.log(res.data);
    });
  };

  const handleChooseMunicipalities = (e) => {
    setSearchType(e.currentTarget.id);
    setShowSearch(true);

    axios.get(JOB_API_MUNICIPALITIES).then((res) => {
      setMunicipalities((municipalities = res.data));
    });
  };

  const handleDeleteOccupationChoise = (e) => {
    const newChoosedOccupations = choosedOccupations.filter(
      (occupation) => occupation.occupationId !== e.currentTarget.id
    );
    setChoosedOccupations(newChoosedOccupations);
  };

  const handleDeleteMunicipalityChoise = (e) => {
    const newChoosedMunicipality = choosedMunicipalities.filter(
      (municipality) => municipality.municipalityId !== e.currentTarget.id
    );

    setChoosedMunicipalities(newChoosedMunicipality);
  };

  const handleDeleteRegionChoise = (e) => {
    const newChoosedRegions = choosedRegions.filter(
      (region) => region.regionId !== e.currentTarget.id
    );

    setChoosedRegions(newChoosedRegions);
  };

  return (
    <main className="absolute top-0 h-auto w-full border bg-gray-100">
      <XIcon
        className="float-right m-5 h-6 w-6 cursor-pointer text-red-600 duration-300 hover:scale-125"
        onClick={() => setShowCreateCollection(false)}
      />
      <section className="p-5">
        <h1 className="p-4 text-3xl">Skapa en Jobbsamling</h1>

        <div className="bg-white p-5 shadow-xl">
          <div className="flex gap-8">
            <div>
              <label className="block">Samlings namn</label>
              <input
                type="text"
                className="mt-3 w-[30vw] border px-3 py-2"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
              ></input>
            </div>
            <div className="relative">
              <label className="block ">FÄRG </label>
              <input
                type="color"
                className="relative mt-5 w-6 rounded-full bg-white"
                value={collectionColor}
                onChange={(e) => setCollectionColor(e.target.value)}
              ></input>
              <ColorSwatchIcon className=" absolute top-0 left-[110%] h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2">
            <h1 className="block">
              Yrke <span className="font-bold text-red-600">*</span>
            </h1>
            <div className="flex flex-row rounded border p-2">
              {choosedOccupations.map((occupation) => (
                <button
                  key={occupation.occupationId}
                  className="border-full m-2 flex rounded-lg bg-green-500 px-3 py-1 text-sm text-white"
                >
                  {occupation.occupation}
                  <XIcon
                    className="h-6 w-6"
                    id={occupation.occupationId}
                    onClick={handleDeleteOccupationChoise}
                  />
                </button>
              ))}
              <button
                className=" bg-whire ml-auto rounded-md border border-emerald-500 bg-white px-10 py-1 text-teal-500"
                id="occupations"
                onClick={handleChooseOccupation}
              >
                Välj
              </button>
            </div>
            <h1 className="block">
              Kommun <span className="text-sm text-gray-300">(frivilligt)</span>
            </h1>
            <div className="flex flex-row rounded border p-2">
              {choosedMunicipalities.map((municipality) => (
                <button
                  key={municipality.municipalityId}
                  className="border-full m-2 flex rounded-lg bg-green-500 px-3 py-1 text-sm text-white"
                >
                  {municipality.municipality}
                  <XIcon
                    className="h-6 w-6"
                    id={municipality.municipalityId}
                    onClick={handleDeleteMunicipalityChoise}
                  />
                </button>
              ))}
              <button
                className=" bg-whire ml-auto rounded-md border border-emerald-500 bg-white px-10 py-1 text-teal-500"
                id="municipalities"
                onClick={handleChooseMunicipalities}
              >
                Välj
              </button>
            </div>
            <h1 className="block">
              Region <span className="text-sm text-gray-300">(frivilligt)</span>
            </h1>
            <div className="flex flex-row rounded border p-2">
              {choosedRegions.map((region) => (
                <button
                  key={region.regionId}
                  className="border-full m-2 flex rounded-lg bg-green-500 px-3 py-1 text-sm text-white"
                >
                  {region.region}
                  <XIcon
                    className="h-6 w-6"
                    id={region.regionId}
                    onClick={handleDeleteRegionChoise}
                  />
                </button>
              ))}
              <button
                className=" bg-whire ml-auto rounded-md border border-emerald-500 bg-white px-10 py-1 text-teal-500"
                id="regions"
                onClick={handleChooseRegion}
              >
                Välj
              </button>
            </div>
          </div>

          {/* <label className="">Deltid</label>
          <input type="checkbox" className="m-3 w-4 h-4"></input>
          <label className="">Heltid</label>
          <input type="checkbox" className="m-3 w-4 h-4"></input> */}
          <div className=" mt-5 flex justify-end space-x-3">
            <button
              className="rounded-lg bg-red-500 px-4 py-1 text-white"
              onClick={() => setShowCreateCollection(false)}
            >
              Avbryt
            </button>
            <button
              className="rounded-lg bg-green-500 px-4 py-1 text-white"
              onClick={handleCreateCollection}
            >
              Skapa
            </button>
          </div>
        </div>
      </section>
      {showSearch && (
        <SearchBuildCollection
          searchText={searchText}
          setSearchText={setSearchText}
          occupations={occupations}
          setOccupations={setOccupations}
          choosedOccupations={choosedOccupations}
          setChoosedOccupations={setChoosedOccupations}
          setShowSearch={setShowSearch}
          searchType={searchType}
          regions={regions}
          setRegions={setRegions}
          choosedRegions={choosedRegions}
          setChoosedRegions={setChoosedRegions}
          choosedMunicipalities={choosedMunicipalities}
          setChoosedMunicipalities={setChoosedMunicipalities}
          municipalities={municipalities}
        />
      )}
    </main>
  );
};

const SearchBuildCollection = ({
  searchText,
  setSearchText,
  occupations,
  choosedOccupations,
  setChoosedOccupations,
  setShowSearch,
  searchType,
  regions,
  setRegions,
  choosedRegions,
  setChoosedRegions,
  choosedMunicipalities,
  setChoosedMunicipalities,
  municipalities,
  setMunicipalities,
}) => {
  const [searchResult, setSearchResult] = useState([]);

  const handleShowSearchResults = () => {
    if (searchText === "") return setSearchResult([]);
    let results = [];

    if (searchType === "occupations") {
      occupations.forEach((element) => {
        if (
          element["taxonomy/preferred-label"]
            .toLowerCase()
            .includes(searchText.toLowerCase())
        ) {
          results.push({
            occupation: element["taxonomy/preferred-label"],
            occupationId: element["taxonomy/id"],
          });
        }
      });
      setSearchResult(results);
    }

    if (searchType === "municipalities") {
      municipalities.forEach((element) => {
        if (
          element["taxonomy/preferred-label"]
            .toLowerCase()
            .includes(searchText.toLowerCase())
        ) {
          results.push({
            municipality: element["taxonomy/preferred-label"],
            municipalityId: element["taxonomy/id"],
          });
        }
      });
      setSearchResult(results);
    }

    if (searchType === "regions") {
      regions.forEach((element) => {
        if (
          element["taxonomy/preferred-label"]
            .toLowerCase()
            .includes(searchText.toLowerCase())
        ) {
          results.push({
            region: element["taxonomy/preferred-label"],
            regionId: element["taxonomy/id"],
          });
        }
      });
      setSearchResult(results);
    }
  };

  const handleChooseResult = (e) => {
    if (searchType === "occupations") {
      const newResults = searchResult.filter(
        (result) => result.occupationId !== e.currentTarget.id
      );
      setSearchResult(newResults);
      setChoosedOccupations(
        (choosedOccupations = [
          ...choosedOccupations,
          { occupation: e.target.value, occupationId: e.currentTarget.id },
        ])
      );
    }

    if (searchType === "municipalities") {
      const newResults = searchResult.filter(
        (result) => result.municipalityId !== e.currentTarget.id
      );
      setSearchResult(newResults);
      setChoosedMunicipalities(
        (choosedMunicipalities = [
          ...choosedMunicipalities,
          { municipality: e.target.value, municipalityId: e.currentTarget.id },
        ])
      );
    }

    if (searchType === "regions") {
      const newResults = searchResult.filter(
        (result) => result.regionId !== e.currentTarget.id
      );
      setSearchResult(newResults);
      setChoosedRegions(
        (choosedRegions = [
          ...choosedRegions,
          { region: e.target.value, regionId: e.currentTarget.id },
        ])
      );
    }
  };

  /* useEffect(() => {
    if (searchText === "") return setSearchResult([]);
    let result = [];
    occupations.forEach((element) => {
      if (
        element["taxonomy/preferred-label"]
          .toLowerCase()
          .includes(searchText.toLowerCase())
      ) {
        result.push(element["taxonomy/preferred-label"]);
      }
    });
    setSearchResult(result);
    //console.log(searchText);
    console.log(searchResult);
  }, [searchText]); */

  return (
    <main className="absolute top-0 h-full w-full bg-white/30 backdrop-blur-sm  ">
      <XIcon
        className="float-right m-5 h-6 w-6 text-red-500 duration-300 hover:scale-125 hover:cursor-pointer"
        onClick={() => {
          setShowSearch(false);
          setSearchText("");
        }}
      />
      <div className=" top-5 mx-auto mt-10 h-[60vh]  w-[60vw] rounded-xl border bg-white p-5  ">
        <div className=" flex flex-row rounded-full bg-indigo-400 p-2">
          <SearchIcon className="h-10 w-10 text-white" />
          <input
            type="text"
            placeholder="Skriv här..."
            className="w-full bg-indigo-400 px-2 py-2 text-white outline-none placeholder:text-white "
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          ></input>
          <button
            className="flex rounded-full bg-white px-5 py-1 text-lg text-indigo-600"
            onClick={handleShowSearchResults}
          >
            Sök
          </button>
        </div>
        <div className=" mt-5 h-[40vh] space-y-3 overflow-x-auto">
          {searchResult.map((result) => {
            return (
              <button
                key={
                  result.occupationId ||
                  result.regionId ||
                  result.municipalityId
                }
                id={
                  result.occupationId ||
                  result.regionId ||
                  result.municipalityId
                }
                value={
                  result.occupation || result.region || result.municipality
                }
                className="flex w-fit rounded-full bg-indigo-600 p-4 text-white duration-300 hover:cursor-pointer hover:bg-indigo-400 focus:border-indigo-50"
                onClick={handleChooseResult}
              >
                <CogIcon className="h-6 w-6" /> {result.occupation}
                {result.region} {result.municipality}
                {/* <PlusCircleIcon className="w-6 h-6" /> */}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default BuildCollection;
