import React, { useCallback } from "react";
import NyaJobb from "../../components/job/NyaJobb";
import MinaJobb from "../../components/job/MinaJobb";
import { useEffect, useState } from "react";

import { BACKEND_URI, FRONTEND_URI, THEME_TEXT_COLOR } from "../../config";
import axios from "axios";
import Welcome from "../../components/Welcome";
import Layout from "../../components/Layout";
import MyProfile from "../../components/MyProfile";
import Image from "next/image";
import AfAvatar from "../../public/AF.png";

import MyParticipants from "../../components/coach/MyParticipants";
import {
  ArchiveIcon,
  CollectionIcon,
  FolderOpenIcon,
  PaperAirplaneIcon,
  ViewGridAddIcon,
  IdentificationIcon,
  UsersIcon,
  StarIcon,
  UserGroupIcon,
  TemplateIcon,
} from "@heroicons/react/outline";

import CoachJobs from "../../components/coach/CoachJobs";

export async function getServerSideProps({ req }) {
  const token = req.headers.cookie;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const auth = `Bearer ${token.split("=")[1]}`;

  const { data } = await axios(`${FRONTEND_URI}/api/role`, {
    method: "GET",
    headers: {
      Authorization: auth,
    },
  });

  const { role } = data;

  if (!role) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (role !== "Coach") {
    return {
      redirect: {
        destination: `/mina-sidor/${role.toLowerCase()}`,
        permanent: false,
      },
    };
  }

  // get user info

  const resUserInfo = await fetch(`${BACKEND_URI}/api/users/me`, {
    method: "GET",
    headers: {
      Authorization: auth,
    },
  });
  const userInfo = await resUserInfo.json();

  // get user occupations

  const resUserOccupations = await fetch(
    `${BACKEND_URI}/api/occupations?filters[users][id][$eq]=${userInfo.id}`,
    {
      method: "GET",
      headers: {
        Authorization: auth,
      },
    }
  );
  const userOccupations = await resUserOccupations.json();
  let occuaptionCodes = "";
  userOccupations.data.forEach((entry) => {
    occuaptionCodes = `${occuaptionCodes}&occupation-group=${entry.attributes.occupationGroup}`;
  });

  if (!userInfo) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      token,
      userInfo,
      occuaptionCodes,
      userOccupations,
    },
  };
}

const Coach = ({
  token,
  userInfo,
  occuaptionCodes,
  userOccupations,
  compLayout,
  companyInfo,
}) => {
  const components = [
    Welcome,
    MyProfile,
    MinaJobb,
    NyaJobb,
    MyParticipants,
    CoachJobs,
  ];
  const [favoritUpdated, setFavoritUpdated] = useState(false);
  const [currentComponent, setCurrentComponent] = useState("MyProfile");
  const [opacity, setOpacity] = useState("");
  const [rotateIcone, setRotateApplicationIcone] = useState("");
  const [showAddToFavorite, setShowAddToFavorite] = useState(true);
  const [showArchive, setShowArchive] = useState(false);
  const [applicationUpdated, setApplicationUpdated] = useState(false);
  const [showUnderCollections, setShowUnderCollections] =
    useState("h-0 invisible");
  // show the checkbox and add button in the participants list.
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);
  //const [error, setError] = useState({ showError: false, errorMessage: "" });
  const [notification, setNotification] = useState({
    type: "",
    showNotification: false,
    message: "",
  });

  const buttonStyle =
    "flex p-5 w-full shrink focus:border-l-4 focus:border-blue-500 hover:bg-indigo-200 duration-300 hover:cursor-pointer focus:bg-gray-200";
  const auth = `Bearer ${token.split("=")[1]}`;

  const handleNyaJobb = useCallback((e) => {
    setOpacity((opacity = "opacity-25"));
    setRotateApplicationIcone("");
    setTimeout(() => {
      setOpacity(" opacity-100 ");
    }, 100);
    setCurrentComponent((currentComponent = e.currentTarget.id));
    e.preventDefault();
    console.log("1called");
  }, []);

  const handleMinaJobb = useCallback((e) => {
    setOpacity((opacity = "opacity-25"));
    setRotateApplicationIcone("");
    e.preventDefault();

    setCurrentComponent((currentComponent = e.currentTarget.id));
    setTimeout(() => {
      setOpacity(" opacity-100 ");
    }, 100);
    console.log("5called");
  }, []);

  const handleMinaDeltagare = useCallback((e) => {
    setShowAdditionalButtons(false);
    setOpacity((opacity = "opacity-25"));
    e.preventDefault();
    setCurrentComponent((currentComponent = "MyParticipants"));
    setTimeout(() => {
      setOpacity(" opacity-100 ");
    }, 100);
  }, []);

  const handleCoachJobs = useCallback((e) => {
    setOpacity((opacity = "opacity-25"));
    e.preventDefault();
    setCurrentComponent((currentComponent = "CoachJobs"));
    setTimeout(() => {
      setOpacity(" opacity-100 ");
    }, 100);
  }, []);

  /* const handleJobbAnsokningar = (e) => {
    setOpacity((opacity = "opacity-25"));
    setRotateApplicationIcone("rotate-90");
    setCurrentComponent((currentComponent = e.currentTarget.id));
    e.preventDefault();
    setTimeout(() => {
      setOpacity(" opacity-100 ");
    }, 100);
    console.log("2called");
  };

  const handleArchive = (e) => {
    setOpacity((opacity = "opacity-25"));
    setRotateApplicationIcone("");
    setCurrentComponent((currentComponent = e.currentTarget.id));
    e.preventDefault();
    setTimeout(() => {
      setOpacity(" opacity-100 ");
    }, 100);
  };

  const handleCV = (e) => {
    setOpacity((opacity = "opacity-25"));
    setRotateApplicationIcone("");
    setCurrentComponent((currentComponent = e.currentTarget.id));
    e.preventDefault();
    setTimeout(() => {
      setOpacity(" opacity-100 ");
    }, 100);
  };

  const handleToDo = (e) => {
    setRotateApplicationIcone("");
    e.preventDefault();
    setCurrentComponent((currentComponent = e.currentTarget.id));
  }; */

  const handleMyProfile = useCallback((e) => {
    setRotateApplicationIcone("");
    e.preventDefault();
    setCurrentComponent((currentComponent = "MyProfile"));
  }, []);

  /*  const handleCollections = (e) => {
    setOpacity((opacity = "opacity-25"));
    setRotateApplicationIcone("");
    e.preventDefault();
    setCurrentComponent((currentComponent = "Collections"));
    setTimeout(() => {
      setOpacity(" opacity-100 ");
    }, 100);
    setShowUnderCollections("h-32"); 
  };*/

  return (
    <main className="flex ">
      <div
        className={`${THEME_TEXT_COLOR} h-auto min-h-screen w-fit space-y-2 bg-gray-50 text-sm print:hidden sm:w-64 sm:text-base `}
      >
        <button
          className={buttonStyle}
          id="MyParticipants"
          onClick={handleMinaDeltagare}
        >
          <UserGroupIcon
            className={`mr-5 h-6 w-6 duration-300`}
            id="MyParticipants"
            onClick={handleMinaDeltagare}
          />
          <a
            className="hidden sm:block"
            id="MyParticipants"
            onClick={handleMinaDeltagare}
          >
            Mina deltagare
          </a>
        </button>
        <button className={buttonStyle} id="NyaJobb" onClick={handleNyaJobb}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-5 h-6 w-6 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            id="NyaJobb"
            onClick={handleNyaJobb}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <a className="hidden sm:block" id="NyaJobb" onClick={handleNyaJobb}>
            Nya jobb
          </a>
        </button>
        <button className={buttonStyle} id="MinaJobb" onClick={handleMinaJobb}>
          <StarIcon className={`mr-5 h-6 w-6  duration-300`} />
          <a className="hidden sm:block" id="MinaJobb" onClick={handleMinaJobb}>
            Favorit
          </a>
        </button>
        <button
          className={buttonStyle}
          id="CoachJobs"
          onClick={handleCoachJobs}
        >
          <TemplateIcon className={`mr-5 h-6 w-6  duration-300`} />
          <a
            className="hidden sm:block"
            id="CoachJobs"
            onClick={handleCoachJobs}
          >
            Mina jobb
          </a>
        </button>

        {/* <button
            className={buttonStyle}
            id="Collections"
            onClick={handleCollections}
          >
            <CollectionIcon
              className={`h-6 w-6 mr-5  duration-300`}
              id="Collections"
              onClick={handleCollections}
            />
            <a
              className="hidden sm:block"
              id="Collections"
              onClick={handleCollections}
            >
              Jobbsamlingar
            </a>
          </button>
          <button
            className={buttonStyle}
            id="ApplicationsArchive"
            onClick={handleArchive}
          >
            <ArchiveIcon
              className={`h-6 w-6 mr-5`}
              id="ApplicationsArchive"
              onClick={handleArchive}
            />
            <a
              className="hidden sm:block"
              id="ApplicationsArchive"
              onClick={handleArchive}
            >
              Arkiv
            </a>
          </button>
          <button className={buttonStyle} id="CV" onClick={handleCV}>
            <IdentificationIcon
              className="h-6 w-6 mr-5"
              id="CV"
              onClick={handleCV}
            />
            <a className="hidden sm:block" id="CV" onClick={handleCV}>
              CV
            </a>
          </button>
          <button className={buttonStyle} id="ToDo" onClick={handleToDo}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-5 hover:text-green-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              id="ToDo"
              onClick={handleToDo}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <a className="hidden sm:block">Att göra</a>
          </button> */}
        {/* <button className={buttonStyle}>
            <img
              src="https://arbetsformedlingen.se/webdav/files/logo/logo.svg"
              alt="AF"
              width={200}
              className="hidden sm:block"
            ></img>
            <Image
              src={AfAvatar}
              width={20}
              height={20}
              alt="AF"
              className="sm:hidden"
            ></Image>
          </button> */}
        <button className={buttonStyle} onClick={handleMyProfile}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-5 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <a className="hidden sm:block">{userInfo.username}</a>
        </button>
      </div>
      <div className=" relative w-screen">
        {components.map((comp) => {
          if (comp.name === currentComponent) {
            return (
              <div key={comp.name} className={` ${opacity} duration-1000`}>
                {React.createElement(comp, {
                  user: userInfo,
                  auth,
                  occuaptionCodes,
                  userOccupations,
                  setShowAddToFavorite,
                  showAddToFavorite,
                  showAdditionalButtons,
                  setShowAdditionalButtons,
                  notification,
                  setNotification,
                  favoritUpdated,
                  setFavoritUpdated,
                  compLayout,
                  companyInfo,
                })}
              </div>
            );
          }
        })}
      </div>
    </main>
  );
};

export default Coach;
