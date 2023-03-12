import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/outline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { BACKEND_URI } from "../config";
import { IoDiamond } from "react-icons/io5";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

export async function getStaticProps() {
  const resContents = await fetch(
    `${BACKEND_URI}/api/pricing-page?populate[0]=navbar&populate[1]=navbar.links&populate[2]=text_fields&populate[3]=plans&populate[4]=plans.features&populate[5]=plans.color&populate[6]=plans.icon&populate[7]=footer.color&populate[8]=footer.text_fields&populate[9]=footer.links`
  );
  const contents = await resContents.json();

  const { plans, navbar, footer } = contents.data.attributes;

  return {
    props: {
      plans,
      contents,
      navbar,
      footer,
    },
  };
}

const Pricing = ({ companyInfo, plans, contents, navbar, footer }) => {
  console.log(footer);
  return (
    <>
      <main className="min-h-screen  bg-white 2xl:px-72">
        <Navbar companyInfo={companyInfo} navbar={navbar} />
        <div className="grid grid-cols-1 text-center">
          <h1 className="text-6xl text-gray-500 mb-10">
            {contents.data.attributes.text_fields[0].text}
          </h1>
          <span className="text-xl  text-gray-400">
            {contents.data.attributes.text_fields[1].text}
          </span>
          <span className="text-xl  text-gray-400">
            {contents.data.attributes.text_fields[2].text}
          </span>
        </div>
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-5 px-10 py-16 text-white rounded-lg m-10">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="shadow-lg space-y-2  bg-gray-100 border text-center rounded-lg py-5 min-h-[350px]"
              style={{ color: `${plan.color.data.attributes.rgb}` }}
            >
              <img
                src={`${BACKEND_URI}${plan.icon.data.attributes.url}`}
                className="mx-auto w-16"
              ></img>
              <h1 className="h-16">
                <span className="text-xl underline  block uppercase tracking-widest font-bold opacity-50 ">
                  {plan.title}
                </span>
                <span className="block mx-auto font-Lora px-2 py-1 text-4xl font-bold w-fit rounded-xl">
                  {" "}
                  {plan.price}
                </span>
              </h1>
              <ul className="list-disc list-inside text-left p-5 ">
                {plan.features.map((feature) => (
                  <li key={feature.id} className="">
                    {feature.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        <div className="ml-20 text-gray-400 text-sm">
          <ul className="list-disc list-inside text-left p-5 ">
            {plans.map((plan) =>
              plan.features.map(
                (feature) =>
                  feature.description !== null && (
                    <li
                      key={feature.id}
                      style={{
                        color: `${plan.color.data.attributes.rgb}`,
                      }}
                    >
                      {feature.description}
                    </li>
                  )
              )
            )}
          </ul>
        </div>
      </main>
      <Footer footer={footer} companyInfo={companyInfo} />
    </>
  );
};

export default Pricing;
