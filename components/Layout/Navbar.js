import React from "react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { IoDiamond } from "react-icons/io5";
import PropTypes from "prop-types";
import Head from "next/head";

const Navbar = ({ companyInfo, navbar }) => {
  const [showNav, setShowNav] = useState(false);

  /* const handleShowNav = useCallback(() => {
    setShowNav("-translate-x-[12%]");
  });
  const handleHiedeNav = useCallback(() => {
    setShowNav("translate-x-[100%]");
  }); */
  return (
    <nav className=" p-8 sm:p-10">
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
      <div className=" ml-4 flex text-2xl">
        <h1 className="text-center text-4xl">
          <span className="text-Black font-Gwendolyn text-3xl font-extrabold text-indigo-600">
            {companyInfo.name}
          </span>
          <span className="text-yellow-400 ">Premium</span>
          <span className=" inline-block font-bold text-cyan-400">
            <IoDiamond />
          </span>
        </h1>
        <ul
          className={`font-FiraSansCondensed ml-auto hidden flex-row space-x-10 text-base font-extralight sm:flex`}
        >
          {navbar.links.map((link) => (
            <li key={link.id}>
              <Link href={link.url}>
                <a className="rounded-lg p-2 duration-300 hover:bg-indigo-500 hover:text-white hover:underline hover:decoration-yellow-400">
                  {link.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
        <MenuIcon
          className="ml-5  h-8 w-8 text-indigo-500 sm:hidden"
          onClick={() => setShowNav(true)}
        />
        {showNav && (
          <ul
            className={`text-md absolute top-24 h-full w-full space-y-10 text-center sm:hidden ${showNav} bg-white   font-extralight duration-300`}
          >
            <XIcon
              className="float-right  ml-5 mr-5 h-8 w-8 text-indigo-500 sm:hidden"
              onClick={() => setShowNav(false)}
            />
            {navbar.links.map((link) => (
              <li key={link.id}>
                <Link href={link.url}>
                  <a className="">{link.label}</a>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
