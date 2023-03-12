import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Layout/Navbar";

import { BACKEND_URI, FRONTEND_URI } from "../config";

export async function getStaticProps() {
  const res = await fetch(
    `${BACKEND_URI}/api/login-page?populate[0]=navbar&populate[1]=navbar.links&populate[2]=company_info.logo`
  );
  const contents = await res.json();

  return {
    props: {
      contents,
    },
  };
}

const Login = ({ contents, companyInfo }) => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState("hidden");
  const [showError, setShowError] = useState("hidden");
  const [showLoginButton, setShowLoginButton] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    let name = userName;
    let password = userPassword;

    try {
      setLoading("");
      setShowLoginButton("hidden");
      const res = await axios.post(`${FRONTEND_URI}/api/login`, {
        identifier: name,
        password: password,
      });

      /**TODO
       * Check if coach / participant --> route to minasidor or coach
       */
      if (res.status === 200) {
        const { role } = res.headers;
        router.push(`/mina-sidor/${role.toLowerCase()}`);
      }
    } catch (error) {
      setShowError("");
      setLoading("hidden");
      setShowLoginButton("");
    }
  };

  return (
    <main className="mx-auto h-full max-w-[100vw] overflow-x-hidden md:container ">
      <Navbar
        companyInfo={companyInfo}
        navbar={contents.data.attributes.navbar}
      />
      <section className="mx-auto mt-32 flex h-full place-items-center justify-center space-x-44 ">
        <div className="w-auto">
          <img
            className="lg:w-96"
            src={`${BACKEND_URI}${contents.data.attributes.company_info.logo.data.attributes.url}`}
            alt="Merit-Logo"
          ></img>
        </div>
        <div className="flex h-auto flex-col space-y-5 rounded-md bg-gray-50 p-10 shadow-md md:h-[550px] ">
          <div className={`${showError} text-red-500`}>
            Fel användarnamn eller lösenord
          </div>
          <form className="grid">
            <label htmlFor="userName" className="text-blue-600">
              Användarnamn
            </label>
            <input
              type="text"
              id="userName"
              className="mb-6 block h-8 w-64 rounded-md border px-1"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            ></input>
            <label htmlFor="password" className="text-blue-600 ">
              Lösenord
            </label>
            <input
              type="password"
              id="password"
              value={userPassword}
              autoComplete="current-password"
              onChange={(e) => setUserPassword(e.target.value)}
              className="block h-8 w-64 rounded-md border px-1"
            ></input>
            <div className="relative mt-10">
              <button
                className={`${showLoginButton}  w-full rounded-lg bg-yellow-400 px-6 py-2 text-gray-100 duration-500 hover:bg-indigo-200 hover:text-blue-500`}
                onClick={handleLogin}
              >
                {loading && <span>Logga in</span>}
              </button>

              <svg
                className={` absolute top-0 left-[50%] inline-block h-6 w-6 animate-spin text-indigo-600 ${loading}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login;
