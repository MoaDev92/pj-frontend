//import {PaperAirplaneIcon} from "@heroicons/react/outline";
import {
  PaperAirplaneIcon,
  LocationMarkerIcon,
  XIcon,
  BriefcaseIcon,
  DeviceMobileIcon,
  PlusCircleIcon,
  CameraIcon,
  CheckIcon,
} from "@heroicons/react/outline";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BACKEND_URI } from "../../config";

const CreateCV = ({
  setShowCreateCV,
  auth,
  user,
  editedCVId,
  setEditedCVId,
  setCvsUpdated,
  cvsUpdated,
}) => {
  const [cvPhoto, setCvPhoto] = useState([]);
  const [showPartOne, setShowPartOne] = useState(true);
  const [showPartTow, setShowPartTow] = useState(false);
  const [showPartThree, setShowPartThree] = useState(false);
  const [showPartFour, setShowPartFour] = useState(false);
  const [showPartFive, setShowPartFive] = useState(false);
  const [showPartSix, setShowPartSix] = useState(false);
  const [showPartSeven, setShowPartSeven] = useState(false);
  //const [cv, setCV] = useState({ user: user.id });
  //const [educationTitle, setEducationTitle] = useState(null);
  //const [educationDateFrom, setEducationDateFrom] = useState(null);
  //const [educationDateTo, setEducationDateTo] = useState(null);
  const [educations, setEducations] = useState([]);
  const [education, setEducation] = useState([]);
  const [language, setLanguage] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [experience, setExperience] = useState([]);
  const [experiences, setExperiences] = useState([]);
  //const [experienceTitle, setExperienceTitle] = useState(null);
  //const [experienceDateFrom, setExperienceDateFrom] = useState(null);
  //const [experienceDateTo, setExperienceDateTo] = useState(null);
  //const [referenceNameAndTitle, setReferenceNameAndTitle] = useState({});
  //const [referenceMobile, setReferenceMobil] = useState({});
  //const [referenceEmail, setReferenceEmail] = useState({});
  const [reference, setReference] = useState([]);
  const [references, setReferences] = useState([]);
  const [currentPart, setCurrentPart] = useState(1);
  //const [summary, setSummary] = useState(null);
  const [data, setData] = useState({
    title: "",
    address: "",
    mobile: "",
    summary: "",
    other: " ",
  });
  //const [files, setFiles] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showUploadPhoto, setShowUploadPhoto] = useState(false);
  const [editedCvPhoto, setEditedCvPhoto] = useState({
    id: null,
    choosenAlternativ: "existingPhoto",
  });
  const [cvColors, setCvColors] = useState([]);

  const cardStyle =
    " p-5 bg-white mx-auto mt-10 w-[60%] min-h-screen h-auto rounded-lg shadow-xl";

  const partsNumbers = [1, 2, 3, 4, 5, 6, 7];

  useEffect(() => {
    axios
      .get(`${BACKEND_URI}/api/colors`, {
        headers: { Authorization: auth },
      })
      .then((res) => setCvColors(res.data.data));
  }, []);

  if (editedCVId) {
    useEffect(() => {
      axios
        .get(`${BACKEND_URI}/api/cvs/update/${editedCVId}?populate=*`, {
          headers: { Authorization: auth },
        })
        .then((res) => {
          const { title, summary, address, mobile, other, photoId } = res.data;
          setEditedCvPhoto((pre) => ({ ...pre, id: photoId }));
          console.log(res.data);
          setData({
            title,
            summary,
            address,
            mobile,
            other,
          });
          setEducations((languages = res.data.educations));
          setLanguages((languages = res.data.languages));
          setExperiences((languages = res.data.experiences));
          setReferences((languages = res.data.references));
        })
        .catch((err) => toast.error(err.message));
      /* useEffect(() => {
      axios
        .get(`${BACKEND_URI}/api/cvs/update/${editedCVId}?populate=*`, {
          headers: { Authorization: auth },
        })
        .then((res) => {
          
          const { title, summary, address, mobile, other, photo } =
            res.data.data.attributes;
          setData({
            title,
            summary,
            address,
            mobile,
            other,
          });
          setEducations((languages = res.data.data.attributes.educations));
          setLanguages((languages = res.data.data.attributes.languages));
          setExperiences((languages = res.data.data.attributes.experiences));
          setReferences((languages = res.data.data.attributes.references));
        })
        .catch((err) => toast.error(err.message)); */
    }, []);
  }

  const handleSubmitCV = (e) => {
    e.preventDefault();
    setShowLoading(true);
    setData(
      (data = {
        ...data,
        experiences,
        educations,
        languages,
        references,
        user: user.id,
        editedCvPhoto,
        editedCVId,
      })
    );
    const formData = new FormData();
    formData.append("files.photo", cvPhoto);

    formData.append("data", JSON.stringify(data));

    console.log(data);
    return axios
      .post(`${BACKEND_URI}/api/cvs`, formData, {
        data,
        headers: { Authorization: auth },
      })
      .then((res) => {
        setCvsUpdated(!cvsUpdated);
        setShowLoading(false);
        setShowCreateCV(false);
        toast.success("CV har skapats! 🤩");
      })
      .catch((err) => toast.error(err.message));
  };

  const handleDeleteEducation = useCallback((e) => {
    const newEducations = educations.filter(
      (ed) => ed.title !== e.currentTarget.id
    );
    setEducations(newEducations);
  });

  const handleDeleteExperience = useCallback((e) => {
    const newExperiences = experiences.filter(
      (ex) => ex.title !== e.currentTarget.id
    );
    setExperiences(newExperiences);
  });

  const handleDeleteLanguage = useCallback((e) => {
    const newLanguages = languages.filter(
      (lang) => lang.title !== e.currentTarget.id
    );
    setLanguages(newLanguages);
  });

  const handleDeleteReference = useCallback((e) => {
    const newReferences = references.filter(
      (ref) => ref.name !== e.currentTarget.id
    );
    setReferences(newReferences);
  });

  return (
    <main className="absolute top-0 h-full min-h-screen w-full overflow-y-auto bg-white">
      <header>
        <XIcon
          className="float-right m-5 h-6 w-6 text-red-600 duration-300 hover:scale-125 hover:cursor-pointer"
          onClick={() => {
            setShowCreateCV(false);
            setEditedCVId(null);
          }}
        />
        {/*  <h1 className="absolute top-3 left-[30%]  w-full space-x-3 text-xs lg:space-x-12 xl:space-x-20"> */}
        <div className="mt-5 flex flex-row justify-center space-x-5">
          {partsNumbers.map((num) => {
            let numColor = "bg-indigo-500 text-white";
            if (currentPart < num) {
              numColor = "bg-gray-100";
            }
            return (
              <span
                key={num}
                className={` ${numColor} rounded-full border px-2 py-[0.5]`}
              >
                {num}
              </span>
            );
          })}
        </div>
      </header>
      {editedCVId && (
        <button
          id="edite"
          className="absolute top-0 left-0 rounded-lg bg-indigo-600 px-4 py-1 text-white "
          onClick={handleSubmitCV}
        >
          Spara och stäng
          <CheckIcon className="ml-2 inline-block h-6 w-6" />
        </button>
      )}

      {showPartOne && (
        <div className="relative mx-auto mt-10 h-auto  w-[60%] rounded-lg bg-white p-5 shadow-xl">
          <h1 className="text-center font-bold">Skapa ditt cv</h1>
          <button
            className="float-right text-blue-500"
            onClick={() => {
              setShowPartOne(false);
              setShowPartTow(true);
              setCurrentPart(2);
            }}
          >
            Nästa
          </button>
          <form className="mt-4 grid grid-cols-1 place-items-center space-y-4 rounded-xl bg-indigo-100 p-4 ">
            <label className=" flex text-gray-500">
              <BriefcaseIcon className="h-6 w-6" /> Jobbtitl
            </label>
            <input
              name="jobTitle"
              value={data.title}
              className="block w-32 rounded-xl border px-2 py-1 sm:w-72 "
              onChange={(e) => setData({ ...data, title: e.target.value })}
            ></input>
            <label className="flex text-gray-500">
              <DeviceMobileIcon className="h-6 w-6" /> Mobil
            </label>
            <input
              name="mobile"
              value={data.mobile}
              className="block w-32  rounded-xl border px-2 py-1 sm:w-72 "
              onChange={(e) => setData({ ...data, mobile: e.target.value })}
            ></input>
            <label className=" flex text-gray-500">
              {" "}
              <LocationMarkerIcon className="h-6 w-6" /> Adress
            </label>
            <input
              name="address"
              value={data.address}
              className="block w-32  rounded-xl border px-2 py-1 sm:w-72 "
              onChange={(e) => setData({ ...data, address: e.target.value })}
            ></input>
            {!editedCVId || !editedCvPhoto.id ? (
              <div className="flex">
                <label className=" text-gray-500">
                  <CameraIcon className="inline-block h-6 w-6 text-gray-500" />{" "}
                  Ladda upp ett foto
                </label>
                <input
                  type="file"
                  name="photo"
                  className="ml-8 text-sm text-gray-500 duration-300 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-indigo-700 hover:file:cursor-pointer hover:file:bg-indigo-100"
                  onChange={(e) => setCvPhoto((cvPhoto = e.target.files[0]))}
                  onClick={() => {
                    setEditedCvPhoto((pre) => ({
                      ...pre,
                      choosenAlternativ: "newfoto",
                    }));
                  }}
                />
              </div>
            ) : (
              ""
            )}

            {editedCVId && editedCvPhoto.id && (
              <div className="grid grid-cols-1 gap-2">
                {" "}
                <h1 className=" text-center text-gray-500">
                  <CameraIcon className="inline-block h-6 w-6 text-gray-500" />{" "}
                  foto
                </h1>
                <div className="flex place-items-center  ">
                  <input
                    type="radio"
                    name="photo"
                    id="deletePhoto"
                    className="mr-3 h-5 w-5"
                    onClick={() => {
                      setShowUploadPhoto(false);
                      setEditedCvPhoto((pre) => ({
                        ...pre,
                        choosenAlternativ: "deletePhoto",
                      }));
                    }}
                  ></input>
                  <label className=" text-gray-500" htmlFor="deletePhoto">
                    Radera mitt foto
                  </label>
                </div>
                <div className="flex place-items-center  ">
                  <input
                    type="radio"
                    name="photo"
                    id="newPhoto"
                    className="mr-3 h-5 w-5"
                    onClick={() => {
                      setShowUploadPhoto(true);
                      setEditedCvPhoto((pre) => ({
                        ...pre,
                        choosenAlternativ: "newPhoto",
                      }));
                    }}
                  ></input>
                  <label className="text-gray-500" htmlFor="newPhoto">
                    Ladda upp ett nytt
                  </label>
                </div>
              </div>
            )}
            {showUploadPhoto && (
              <div>
                <input
                  type="file"
                  name="photo"
                  className="ml-8 text-sm text-gray-500 duration-300 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-indigo-700 hover:file:cursor-pointer hover:file:bg-indigo-100"
                  onChange={(e) => setCvPhoto((cvPhoto = e.target.files[0]))}
                />
              </div>
            )}
            {/* <div className="flex space-x-5 p-2">
              <h1 className="block text-gray-500">Textfärg</h1>
              {cvColors.map((color) => (
                <button
                  key={color.id}
                  id={color.id}
                  style={{ backgroundColor: color.attributes.hex }}
                  className=" h-6 w-6 rounded-full ring-white focus:ring-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setData({ ...data, text_color: e.target.id });
                  }}
                ></button>
              ))}
            </div> */}
          </form>
        </div>
      )}
      {showPartTow && (
        <div className={cardStyle}>
          <h1 className="invisible text-center font-bold sm:visible">
            Skapa ditt cv
          </h1>
          <button
            className="float-left text-blue-500"
            onClick={() => {
              setShowPartOne(true);
              setShowPartTow(false);
              setCurrentPart(currentPart - 1);
            }}
          >
            Tillbaka
          </button>
          <button
            className="float-right text-blue-500"
            onClick={() => {
              setShowPartTow(false);
              setShowPartThree(true);
              setCurrentPart(currentPart + 1);
            }}
          >
            Nästa
          </button>
          <div className="mt-5 flex  flex-row space-x-10"></div>
          <form className="mt-5 ">
            <label className="font-bold text-gray-500">Sammanfattning</label>
            <textarea
              type="text"
              className="mt-4 block h-64 max-h-72 w-full rounded-xl border-2 p-3 focus:border-indigo-200"
              value={data.summary}
              onChange={(e) => setData({ ...data, summary: e.target.value })}
            ></textarea>
          </form>
        </div>
      )}
      {showPartThree && (
        <div className={cardStyle}>
          <h1 className="invisible text-center font-bold sm:visible">
            Skapa ditt cv
          </h1>
          <button
            className="float-left text-blue-500"
            onClick={() => {
              setShowPartTow(true);
              setShowPartThree(false);
              setCurrentPart(currentPart - 1);
            }}
          >
            Tillbaka
          </button>
          <button
            className="float-right text-blue-500"
            onClick={() => {
              setShowPartThree(false);
              setShowPartFour(true);
              setCurrentPart(currentPart + 1);
            }}
          >
            Nästa
          </button>
          <h1 className="mt-10 font-bold text-gray-500">
            Lägg till dina utbildningar
          </h1>
          <form className="mt-5 grid grid-cols-1 gap-2">
            <label className=" mb-2 block">Utbildning</label>
            <input
              type="text"
              className="block w-full rounded-lg border border-indigo-500 px-2 py-1 "
              //onChange={(e) => setEducationTitle(e.target.value)}
              onChange={(e) =>
                setEducation({ ...education, title: e.target.value })
              }
            ></input>
            <label className="mr-3">Från:</label>
            <input
              type="date"
              className="rounded-lg border border-indigo-500 p-2"
              //onChange={(e) => setEducationDateFrom(e.target.value)}
              onChange={(e) =>
                setEducation({ ...education, from_date: e.target.value })
              }
            ></input>
            <label className="">Till:</label>
            <input
              type="date"
              className="rounded-lg border border-indigo-500 p-2 "
              //onChange={(e) => setEducationDateTo(e.target.value)}
              onChange={(e) =>
                setEducation({ ...education, to_date: e.target.value })
              }
            ></input>
            <button
              className=" flex place-content-center rounded-xl bg-indigo-500 px-2 py-1 text-white"
              onClick={(e) => {
                e.preventDefault();
                setEducations((pre) => [...pre, education]);
              }}
            >
              Lägg till
              <PlusCircleIcon className="h-6 w-6" />
            </button>
            <div className="mt-5 grid grid-cols-1 rounded-lg bg-indigo-50 p-2">
              <h1 className="text-center font-bold">
                Du har lagt dessa utbildningar
              </h1>
              {educations.map((education) => (
                <p
                  key={education.title}
                  className="m-2 flex w-fit rounded-3xl bg-indigo-500 px-2 py-1 text-white"
                >
                  {education.title}{" "}
                  <XIcon
                    className="h-6 w-6"
                    id={education.title}
                    onClick={handleDeleteEducation}
                  />
                </p>
              ))}
            </div>
          </form>
        </div>
      )}
      {showPartFour && (
        <div className={cardStyle}>
          <h1 className="invisible text-center font-bold sm:visible">
            Skapa ditt cv
          </h1>
          <button
            className="float-left text-blue-500"
            onClick={() => {
              setShowPartThree(true);
              setShowPartFour(false);
              setCurrentPart(currentPart - 1);
            }}
          >
            Tillbaka
          </button>
          <button
            className="float-right text-blue-500"
            onClick={() => {
              setShowPartFour(false);
              setShowPartFive(true);
              setCurrentPart(currentPart + 1);
            }}
          >
            Nästa
          </button>
          <div className="mt-5 flex  flex-row space-x-10"></div>
          <h1 className="mt-5 font-bold text-gray-500">
            Lägg till dina arbetslivserfarenheter
          </h1>
          <form className="mt-5 grid grid-cols-1 gap-2">
            <label className=" mb-2 block">arbetslivserfarenhet</label>
            <input
              type="text"
              className="block w-full rounded-lg border border-indigo-500 px-2 py-1 "
              //onChange={(e) => setExperienceTitle(e.target.value)}
              onChange={(e) =>
                setExperience({ ...experience, title: e.target.value })
              }
            ></input>
            <label className=" mb-2 block">Arbetsplats</label>
            <input
              type="text"
              className="block w-full rounded-lg border border-indigo-500 px-2 py-1 "
              onChange={(e) =>
                setExperience({ ...experience, place: e.target.value })
              }
            ></input>
            <label className="mr-3">Från:</label>
            <input
              type="date"
              className="rounded-lg border border-indigo-500 p-2"
              //onChange={(e) => setExperienceDateFrom(e.target.value)}
              onChange={(e) =>
                setExperience({ ...experience, from_date: e.target.value })
              }
            ></input>
            <label className="">Till:</label>
            <input
              type="date"
              className="rounded-lg border border-indigo-500 p-2 "
              //onChange={(e) => setExperienceDateTo(e.target.value)}
              onChange={(e) =>
                setExperience({ ...experience, to_date: e.target.value })
              }
            ></input>
            <label className="">Beskrivning:</label>
            <textarea
              type="text"
              className="rounded-lg border border-indigo-500 p-2 "
              //onChange={(e) => setExperienceDateTo(e.target.value)}
              onChange={(e) =>
                setExperience({ ...experience, description: e.target.value })
              }
            ></textarea>
            <button
              className=" flex place-content-center rounded-xl bg-indigo-500 px-2 py-1 text-white"
              onClick={(e) => {
                e.preventDefault();
                setExperiences((pre) => [...pre, experience]);
              }}
            >
              Lägg till
              <PlusCircleIcon className="h-6 w-6" />
            </button>
            <div className="mt-5 grid grid-cols-1 rounded-lg bg-indigo-50 p-2">
              <h1 className="text-center font-bold">
                Du har lagt dessa erfarenheter
              </h1>
              {experiences.map((experience) => (
                <p
                  key={experience.title}
                  className="m-2 flex w-fit rounded-3xl bg-indigo-500 px-2 py-1 text-white"
                >
                  {experience.title}{" "}
                  <XIcon
                    className="h-6 w-6"
                    id={experience.title}
                    onClick={handleDeleteExperience}
                  />
                </p>
              ))}
            </div>
          </form>
        </div>
      )}
      {showPartFive && (
        <div className={cardStyle}>
          <h1 className="invisible text-center font-bold sm:visible">
            Skapa ditt cv
          </h1>
          <button
            className="float-left text-blue-500"
            onClick={() => {
              setShowPartFour(true);
              setShowPartFive(false);
              setCurrentPart(currentPart - 1);
            }}
          >
            Tillbaka
          </button>
          <button
            className="float-right text-blue-500"
            onClick={() => {
              setShowPartFive(false);
              setShowPartSix(true);
              setCurrentPart(currentPart + 1);
            }}
          >
            Nästa
          </button>
          <div className="mt-5 flex  flex-row space-x-10"></div>
          <h1 className="mt-5 font-bold text-gray-500">Lägg till dina språk</h1>
          <form className="mt-5 grid grid-cols-1 gap-2">
            <label className=" mb-2 block">språk</label>
            <input
              type="text"
              className="block w-full rounded-lg border border-indigo-500 px-2 py-1 "
              //onChange={(e) => setLanguage(e.target.value)}
              onChange={(e) =>
                setLanguage({ ...language, title: e.target.value })
              }
            ></input>
            <label className=" mb-2 block">Nivå</label>
            <input
              type="text"
              className="block w-full rounded-lg border border-indigo-500 px-2 py-1 "
              //onChange={(e) => setLanguage(e.target.value)}
              onChange={(e) =>
                setLanguage({ ...language, level: e.target.value })
              }
            ></input>

            <button
              className=" flex place-content-center rounded-xl bg-indigo-500 px-2 py-1 text-white"
              onClick={(e) => {
                e.preventDefault();
                setLanguages((pre) => [...pre, language]);
              }}
            >
              Lägg till
              <PlusCircleIcon className="h-6 w-6" />
            </button>
            <div className="mt-5 grid grid-cols-1 rounded-lg bg-indigo-50 p-2">
              <h1 className="text-center font-bold">Du har lagt dessa språk</h1>
              {languages.map((lang) => (
                <p
                  key={lang.title}
                  className="m-2 flex w-fit rounded-3xl bg-indigo-500 px-2 py-1 text-white"
                >
                  {lang.title}
                  <XIcon
                    className="h-6 w-6"
                    id={lang.title}
                    onClick={handleDeleteLanguage}
                  />
                </p>
              ))}
            </div>
          </form>
        </div>
      )}
      {showPartSix && (
        <div className={cardStyle}>
          <h1 className="invisible text-center font-bold sm:visible">
            Skapa ditt cv
          </h1>
          <button
            className="float-left text-blue-500"
            onClick={() => {
              setShowPartFive(true);
              setShowPartSix(false);
              setCurrentPart(currentPart - 1);
            }}
          >
            Tillbaka
          </button>
          <button
            className="float-right text-blue-500"
            onClick={() => {
              setShowPartSix(false);
              setShowPartSeven(true);
              setCurrentPart(currentPart + 1);
            }}
          >
            Nästa
          </button>
          <div className="mt-5 flex  flex-row space-x-10"></div>
          <h1 className="mt-5 font-bold text-gray-500">
            Lägg till dina referenser
          </h1>
          <form className="mt-5 grid grid-cols-1 gap-2">
            <label className=" mb-2 block">Namn</label>
            <input
              type="text"
              className="block w-full rounded-lg border border-indigo-500 px-2 py-1 "
              // onChange={(e) => setReferenceNameAndTitle(e.target.value)}
              onChange={(e) =>
                setReference({
                  ...reference,
                  name: e.target.value,
                })
              }
            ></input>
            <label className=" mb-2 block">Mobil</label>
            <input
              type="text"
              className="block w-full rounded-lg border border-indigo-500 px-2 py-1 "
              //onChange={(e) => setReferenceMobil(e.target.value)}
              onChange={(e) =>
                setReference({
                  ...reference,
                  mobile: e.target.value,
                })
              }
            ></input>
            <label className=" mb-2 block">email</label>
            <input
              type="text"
              className="block w-full rounded-lg border border-indigo-500 px-2 py-1 "
              //onChange={(e) => setReferenceEmail(e.target.value)}
              onChange={(e) =>
                setReference({
                  ...reference,
                  email: e.target.value,
                })
              }
            ></input>
            <button
              className=" flex place-content-center rounded-xl bg-indigo-500 px-2 py-1 text-white"
              onClick={(e) => {
                e.preventDefault();
                setReferences((pre) => [...pre, reference]);
              }}
            >
              Lägg till
              <PlusCircleIcon className="h-6 w-6" />
            </button>
            <div className="mt-5 grid grid-cols-1 rounded-lg bg-indigo-50 p-2">
              <h1 className="text-center font-bold">
                Du har lagt dessa referencer
              </h1>
              {references.map((ref) => (
                <p
                  key={ref.name}
                  className="m-2 flex w-fit rounded-3xl bg-indigo-500 px-2 py-1 text-white"
                >
                  {ref.name}
                  <XIcon
                    className="h-6 w-6"
                    id={ref.name}
                    onClick={handleDeleteReference}
                  />
                </p>
              ))}
            </div>
            {/*  <div>
              {!showLoading && (
                <button
                  type="submit"
                  onClick={handleSubmitCV}
                  className={`bg-indigo-500 flex mt-10 text-white justify-center rounded-lg px-10 py-1 mx-auto hover:bg-indigo-800 duration-300`}
                >
                  <PaperAirplaneIcon className="w-6 h-6" />
                  Skapa
                </button>
              )}
              {showLoading && (
                <iframe
                  src="https://embed.lottiefiles.com/animation/18332"
                  className={`bg-white mx-auto ${showLoading}`}
                ></iframe>
              )}
            </div> */}
          </form>
        </div>
      )}
      {showPartSeven && (
        <div className={cardStyle}>
          <h1 className="invisible text-center font-bold sm:visible">
            Skapa ditt cv
          </h1>
          <button
            className="float-left text-blue-500"
            onClick={() => {
              setShowPartSix(true);
              setShowPartSeven(false);
              setCurrentPart(currentPart - 1);
            }}
          >
            Tillbaka
          </button>
          <button className="float-right text-blue-500">Nästa</button>
          <div className="mt-5 flex  flex-row space-x-10"></div>
          <h1 className="mt-5 font-bold text-gray-500">
            Annat (T.ex. körkort eller andra erfarenheter)
          </h1>
          <form className="mt-5 grid grid-cols-1 gap-2">
            <label className=" mb-2 block">Annat</label>
            <textarea
              type="text"
              className="block h-96 max-h-96 w-full rounded-lg border border-indigo-500 px-2 py-1 "
              value={data.other}
              onChange={(e) => setData({ ...data, other: e.target.value })}
            ></textarea>
            {/*  <button
              className=" bg-indigo-500 px-2 py-1 flex place-content-center text-white rounded-xl"
              onClick={(e) => {
                e.preventDefault();
                setReferences((pre) => [...pre, reference]);
              }}
            >
              Lägg till
              <PlusCircleIcon className="w-6 h-6" />
            </button> 
            <div className="grid grid-cols-1">
              {references.map((ref) => (
                <p
                  key={ref.name}
                  className="flex bg-indigo-500 w-fit px-2 py-1 text-white m-2 rounded-3xl"
                >
                  {ref.name}
                  <XIcon
                    className="w-6 h-6"
                    id={ref.name}
                    onClick={handleDeleteReference}
                  />
                </p>
              ))}
            </div>*/}
            <div>
              {!showLoading && !editedCVId && (
                <button
                  type="submit"
                  onClick={handleSubmitCV}
                  className={`mx-auto mt-10 flex justify-center rounded-lg bg-indigo-500 px-10 py-1 text-white duration-300 hover:bg-indigo-300`}
                >
                  Skapa CV
                  <PaperAirplaneIcon className="ml-2 h-6 w-6 rotate-90" />
                </button>
              )}
              {showLoading && (
                <iframe
                  src="https://embed.lottiefiles.com/animation/18332"
                  className={`mx-auto bg-white ${showLoading}`}
                ></iframe>
              )}
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default CreateCV;
