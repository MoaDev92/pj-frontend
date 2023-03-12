import { XIcon, ClipboardListIcon, TrashIcon } from "@heroicons/react/outline";
import { PlusCircleIcon, CalendarIcon } from "@heroicons/react/solid";
import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { BACKEND_URI } from "../../config";
//import PropTypes from "prop-types";

const ExpandedApplication = ({
  expandedApplicationId,
  setShowExpandApplication,
  auth,
  user,
  coach,
}) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentAdded, setCommentAdded] = useState(false);
  const [jobId, setJobId] = useState(0);

  useEffect(() => {
    axios(`${BACKEND_URI}/api/applications/${expandedApplicationId}`, {
      method: "GET",
      headers: {
        Authorization: auth,
      },
    }).then((res) => {
      console.log(res.data.comments);
      setComments(res.data.comments);
      setJobId(res.data.job.jobID);
    });
  }, [commentAdded]);

  const handleAddComment = () =>
    axios(`${BACKEND_URI}/api/applications/addComment`, {
      method: "PUT",
      data: {
        applicationId: expandedApplicationId,
        comment: {
          //user: { id: user.id },
          text: newComment,
          date: new Date(),
        },
      },
      headers: {
        Authorization: auth,
      },
    })
      .then((res) => {
        console.log(res.data);
        setCommentAdded(!commentAdded);
        setNewComment("");
      })
      .catch((err) => alert(`Somthing went wrong with comment`));

  const handleDeleteComment = (e) => {
    //if (!e.currentTarget.id) return;

    const commentId = e.currentTarget.id;
    //return console.log(commentId);

    axios(
      `${BACKEND_URI}/api/applications/deleteComment?a=${expandedApplicationId}&comment=${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: auth,
        },
      }
    )
      .then((res) => {
        setCommentAdded(!commentAdded);
        setNewComment("");
      })
      .catch((err) => alert(`Somthing went wrong with delete comment`));
  };

  return (
    <main className={`absolute top-0 h-full w-full bg-white `}>
      <XIcon
        className="float-right m-4 h-8 w-8 duration-500 hover:scale-150 hover:cursor-pointer"
        onClick={() => setShowExpandApplication(false)}
      />

      <div className="mx-auto flex w-fit justify-center rounded-md bg-indigo-400 p-2 text-white ">
        <ClipboardListIcon className="h-6 w-6 text-center" />
        <h1 className="text-center">
          Ansökans ID:
          {jobId}
        </h1>
      </div>

      <div className=" flex flex-col place-items-center p-10">
        <textarea
          className="mb-2 max-h-[200px] w-[50vw] rounded-md border p-4 "
          placeholder="Skriv kommentar här"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button
          className="block w-[50vw] rounded-md bg-indigo-600 px-3 py-1 text-xl text-white duration-300 hover:bg-sky-600 disabled:bg-gray-500 "
          id="Add comment"
          onClick={handleAddComment}
          disabled={newComment === "" ? true : false}
        >
          Lägg till kommentar
          <PlusCircleIcon className="ml-5 inline-block h-8 w-8" />
        </button>
      </div>
      <h1 className="text-center text-3xl font-bold text-black">Kommentarer</h1>
      {comments && (
        <div className="mx-auto grid max-h-[70vh] max-w-[60vw] grid-cols-1 gap-2 divide-y overflow-y-auto rounded-md border bg-gray-100 px-10 py-5">
          {comments.map((comment) => {
            return (
              <div
                key={comment.id}
                className="relative flex h-full w-full  gap-5 divide-x-2 bg-white p-5"
              >
                <div className="">
                  <h1 className="text-center">{comment.user.username}</h1>

                  <CalendarIcon className="mr-2 inline-block h-5 w-5 text-gray-400" />
                  {new Date(comment.date).toLocaleDateString()}
                </div>
                <div>
                  <p className="px-5"> {comment.text}</p>
                </div>
                <TrashIcon
                  className=" absolute right-2 h-6 w-6 text-red-600 hover:cursor-pointer"
                  onClick={handleDeleteComment}
                  id={comment.id}
                />
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

/* ExpandedApplication.propTypes = {
  comments: PropTypes.array.isRequired,
};
ExpandedApplication.defaultProps = {
  comments: [{ from: "B" }],
};
 */
export default ExpandedApplication;
