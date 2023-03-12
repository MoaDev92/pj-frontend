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
import { toast } from "react-toastify";
import { BACKEND_URI } from "../../config";

const CreateActivity = ({
  auth,
  user,
  setShowAddActivity,
  activityObject,
  setActivityObject,
  setAllActivities,
  //colors,
}) => {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    axios(`${BACKEND_URI}/api/colors`, {
      method: "GET",
      headers: { Authorization: auth },
    }).then((res) => {
      let firstColorsCol = [];
      for (let index = 0; index <= 6; index++) {
        const color = res.data.data[index];
        firstColorsCol.push(color);
      }
      setColors(firstColorsCol);
    });
  }, []);

  const handleAddActivity = () => {
    axios(`${BACKEND_URI}/api/schedules/create`, {
      method: "POST",
      headers: { Authorization: auth },
      data: { activity: activityObject },
    })
      .then((res) => {
        const { activitesWithCustomColors, scheduleId } = res.data;
        //return console.log(res);
        setAllActivities(activitesWithCustomColors);
        setShowAddActivity(false);
        setActivityObject({ scheduleId });
      })
      .catch((err) => toast.error(err.message));
  };

  const handleUpdateActivity = () => {
    console.log(activityObject);
    axios(
      `${BACKEND_URI}/api/schedules/activities/update/${activityObject.id}`,
      {
        method: "PUT",
        headers: { Authorization: auth },
        data: { activity: activityObject },
      }
    )
      .then((res) => {
        setAllActivities(res.data);
        setShowAddActivity(false);
      })
      .catch((err) => toast.error(err.message));
  };

  const handleDeleteActivity = () => {
    axios(
      `${BACKEND_URI}/api/schedules/activities/delete/${activityObject.id}`,
      {
        method: "PUT",
        headers: { Authorization: auth },
        data: { activity: activityObject },
      }
    )
      .then((res) => {
        setAllActivities(res.data);
        setShowAddActivity(false);
        toast.success("Activitet har raderats!");
      })
      .catch((err) => toast.error(err.message));
  };

  const handleOnChangeTitle = useCallback((e) => {
    setActivityObject((pre) => ({ ...pre, title: e.target.value }));
  });

  const handleOnChangeColor = useCallback((e) => {
    let colorId = e.currentTarget.id;
    console.log(colorId);
    setActivityObject((pre) => ({ ...pre, color: { id: colorId } }));
    console.log(activityObject);
  });

  const handleOnChangeFrom_time = useCallback((e) => {
    setActivityObject((pre) => ({ ...pre, from_time: `${e.target.value}:00` }));
  });

  const handleOnChangeTo_time = useCallback((e) => {
    setActivityObject((pre) => ({ ...pre, to_time: `${e.target.value}:00` }));
  });

  const handleOnChangeDescription = useCallback((e) => {
    setActivityObject((pre) => ({ ...pre, description: e.target.value }));
  });

  return (
    <main className="absolute top-0 flex h-full  w-full place-items-center backdrop-blur-sm">
      <div
        className={`relative mx-auto  w-full space-y-3 rounded-lg border border-indigo-500 bg-white p-10 shadow-md sm:mt-10 sm:w-fit md:mt-0 `}
      >
        <h1 className="mb-5 text-center text-xl font-bold">
          <span className={`w-6  `}>Lägg till aktivitet</span>{" "}
          <span>{/* (day, month, year, week) */}</span>
        </h1>
        <XIcon
          className="absolute top-0 left-[90%] h-6 w-6 text-red-600 duration-300 hover:scale-110 hover:cursor-pointer"
          onClick={() => {
            setActivityObject({});
            setShowAddActivity(false);
          }}
        />
        <label className="block">Rubrik:</label>
        <input
          type="text"
          value={activityObject.title === undefined ? "" : activityObject.title}
          placeholder="Rubrik"
          className="w-full border-b-2 border-indigo-500 outline-none"
          onChange={handleOnChangeTitle}
        ></input>

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
              value={
                activityObject.from_time === undefined
                  ? ""
                  : activityObject.from_time
              }
              onChange={handleOnChangeFrom_time}
            ></input>
          </div>
          <div className="">
            <label className="block">Till:</label>
            <input
              type="time"
              className="rounded-lg bg-gray-100 p-3"
              value={
                activityObject.to_time === undefined
                  ? ""
                  : activityObject.to_time
              }
              onChange={handleOnChangeTo_time}
            ></input>
          </div>
        </section>
        <label className="block">Beskrivning</label>
        <textarea
          className="h-[150px] max-h-[200px] w-full rounded-lg bg-gray-100 px-2 py-1"
          value={activityObject.description}
          onChange={handleOnChangeDescription}
        ></textarea>
        <div className="flex flex-row place-items-center space-x-3">
          <label className="text-gray-400 ">
            <ColorSwatchIcon className="inline-block h-5 w-5" /> Färg
          </label>
          {colors.map((color) => (
            <button
              type="checkbox"
              key={color.id}
              id={color.id}
              className={`h-5 w-5 rounded-full focus:ring-2 `}
              onClick={handleOnChangeColor}
              style={{ backgroundColor: `${color.attributes.hex}` }}
            ></button>
          ))}
        </div>
        <div className="flex flex-col justify-center gap-2 py-4 sm:flex-row sm:space-x-10">
          {activityObject.type === "edite" ? (
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
                disabled={
                  activityObject.color === undefined ||
                  activityObject.from_time === undefined ||
                  activityObject.to_time === undefined ||
                  activityObject.from_time > activityObject.to_time
                    ? true
                    : false
                }
              >
                Spara och stäng
                <CheckIcon className="ml-2 inline-block h-6 w-6" />
              </button>
            </>
          ) : (
            <>
              <button
                className="rounded-lg bg-red-600 px-4 py-1 text-white "
                onClick={() => {
                  setShowAddActivity(false);
                  setActivityObject({});
                }}
              >
                Avbryt
                <XIcon className="ml-2 inline-block h-6 w-6" />
              </button>
              <button
                className="rounded-lg bg-indigo-600 px-4 py-1 text-white disabled:bg-gray-100 disabled:text-gray-400 "
                onClick={handleAddActivity}
                disabled={
                  activityObject.color === undefined ||
                  activityObject.from_time === undefined ||
                  activityObject.to_time === undefined ||
                  activityObject.from_time > activityObject.to_time
                    ? true
                    : false
                }
              >
                Lägg till
                <PlusCircleIcon className="ml-2 inline-block h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default CreateActivity;
