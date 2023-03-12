import React, { useCallback, useContext, useRef } from "react";
import NyaJobb from "../../components/job/NyaJobb";
import MinaJobb from "../../components/job/MinaJobb";
import { useState } from "react";
import { BACKEND_URI, FRONTEND_URI } from "/config";
import axios from "axios";
import Welcome from "../../components/Welcome";
import MyProfile from "../../components/MyProfile";
import NavBarComp from "../../components/Layout/NavBarComp";
import Head from "next/head";
import MyParticipants from "../../components/coach/MyParticipants";
import CoachJobs from "../../components/coach/CoachJobs";
import Sidebar from "../../components/Layout/Sidebar";

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

  const res = await fetch(
    `${BACKEND_URI}/api/components-layout?populate[0]=navbar.color&populate[1]=navbar.links.icon&populate[2]=navbar.links.color&populate[3]=footer.links.color&populate[4]=footer.text_fields&populate[5]=navbar.buttons.icon&populate[6]=navbar.buttons.color`
  );
  const compLayoutJSON = await res.json();
  const compLayout = await compLayoutJSON.data.attributes;

  // <------------------------- get sidebar ------------------------->;
  const resSidebar = await fetch(
    `${BACKEND_URI}/api/coach-sidebar?populate[0]=buttons.color&populate[1]=buttons.icon`,
    {
      method: "GET",
      headers: {
        Authorization: auth,
      },
    }
  );
  const resSidebarJSON = await resSidebar.json();
  const sidebar = await resSidebarJSON.data.attributes;
  const { buttons } = sidebar;

  const sidebarButtons = buttons.map(
    (button) => (button = { ...button, isSelected: false })
  );

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
      auth,
      sidebarButtons,
    },
  };
}

const Coach = ({
  userInfo,
  userOccupations,
  occuaptionCodes,
  compLayout,
  companyInfo,
  auth,
  sidebarButtons,
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
  const [showAddToFavorite, setShowAddToFavorite] = useState(true);
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);

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
        <Sidebar
          sidebarButtons={sidebarButtons}
          userInfo={userInfo}
          setCurrentComponent={setCurrentComponent}
          setOpacity={setOpacity}
          setShowAdditionalButtons={setShowAdditionalButtons}
        />
        <div className=" relative h-screen w-screen">
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
    </>
  );
};

export default Coach;
