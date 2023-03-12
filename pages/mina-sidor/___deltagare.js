import React, { useCallback, useContext, useRef } from "react";
import NyaJobb from "../../components/job/NyaJobb";
import MinaJobb from "../../components/job/MinaJobb";
import { useEffect, useState } from "react";
import { BACKEND_URI, FRONTEND_URI, THEME_TEXT_COLOR } from "/config";
import axios from "axios";
import Welcome from "../../components/Welcome";
import Layout from "../../components/Layout";
import JobApplications from "../../components/jobApplications/JobApplications";
import MyProfile from "../../components/MyProfile";
import Image from "next/image";
import AfAvatar from "../../public/AF.png";
import ToDo from "../../components/ToDo/ToDo";
import {
  ArchiveIcon,
  CollectionIcon,
  PaperAirplaneIcon,
  IdentificationIcon,
  BriefcaseIcon,
  TemplateIcon,
} from "@heroicons/react/outline";
import ApplicationsArchive from "../../components/jobApplications/ApplicationsArchive";
import Collections from "../../components/collection/Collections";
import CV from "../../components/CV/CV";
import { UserCircleIcon } from "@heroicons/react/solid";
import NavBarComp from "../../components/Layout/NavBarComp";
import Head from "next/head";

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

  if (role !== "Deltagare") {
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

  const res = await fetch(
    `${BACKEND_URI}/api/components-layout?populate[0]=navbar.color&populate[1]=navbar.links.icon&populate[2]=navbar.links.color&populate[3]=footer.links.color&populate[4]=footer.text_fields&populate[5]=navbar.buttons.icon&populate[6]=navbar.buttons.color`
  );
  const compLayoutJSON = await res.json();
  const compLayout = await compLayoutJSON.data.attributes;

  // <------------------------- get sidebar ------------------------->;
  const resSidebar = await fetch(
    `${BACKEND_URI}/api/participant-sidebar?populate[0]=buttons.color&populate[1]=buttons.icon`,
    {
      method: "GET",
      headers: {
        Authorization: auth,
      },
    }
  );
  const resSidebarJSON = await resSidebar.json();
  const sidebar = await resSidebarJSON.data.attributes;

  if (!userInfo) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      token,
      userInfo,
      userOccupations,
      occuaptionCodes,
      compLayout,
      sidebar,
    },
  };
}

const Deltagare = ({
  token,
  userInfo,
  favoriteJobs,
  userOccupations,
  occuaptionCodes,
  compLayout,
  companyInfo,
  sidebar,
}) => {
  console.log(sidebar);
  const components = [
    Welcome,
    MyProfile,
    MinaJobb,
    NyaJobb,
    JobApplications,
    ToDo,
    ApplicationsArchive,
    Collections,
    CV,
  ];
  const [favoritUpdated, setFavoritUpdated] = useState(false);
  const [currentComponent, setCurrentComponent] = useState("MyProfile");
  const [opacity, setOpacity] = useState("");
  const [rotateIcone, setRotateApplicationIcone] = useState("");
  const [showAddToFavorite, setShowAddToFavorite] = useState(true);
  const [showArchive, setShowArchive] = useState(false);
  const [applicationUpdated, setApplicationUpdated] = useState(false);
  const [showList, setShowList] = useState(true);

  const auth = `Bearer ${token.split("=")[1]}`;

  /* const handleNyaJobb = useCallback((e) => {
    setOpacity((opacity = "opacity-25"));
    setRotateApplicationIcone("");
    setShowList(true);
    setTimeout(() => {
      setOpacity(" opacity-100 ");
    }, 100);
    setCurrentComponent((currentComponent = e.currentTarget.id));
    e.preventDefault();
  }, []);

  const handleMinaJobb = useCallback((e) => {
    setOpacity((opacity = "opacity-25"));
    setRotateApplicationIcone("");
    e.preventDefault();
    setShowList(true);
    setCurrentComponent((currentComponent = e.currentTarget.id));
    setTimeout(() => {
      setOpacity(" opacity-100 ");
    }, 100);
  }, []);

  const handleJobbAnsokningar = useCallback((e) => {
    setOpacity((opacity = "opacity-25"));
    setRotateApplicationIcone("rotate-90");
    setCurrentComponent((currentComponent = e.currentTarget.id));
    e.preventDefault();
    setShowList(true);
    setTimeout(() => {
      setOpacity(" opacity-100 ");
    }, 100);
  }, []);

  const handleArchive = useCallback((e) => {
    setOpacity((opacity = "opacity-25"));
    setRotateApplicationIcone("");
    setCurrentComponent((currentComponent = e.currentTarget.id));
    e.preventDefault();
    setShowList(true);
    setTimeout(() => {
      setOpacity(" opacity-100 ");
    }, 100);
  }, []);

  const handleCV = useCallback((e) => {
    setOpacity((opacity = "opacity-25"));
    setRotateApplicationIcone("");
    setCurrentComponent((currentComponent = e.currentTarget.id));
    e.preventDefault();
    setShowList(true);
    setTimeout(() => {
      setOpacity(" opacity-100 ");
    }, 100);
  }, []);

  const handleToDo = useCallback((e) => {
    e.preventDefault();
    setRotateApplicationIcone("");
    setShowList(false);
    setCurrentComponent((currentComponent = e.currentTarget.id));
  }, []);

  const handleMyProfile = useCallback(() => {
    setRotateApplicationIcone("");
    setShowList(true);
    setCurrentComponent((currentComponent = "MyProfile"));
  }, []);

  const handleCollections = useCallback(() => {
    setOpacity((opacity = "opacity-25"));
    setRotateApplicationIcone("");
    setShowList(true);
    setCurrentComponent((currentComponent = "Collections"));
    setTimeout(() => {
      setOpacity(" opacity-100 ");
    }, 100);
  }, []);
   */

  //const handleChooseComp = useCallback((e) => {},[]);

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Gwendolyn&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed&family=Fira+Sans+Extra+Condensed:ital,wght@0,300;1,300&family=Fira+Sans:wght@300&family=Gwendolyn&family=Pacifico&family=Rubik:wght@300&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <NavBarComp compLayout={compLayout} companyInfo={companyInfo} />
      <main className="flex h-full ">
        <div className={` h-auto bg-gray-50  print:hidden`}>
          {sidebar.buttons.map((button) => {
            return (
              <button
                style={{ color: `${button.color.data.attributes.rgb}` }}
                className="mr-2 flex w-full p-5 text-sm duration-300 hover:bg-indigo-200 active:bg-blue-600"
                id={button.onClick}
                onClick={(e) => {
                  setCurrentComponent(e.currentTarget.id);
                  setOpacity((opacity = "opacity-25"));
                  setTimeout(() => {
                    setOpacity(" opacity-100 ");
                  }, 100);
                }}
                key={button.id}
              >
                <img
                  src={`${BACKEND_URI}${button.icon.data.attributes.url}`}
                  className="mr-2 w-5"
                ></img>
                {button.label}
                {console.log(button.color.data)}
              </button>
            );
          })}
          {/* <button className={buttonStyle} id="NyaJobb" onClick={handleNyaJobb}>
            <BriefcaseIcon
              className="mr-5 h-6 w-6 "
              id="NyaJobb"
              onClick={handleNyaJobb}
            />
            {showList && (
              <span
                className="hidden sm:block"
                id="NyaJobb"
                onClick={handleNyaJobb}
              >
                Nya jobb
              </span>
            )}
          </button>
          <button
            className={buttonStyle}
            id="MinaJobb"
            onClick={handleMinaJobb}
          >
            <TemplateIcon
              id="MinaJobb"
              onClick={handleMinaJobb}
              className="mr-5 h-6 w-6"
            />
            {showList && (
              <span
                className="hidden sm:block"
                id="MinaJobb"
                onClick={handleMinaJobb}
              >
                Mina jobb
              </span>
            )}
          </button>
          <button
            className={buttonStyle}
            id="JobApplications"
            onClick={handleJobbAnsokningar}
          >
            <PaperAirplaneIcon
              className={`mr-5 h-6 w-6 ${rotateIcone} duration-300`}
              id="JobApplications"
              onClick={handleJobbAnsokningar}
            />
            {showList && (
              <span
                className="hidden sm:block"
                id="JobApplications"
                onClick={handleJobbAnsokningar}
              >
                Jobbansökningar
              </span>
            )}
          </button>
          <button
            className={buttonStyle}
            id="Collections"
            onClick={handleCollections}
          >
            <CollectionIcon
              className={`mr-5 h-6 w-6  duration-300`}
              id="Collections"
              onClick={handleCollections}
            />
            {showList && (
              <span
                className="hidden sm:block"
                id="Collections"
                onClick={handleCollections}
              >
                Jobbsamlingar
              </span>
            )}
          </button>
          <button
            className={buttonStyle}
            id="ApplicationsArchive"
            onClick={handleArchive}
          >
            <ArchiveIcon
              className={`mr-5 h-6 w-6`}
              id="ApplicationsArchive"
              onClick={handleArchive}
            />
            {showList && (
              <span
                className="hidden sm:block"
                id="ApplicationsArchive"
                onClick={handleArchive}
              >
                Arkiv
              </span>
            )}
          </button>
          <button className={buttonStyle} id="CV" onClick={handleCV}>
            <IdentificationIcon
              className="mr-5 h-6 w-6"
              id="CV"
              onClick={handleCV}
            />
            {showList && (
              <span className="hidden sm:block" id="CV" onClick={handleCV}>
                CV
              </span>
            )}
          </button>
          <button className={buttonStyle} id="ToDo" onClick={handleToDo}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-5 h-6 w-6 hover:text-green-300"
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
            {showList && <span className="hidden sm:block">Att göra</span>}
          </button>
          <button className={buttonStyle}>
            {showList && (
              <img
                src="https://arbetsformedlingen.se/webdav/files/logo/logo.svg"
                alt="AF"
                width={200}
                className="hidden sm:block"
              ></img>
            )}
            <Image
              src={AfAvatar}
              width={20}
              height={20}
              alt="AF"
              className="sm:hidden"
            ></Image>
          </button>
          <button className={buttonStyle} onClick={handleMyProfile}>
            <UserCircleIcon className="mr-5 h-6 w-6" />
            {showList && (
              <span className="hidden sm:block">{userInfo.username}</span>
            )}
          </button> */}
        </div>
        <div className=" relative h-screen w-screen">
          {components.map((comp) => {
            if (comp.name === currentComponent) {
              console.log(comp.name);
              return (
                <div key={comp.name} className={` ${opacity} duration-1000`}>
                  {React.createElement(comp, {
                    user: userInfo,
                    occuaptions: userOccupations,
                    favoriteJobs,
                    auth,
                    favoritUpdated,
                    setFavoritUpdated,
                    setShowAddToFavorite,
                    showAddToFavorite,
                    showArchive,
                    setShowArchive,
                    setApplicationUpdated,
                    applicationUpdated,
                    occuaptionCodes,
                    companyInfo,
                  })}
                </div>
              );
            }
          })}
        </div>
      </main>
    </>
  );
};

export default Deltagare;
