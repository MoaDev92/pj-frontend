import React from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { BACKEND_URI } from "../config";

export async function getStaticProps() {
  const resContents = await fetch(
    `${BACKEND_URI}/api/help-page?populate[0]=navbar&populate[1]=navbar.links&populate[2]=questions&populate[3]=questions.color&populate[4]=footer.color&populate[5]=footer.text_fields&populate[6]=footer.links&populate[7]=text_fields`
  );
  const contents = await resContents.json();

  const { questions, navbar, footer, text_fields } = contents.data.attributes;

  return {
    props: {
      questions,
      contents,
      navbar,
      footer,
      text_fields,
    },
  };
}

const Help = ({
  companyInfo,
  questions,
  contents,
  navbar,
  footer,
  text_fields,
}) => {
  return (
    <>
      <section className="2xl:px-72">
        <Navbar navbar={navbar} companyInfo={companyInfo} />
        <h1 className="mx-auto w-[70vw] text-center  2xl:w-[50vw]">
          <span className="mb-10 text-6xl text-gray-500">
            {text_fields[0].text}
          </span>
        </h1>
        <p className="mx-auto w-[80vw] space-y-3 p-10 text-center  2xl:w-[50vw]">
          <span className=" text-md sm:text-md block text-indigo-500 lg:text-4xl">
            {text_fields[1].text}
          </span>
        </p>
      </section>
      <section className="h-auto min-h-screen 2xl:px-72">
        <div className="grid grid-cols-1 place-items-center gap-3 ">
          {questions.map((question) => (
            <details
              key={question.id}
              id={question.id}
              className=" w-[50%] cursor-pointer rounded-lg bg-indigo-50 p-4 text-indigo-500 shadow-lg duration-500 open:border open:bg-indigo-500 open:text-white"
            >
              <summary className="whitespace-pre-wrap p-2 font-bold   ">
                {question.question}
              </summary>
              <div>
                <p className="whitespace-pre-wrap selection:bg-pink-400 ">
                  {question.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>
      <Footer footer={footer} companyInfo={companyInfo} />
    </>
  );
};

export default Help;
