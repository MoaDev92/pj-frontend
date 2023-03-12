import {
  ArrowsExpandIcon,
  DocumentIcon,
  DocumentTextIcon,
  PencilAltIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { ArrowNarrowLeftIcon } from "@heroicons/react/solid";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BACKEND_URI } from "../../config";
import CreateCV from "./CreateCV";
import PreviewCv from "./PreviewCv";

const CV = ({
  auth,
  user,
  showAdditionalButtons,
  setShowAdditionalButtons,
  setShowParticipantCVList,
}) => {
  // user here is refer to the the user object and the particpant id when the coach select a paticipant.
  // user from viewParticipant is the choosen paticipants id and not the current user id
  // show additonal button is to show buttons only for coach

  const [myCvs, setMyCvs] = useState([]);
  const [showCreateCV, setShowCreateCV] = useState(false);
  const [showPreviewCV, setShowPreviewCV] = useState(false);
  const [cvId, setCvId] = useState(null);
  const [editedCVId, setEditedCVId] = useState(null);
  const [cvsUpdated, setCvsUpdated] = useState(false);

  const handleDeleteCv = useCallback((e) => {
    const deletedCvId = e.currentTarget.id;

    const deleteCV = () => {
      axios
        .delete(`${BACKEND_URI}/api/cvs/${deletedCvId}`, {
          headers: { Authorization: auth },
        })
        .then((res) => {
          setCvsUpdated(!cvsUpdated);
          toast.success("cv har raderats!");
        })
        .catch((err) => toast.error(err.message));
    };

    toast.warning(
      <div className="w-full p-5">
        <h1 className="text-md w-full text-red-600">
          Är du säker på att du vill radera ditt cv?
        </h1>
        <button
          className="mx-auto mt-2 rounded-lg bg-indigo-500 px-5 py-1 text-white"
          onClick={deleteCV}
        >
          Ja
        </button>
      </div>,
      {
        position: "top-center",
        className: "min-w-fit border-2 border-yellow-500",
        autoClose: false,
      }
    );
  });

  useEffect(() => {
    axios
      .get(
        `${BACKEND_URI}/api/cvs?populate=*&filters[user][id][$eq]=${user.id}`,
        { headers: { Authorization: auth } }
      )
      .then((res) => {
        setMyCvs((myCvs = res.data.data));
        console.log(myCvs);
      })
      .catch((err) => console.log(err));
  }, [cvsUpdated]);

  return (
    <main className="relative h-full w-full ">
      <header className="flex p-5">
        <h1 className="mt-2 block text-2xl">
          Mina CV{" "}
          <span className="block text-base text-gray-500">
            {myCvs.length} cv
          </span>
        </h1>
        {showAdditionalButtons && (
          <button
            className="absolute top-0 inline-flex text-blue-500"
            onClick={() => {
              setShowParticipantCVList(false);
              setShowAdditionalButtons(false);
            }}
          >
            <ArrowNarrowLeftIcon className="inline-block h-6 w-6" />
            Tillbaka
          </button>
        )}

        {!showAdditionalButtons && (
          <button
            className="ml-auto mt-2 mr-2 rounded-lg bg-indigo-500  px-4 text-white duration-300 hover:bg-indigo-400"
            onClick={() => setShowCreateCV(true)}
          >
            Skapa nytt CV
          </button>
        )}
      </header>

      <div className="p-5">
        <div className="h-[70vh] max-h-[70vh] overflow-y-auto bg-gray-100 p-3">
          {myCvs.map((cv) => (
            <div
              key={cv.id}
              className="rounded-lg border border-l-4 border-l-indigo-700 bg-white p-4 text-indigo-700"
            >
              <DocumentTextIcon className="mr-2 inline-block h-6 w-6" />
              {cv.attributes.title}
              <ArrowsExpandIcon
                className="float-right h-6 w-6 duration-300 hover:scale-125 hover:cursor-pointer"
                id={cv.id}
                onClick={(e) => {
                  setCvId(e.currentTarget.id);
                  setShowPreviewCV(true);
                }}
              />
              <PencilAltIcon
                className="float-right mr-5 h-6 w-6 duration-300 hover:scale-125 hover:cursor-pointer"
                id={cv.id}
                onClick={(e) => {
                  setEditedCVId(e.currentTarget.id);
                  setShowCreateCV(true);
                }}
              />
              <TrashIcon
                className="float-right mr-5 h-6 w-6 duration-300 hover:scale-125 hover:cursor-pointer"
                id={cv.id}
                onClick={handleDeleteCv}
              />
            </div>
          ))}
        </div>
      </div>
      {showCreateCV && (
        <CreateCV
          setShowCreateCV={setShowCreateCV}
          auth={auth}
          user={user}
          editedCVId={editedCVId}
          setEditedCVId={setEditedCVId}
          setCvsUpdated={setCvsUpdated}
          cvsUpdated={cvsUpdated}
        />
      )}
      {showPreviewCV && (
        <PreviewCv
          setShowPreviewCV={setShowPreviewCV}
          auth={auth}
          user={user}
          cvId={cvId}
        />
      )}
    </main>
  );
};

export default CV;
