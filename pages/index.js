import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import Footer from "../components/Layout/Footer";
import Layout from "../components/Layout";
import { IoDiamond } from "react-icons/io5";
import { RiDoubleQuotesL } from "react-icons/ri";
import Link from "next/link";
import axios from "axios";
import { BACKEND_URI } from "../config";
import { toast } from "react-toastify";
import {
  BriefcaseIcon,
  CogIcon,
  MenuIcon,
  XIcon,
} from "@heroicons/react/outline";
import PropTypes from "prop-types";
import Navbar from "../components/Layout/Navbar";

export async function getStaticProps() {
  const res = await fetch(
    `${BACKEND_URI}/api/home-page?populate[0]=navbar&populate[1]=navbar.links&populate[2]=text_fields&populate[3]=footer&populate[4]=footer.links&populate[5]=footer.color&populate[6]=professionsIcons`
  );
  const contents = await res.json();

  const { text_fields, navbar, footer, professionsIcons } =
    contents.data.attributes;

  return {
    props: {
      text_fields,
      navbar,
      footer,
      contents,
      professionsIcons,
    },
  };
}

const Home = ({
  companyInfo,
  text_fields,
  navbar,
  footer,
  professionsIcons,
}) => {
  return (
    <>
      <Head>
        <title> {companyInfo.name} Premium</title>
        <link rel="icon" href="/meritAvatar.JPG" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gwendolyn&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&family=IBM+Plex+Sans:ital,wght@1,700&family=Indie+Flower&family=Lora:ital@1&family=Oooh+Baby&family=Roboto:wght@300&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <section className=" container relative mx-auto min-h-screen bg-white">
        {/*   {professionsIcons.map((icon) => (
          <span
            key={icon.id}
            className={`${icon.text} w-32 text-6xl opacity-20 duration-300 sm:text-7xl 2xl:text-9xl `}
          >
            {icon.title}
          </span>
        ))} */}
        <Navbar companyInfo={companyInfo} navbar={navbar} />
        <div className="relative grid grid-cols-1">
          <h1 className="mx-auto w-[70vw] space-y-3 p-10 text-center  2xl:w-[50vw]">
            <span className="font-IBM whitespace-pre-wrap text-3xl font-extrabold text-indigo-500 md:text-7xl 2xl:text-9xl  ">
              {text_fields[0].text}
            </span>
          </h1>
          <p className="mx-auto w-[80vw] space-y-3 p-10 text-center  2xl:w-[50vw]">
            <span className=" font-Lora text-md block text-cyan-500 sm:text-xl lg:text-4xl">
              {text_fields[1].text}
              {/*  <RiDoubleQuotesL className='absolute -top-5 opacity-50 left-[5%] w-10 h-10'/> */}
            </span>
            <span className="mx-auto block w-fit whitespace-pre-wrap text-left text-zinc-400">
              {text_fields[2].text}
            </span>
          </p>
          <Link href="/help">
            <a className="place-self-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-10 py-5 text-white duration-300 hover:scale-110 hover:text-gray-600 ">
              Lär dig mer!
            </a>
          </Link>
          <CogIcon className="absolute bottom-10 left-[30%] w-24 text-cyan-400 opacity-20" />
          <span className="bottom-25 absolute left-[20%] w-32 text-9xl opacity-20 ">
            🔧
          </span>
          <span className="absolute -bottom-10 left-[50%] w-32 text-9xl opacity-20 ">
            ⚙️
          </span>
          <BriefcaseIcon className="top-25 absolute right-[20%] w-32 text-indigo-400 opacity-20" />
        </div>
        <span className=" absolute top-[30%] left-[3%] w-32 text-6xl opacity-20 sm:text-7xl 2xl:text-9xl ">
          👷‍♂️
        </span>
        <span className=" absolute top-[30%] right-[10%] w-32 text-6xl opacity-20 sm:text-7xl 2xl:text-9xl ">
          👩‍🍳
        </span>
        <span className="absolute bottom-0 left-[80%] w-32 text-6xl opacity-20 sm:text-7xl 2xl:text-9xl ">
          👩‍⚕️
        </span>
        <span className=" absolute bottom-0 left-[20%] w-32 text-6xl opacity-20 sm:text-7xl 2xl:text-9xl ">
          👨‍🏫
        </span>
        <span className="bottom-35  absolute left-[20%] w-32 text-6xl opacity-20 duration-300 sm:text-7xl 2xl:text-9xl ">
          👩‍🚒
        </span>

        {/* <div className="grid grid-cols-1 place-items-center gap-5 mt-10 sm:flex flex-row space-x-5 sm:place-content-center bg-gray-100 p-10">
            {contents.features.map((feature) => (
              <img
                key={feature.id}
                src={`${BACKEND_URI}${feature.icon.url}`}
                alt="AF"
                className="w-auto"
              ></img>
            ))}
          </div> */}
      </section>
      <Footer footer={footer} companyInfo={companyInfo} />
    </>
  );
};

Home.protoTypes = {
  text_fields: PropTypes.array.isRequired,
};

export default Home;
