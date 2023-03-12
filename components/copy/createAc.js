import {
  CheckIcon,
  ColorSwatchIcon,
  PlusCircleIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/outline";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { BACKEND_URI } from "../../config";

//const colors = ["pink", "yellow", "red", "sky", "green", "gray"];

const CreateActivity = ({
  addActivityDate,
  auth,
  user,
  setShowAddActivity,
  setAllActivities,
  editedActivity,
  setEditedActivity,
}) => {
  if (!editedActivity) {
    const { day, month, year, week, date } = addActivityDate;
  }

  const [activity, setActivity] = useState({
    day,
    month,
    year,
    week,
    date,
    user: user.id,
  });
  //const [editedActivity, setEditedActivity] = useState({});

  const handleAddActivity = () => {
    axios(`${BACKEND_URI}/api/schedules/create`, {
      method: "POST",
      headers: { Authorization: auth },
      data: { activity },
    })
      .then((res) => {
        setAllActivities(res.data);
        setShowAddActivity(false);
        setActivity({
          day,
          month,
          year,
          week,
          date,
          user: user.id,
        });
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateActivity = () => {
    axios(
      `${BACKEND_URI}/api/schedules/activities/update/${editedActivity.id}`,
      {
        method: "PUT",
        headers: { Authorization: auth },
        data: { editedActivity },
      }
    ).then((res) => {
      console.log(res);
      setAllActivities(res.data);
      setShowAddActivity(false);
    });
  };

  const handleDeleteActivity = () => {
    axios(
      `${BACKEND_URI}/api/schedules/activities/delete/${editedActivity.id}`,
      {
        method: "PUT",
        headers: { Authorization: auth },
        data: { editedActivity },
      }
    ).then((res) => {
      console.log(res);
      setAllActivities(res.data);
      setShowAddActivity(false);
    });
  };

  /* if (editedActivity) {
    useEffect(() => {
      axios(`${BACKEND_URI}/api/schedules/activities/${editedActivity}`, {
        method: "GET",
        headers: { Authorization: auth },
      }).then((res) => setEditedActivity(res.data));
    }, [editedActivity]);
  } */

  const handleOnChangeTitle = useCallback((e) => {
    if (editedActivity) {
      setEditedActivity((pre) => ({ ...pre, title: e.target.value }));
    } else {
      setActivity((pre) => ({ ...pre, title: e.target.value }));
    }
  });

  /*  const handleOnChangeColor = useCallback((e) => {
    if (editedActivity) {
      setEditedActivity((pre) => ({ ...pre, color: e.target.id }));
    } else {
      setActivity((pre) => ({ ...pre, color: e.target.id }));
    }
  }); */

  const handleOnChangeFrom_time = useCallback((e) => {
    if (editedActivity) {
      setEditedActivity((pre) => ({
        ...pre,
        from_time: `${e.target.value}:00`,
      }));
    } else {
      setActivity((pre) => ({ ...pre, from_time: e.target.value }));
    }
  });

  const handleOnChangeTo_time = useCallback((e) => {
    if (editedActivity) {
      setEditedActivity((pre) => ({ ...pre, to_time: `${e.target.value}:00` }));
    } else {
      setActivity((pre) => ({ ...pre, to_time: e.target.value }));
    }
  });

  const handleOnChangeDescription = useCallback((e) => {
    if (editedActivity) {
      setEditedActivity((pre) => ({ ...pre, description: e.target.value }));
    } else {
      setActivity((pre) => ({ ...pre, description: e.target.value }));
    }
  });

  return (
    <main className="absolute top-0 h-full w-full backdrop-blur-sm">
      <div
        className={`relative mx-auto h-full w-full  space-y-5 rounded-lg border border-indigo-500 bg-white p-10 shadow-md sm:mt-10 sm:h-auto sm:w-fit md:mt-0 `}
      >
        <h1 className="mb-10 text-xl">
          <span className={`w-6 `}>Lägg till aktivitet</span>{" "}
          <span>{/* (day, month, year, week) */}</span>
        </h1>
        <XIcon
          className="absolute top-0 left-[90%] h-6 w-6 text-red-600 duration-300 hover:scale-110 hover:cursor-pointer"
          onClick={() => {
            setEditedActivity(null);
            setShowAddActivity(false);
          }}
        />
        <label className="block">Rubrik:</label>
        <input
          type="text"
          value={editedActivity ? editedActivity.title : null}
          placeholder="Rubrik"
          className="w-full border-b-2 border-indigo-500 outline-none"
          onChange={handleOnChangeTitle}
        ></input>
        <div className="space-x-3">
          {/*   <label className="text-gray-400 ">
            <ColorSwatchIcon className="w-6 h-6 inline-block" /> Färg
          </label> */}
          {/*  {colors.map((color) => (
            <button
              type="checkbox"
              key={color}
              id={color}
              className={`rounded-full w-6 h-6 bg-${color}-500  `}
              onClick={handleOnChangeColor}
            ></button>
          ))} */}
        </div>
        {/* <input
          type="color"
          className="w-10 h-6 bg-white rounded-full ml-4 mt-4"
          onChange={(e) =>
            setActivity((pre) => ({ ...pre, color: e.target.value }))
          }
        ></input> */}
        <section className="gap-5 text-center sm:flex sm:flex-row ">
          <div className="">
            <label className="block">Från:</label>
            <input
              type="time"
              className="rounded-lg bg-gray-100 p-3"
              value={editedActivity ? editedActivity.from_time : null}
              onChange={handleOnChangeFrom_time}
            ></input>
          </div>
          <div className="">
            <label className="block">Till:</label>
            <input
              type="time"
              className="rounded-lg bg-gray-100 p-3"
              value={editedActivity ? editedActivity.to_time : null}
              onChange={handleOnChangeTo_time}
            ></input>
          </div>
        </section>
        <label className="block">Beskrivning</label>
        <textarea
          className="h-[150px] max-h-[200px] w-full rounded-lg bg-gray-100 px-2 py-1"
          value={editedActivity ? editedActivity.description : null}
          onChange={handleOnChangeDescription}
        ></textarea>
        <div className="flex flex-col justify-center gap-2 sm:flex-row sm:space-x-10">
          {!editedActivity && (
            <>
              <button
                className="rounded-lg bg-red-600 px-4 py-1 text-white "
                onClick={() => setShowAddActivity(false)}
              >
                Avbryt
                <XIcon className="ml-2 inline-block h-6 w-6" />
              </button>
              <button
                className="rounded-lg bg-indigo-600 px-4 py-1 text-white "
                onClick={handleAddActivity}
              >
                Lägg till
                <PlusCircleIcon className="ml-2 inline-block h-6 w-6" />
              </button>
            </>
          )}
          {editedActivity && (
            <>
              <button
                className="rounded-lg bg-red-600 px-4 py-1 text-white "
                onClick={handleDeleteActivity}
              >
                Radera
                <TrashIcon className="ml-2 inline-block h-6 w-6" />
              </button>
              <button
                className="rounded-lg bg-indigo-600 px-4 py-1 text-white "
                onClick={handleUpdateActivity}
              >
                Spara och stäng
                <CheckIcon className="ml-2 inline-block h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default CreateActivity;
