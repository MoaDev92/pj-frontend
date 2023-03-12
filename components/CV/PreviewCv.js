import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_URI } from "../../config";
import PropTypes from "prop-types";
import { FaCaretLeft } from "react-icons/fa";

import {
  AcademicCapIcon,
  DocumentIcon,
  PrinterIcon,
  XIcon,
  DeviceMobileIcon,
  LocationMarkerIcon,
  MailIcon,
  BriefcaseIcon,
  TranslateIcon,
} from "@heroicons/react/outline";
import { toast } from "react-toastify";

const PreviewCv = ({ user, auth, cvId, setShowPreviewCV }) => {
  const [cv, setCv] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URI}/api/cvs/${cvId}?populate=*`, {
        headers: { Authorization: auth },
      })
      .then((res) => {
        setCv((cv = [res.data.data]));
      });
  }, [cvId]);

  return (
    <main
      className="bg-whit absolute top-0 h-full w-full  bg-white text-gray-500"
      id="cv"
      //style={{ color: `${fooColor}` }}
    >
      {cv.map((c) => (
        <div key={c.id}>
          <header className="flex flex-row">
            {c.attributes.photo.data !== null ? (
              <img
                src={`${BACKEND_URI}${c.attributes.photo.data.attributes.url}`}
                width={150}
                alt="Photo"
                //className="bg-indigo-100 ml-2 p-5 rounded-tl-3xl rounded-br-3xl"
                className="ml-2 w-[150px] rounded-full "
                onError={(err) => <div>hi</div>}
              ></img>
            ) : (
              ""
            )}

            <h1 className=" mx-auto mt-10 text-6xl font-bold uppercase tracking-widest">
              {c.attributes.user.data.attributes.username}
              <span className=" mx-auto block text-2xl font-normal uppercase tracking-widest">
                {c.attributes.title}
              </span>
            </h1>
            <PrinterIcon
              className="m-2 h-8 w-8 text-gray-600 duration-300 hover:scale-125 hover:cursor-pointer print:hidden"
              onClick={() => window.print()}
            />
            <XIcon
              className="m-2 h-8 w-8 text-red-600 duration-300 hover:scale-125 hover:cursor-pointer print:hidden"
              onClick={() => setShowPreviewCV(false)}
            />
          </header>
          <div className=" mt-5 grid w-full grid-cols-3 place-items-center border-t-2 border-b-2">
            <span className="flex">
              <DeviceMobileIcon className="h-6 w-6" /> {c.attributes.mobile}
            </span>
            <span className="flex">
              <MailIcon className="mr-2 h-6 w-6" />{" "}
              {c.attributes.user.data.attributes.email}
            </span>{" "}
            <span className="flex">
              <LocationMarkerIcon className="h-6 w-6" />
              {c.attributes.address}
            </span>
          </div>
          <section className=" mt-5 grid grid-cols-3 divide-x-2">
            <article className="">
              <h3 className="text-center font-bold uppercase">
                Sammanfattning
                <FaCaretLeft className="float-right h-6 w-6" />
              </h3>
              <p className="p-5 text-sm">{c.attributes.summary}</p>
              <h3 className=" text-center font-bold uppercase">
                Språk
                <FaCaretLeft className="float-right h-6 w-6" />
              </h3>

              {c.attributes.languages.map((language) => (
                <div key={language.id} className="p-3">
                  <h1 className="flex text-lg">
                    <TranslateIcon className="mr-2 h-6 w-6" />
                    <span className=" block font-normal italic">
                      <span className="block font-bold not-italic">
                        {language.title}
                      </span>
                      {`${language.level}
                       `}
                    </span>
                  </h1>
                </div>
              ))}
              <h3 className="mt-5 text-center font-bold uppercase">
                Referenser
                <FaCaretLeft className="float-right h-6 w-6" />
              </h3>
              {c.attributes.references.map((reference) => (
                <div key={reference.id} className="p-5">
                  <h1 className="flex text-lg">
                    {/*  <TranslateIcon className="w-6 h-6 mr-2" /> */}
                    <span className=" block font-normal italic">
                      <span className="block font-bold not-italic">
                        {reference.name}
                      </span>
                      {`${reference.email} - ${reference.mobile}
                       `}
                    </span>
                  </h1>
                </div>
              ))}
              <h3 className="mt-5 text-center font-bold uppercase">
                Andra erfarenheter
                <FaCaretLeft className="float-right h-6 w-6" />
              </h3>
              <div key={c.attributes.other} className="p-5">
                <h1 className="flex text-lg">
                  <span className=" block whitespace-pre-wrap font-normal italic">
                    {c.attributes.other}
                  </span>
                </h1>
              </div>
            </article>
            <article className="col-span-2">
              <h3 className="text-center font-bold uppercase">
                arbetslivserfarenheter
              </h3>
              {c.attributes.experiences.map((experience) => (
                <div key={experience.id} className="p-5">
                  <h1 className="flex text-lg">
                    <BriefcaseIcon className="mr-2 h-6 w-6" />
                    <span className=" block font-normal italic">
                      <span className="block font-bold not-italic">
                        {experience.title}
                      </span>

                      {`${experience.place} (${experience.from_date} - 
                        ${experience.to_date})`}
                    </span>
                  </h1>
                  <p className=" whitespace-pre-wrap p-5">
                    {experience.description}
                  </p>
                </div>
              ))}

              <h3 className="text-center font-bold uppercase">Utbildning</h3>

              {c.attributes.educations.map((education) => (
                <div key={education.id} className="p-5">
                  <h1 className="flex text-lg">
                    <AcademicCapIcon className="mr-2 h-6 w-6" />
                    <span className=" block font-normal italic">
                      <span className="block font-bold not-italic">
                        {education.title}
                      </span>

                      {`(${education.from_date} - 
                        ${education.to_date})`}
                    </span>
                  </h1>
                </div>
              ))}
            </article>
          </section>
        </div>
      ))}
    </main>
  );
};

/* PreviewCv.propTypes = {
  children: PropTypes.element.isRequired,
}; */

export default PreviewCv;
