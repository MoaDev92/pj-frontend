import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BACKEND_URI } from "../config";

function MyApp({ Component, pageProps }) {
  const [companyInfo, setCompanyInfo] = useState({});
  //const [compLayout, setCompLayout] = useState({});

  useEffect(() => {
    axios
      .get(`${BACKEND_URI}/api/company?populate[company][populate]=%2A`)
      .then((res) => {
        setCompanyInfo((pre) => res.data.data.attributes.company[0]);
      })
      .catch((err) => toast.error(err.message));

    /*  axios
      .get(
        `${BACKEND_URI}/api/components-layout?populate[0]=navbar.color&populate[1]=navbar.links.icon&populate[2]=navbar.links.color&populate[3]=footer.links.color&populate[4]=footer.text_fields`
      )
      .then((res) => {
        setCompLayout((pre) => res.data.data.attributes);
      })
      .catch((err) => toast.error(err.message)); */
  }, []);

  return (
    <>
      <Component {...pageProps} companyInfo={companyInfo} />
      <ToastContainer />
    </>
  );
}

export default MyApp;
