import React from "react";
import Link from "next/link";
import { IoDiamond } from "react-icons/io5";
import Head from "next/head";
import axios from "axios";
import { FRONTEND_URI } from "../config";
import { useRouter } from "next/router";

const NavBar = () => {
  const router = useRouter();
  const handleLogOut = () => {
    axios.post(`${FRONTEND_URI}/api/logout`);
    router.push("/login");
  };

  return (
    <nav className=" flex h-12 w-full place-items-center bg-gray-100 print:hidden ">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Gwendolyn&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className=" ml-4 text-2xl">
        <h1>
          <span className="text-Black font-Gwendolyn text-3xl">Merit</span>
          <span className="text-yellow-400 ">Premium</span>
          <span className=" inline-block font-bold text-cyan-400">
            <IoDiamond />
          </span>
        </h1>
      </div>
      <div className="mx-auto mr-3 space-x-6 ">
        <Link href="#">
          <button className="flex space-x-1" onClick={handleLogOut}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
