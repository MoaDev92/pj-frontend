import React, { useCallback, useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import {
  getWeek,
  isSameDay,
  lastDayOfWeek,
  startOfWeek,
  eachDayOfInterval,
} from "date-fns";
import axios from "axios";
import { BACKEND_URI } from "../../config";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ColorSwatchIcon,
  PlusCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import CreateActivity from "./CreateActivity";
import { BsFillPinFill } from "react-icons/bs";
import CreateCategory from "./CreateCategory";

const ToDo = ({
  auth,
  user,
  setShowParticipantToDo,
  showAdditionalButtons,
  setShowAdditionalButtons,
}) => {
  const [value, onChange] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState([]);
  const [selectedWeekNumber, setSelectedWeekNumber] = useState(null);
  const [allActivities, setAllActivities] = useState([]);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [categories, setCategories] = useState([]);
  //const [colors, setColors] = useState([]);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [weekend, setWeekend] = useState([]);

  //ActivityObjecy determain adding or editing activiy and in which year,month, day and weeknumber the uesr would to add activity to
  const [activityObject, setActivityObject] = useState({});

  const handleOnClickWeekNum = useCallback(
    (weeknum, date, e) => {
      const week = eachDayOfInterval({
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: lastDayOfWeek(date, { weekStartsOn: 1 }),
      });
      //remove weekend
      const fiveDaysWeek = week.splice(5, 2);
      setCurrentWeek((currentWeek = week));
      setSelectedWeekNumber((selectedWeekNumber = weeknum));

      setWeekend((weekend = fiveDaysWeek));
      console.log(weekend);

      let selectedWeekMonth = date.getMonth() + 1;
      let selectedWeekYear = date.getFullYear();

      axios(
        `${BACKEND_URI}/api/schedules/activities?participant=${user.id}&date=${selectedWeekYear}-${selectedWeekMonth}&week=${selectedWeekNumber}`,
        { headers: { Authorization: auth } }
      )
        .then((res) => {
          if (res.status === 200) {
            const { scheduleId } = res.data;
            console.log("ff", scheduleId);
            setActivityObject({ scheduleId });
            setAllActivities(
              (allActivities = res.data.activitesWithCustomColors)
            );
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 404) {
            console.log("foooo");
            setAllActivities([]);
          }
        });
    },
    [selectedWeekNumber]
  );

  useEffect(() => {
    const currentWeekNumber =
      getWeek(value, {
        weekStartsOn: 1,
      }) - 1;
    setSelectedWeekNumber((selectedWeekNumber = currentWeekNumber));

    const firstDayOfCurrentWeek = startOfWeek(value, { weekStartsOn: 1 });
    let currentMonth = value.getMonth() + 1;
    let currentYear = value.getFullYear();
    const week = eachDayOfInterval({
      start: startOfWeek(value, { weekStartsOn: 1 }),
      end: lastDayOfWeek(value, { weekStartsOn: 1 }),
    });

    //remove weekend
    const fiveDaysWeek = week.splice(5, 2);
    setCurrentWeek((currentWeek = week));
    setWeekend((weekend = fiveDaysWeek));
    axios(
      `${BACKEND_URI}/api/schedules/activities?populate=*&participant=${user.id}&date=${currentYear}-${currentMonth}&week=${selectedWeekNumber}`,
      { headers: { Authorization: auth } }
    )
      .then((res) => {
        //const { id: scheduleId, activitesWithCustomColors } = res.data;
        if (res.status === 200) {
          const { scheduleId } = res.data;

          setActivityObject({ scheduleId });
          setAllActivities(
            (allActivities = res.data.activitesWithCustomColors)
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setAllActivities([]);
      });

    /* axios(`${BACKEND_URI}/api/colors`, {
      method: "GET",
      headers: { Authorization: auth },
    }).then((res) => {
      let customColors = res.data.data.map((color) => {
        return {
          bg: {
            id: color.id,
            grade1: `bg-${color.attributes.name}-300`,
            grade2: `bg-${color.attributes.name}-500`,
            grade3: `bg-${color.attributes.name}-700`,
          },
          border: {
            id: color.id,
            grade1: `border-${color.attributes.name}-300`,
            grade2: `border-${color.attributes.name}-500`,
            grade3: `border-${color.attributes.name}-700`,
          },
          text: {
            id: color.id,
            grade1: `text-${color.attributes.name}-300`,
            grade2: `text-${color.attributes.name}-500`,
            grade3: `text-${color.attributes.name}-700`,
          },
        };
      });

      setColors((colors = customColors));
    }); */
  }, []);

  useEffect(() => {
    axios(
      `${BACKEND_URI}/api/categories?populate=color&filters[participant][id][$eq]=${user.id}`,
      { headers: { Authorization: auth } }
    ).then((res) => {
      setCategories((categories = res.data.data));
      console.log(res.data.data);
    });
  }, [showCreateCategory]);

  const handleDeleteCategory = useCallback((e) => {
    axios(`${BACKEND_URI}/api/categories/${e.currentTarget.id}`, {
      method: "DELETE",
      headers: { Authorization: auth },
    })
      .then((res) => console.log(categories.length))
      .catch((err) => console.log(err));
  });

  const handleEditeActivity = useCallback((e) => {
    // we will edite the activity via the create comp.
    const editedActivityId = e.currentTarget.id;
    let choosedActivity = allActivities.find(
      (activity) => activity.id === parseInt(editedActivityId)
    );
    setActivityObject((pre) => ({ ...pre, ...choosedActivity, type: "edite" }));
    setShowAddActivity(true);
  });

  const handleDateStyle = useCallback(({ date, view }) => {
    if (view === "month") {
      //weekend text color red
      if (date.getDay() === 6 || date.getDay() === 0) {
        return "text-red-500";
      }
      /* if (date.getDay() === 1 || date.getDay() === 5) {
        return "rounded text-indigo-600 duration-500 font-bold bg-white";
      } */
      //today underlined
      if (
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth()
      ) {
        return "underline text-indigo-600 duration-500 font-bold bg-white";
      }
      //marke the selected week
      if (currentWeek.find((dDate) => isSameDay(dDate, date))) {
        return "text-indigo-600 duration-500 font-bold bg-white ";
      } else {
        return "text-gray-500";
      }
    }
  });

  /*  const handelDayStyle = useCallback(({ date, view }) => {
    if (view === "month") {
      if (date.getDay() === 6 || date.getDay() === 0) {
        return "dd";
      }
    }
  }); */

  /* const foo = () => {
    const too = "(123,456,678)";
    let gg = too.split(")");
    gg.push(",0.5)");

    let color = "";
    gg.forEach((element) => (color += `${element} `));
    console.log(color);
  }; */

  return (
    <>
      {showAdditionalButtons && (
        <header className="inline-block">
          <button
            className="float-left text-blue-500"
            onClick={() => {
              setShowParticipantToDo(false);
              setShowAdditionalButtons(false);
            }}
          >
            <ArrowLeftIcon className="inline-block h-5 w-5" />
            Tillbaka
          </button>
        </header>
      )}
      <main className=" grid h-full min-h-screen grid-cols-1 gap-2 bg-white lg:grid-cols-5">
        <section className="m-3 rounded-lg bg-slate-50 p-2">
          <Calendar
            onChange={onChange}
            value={value}
            className="container max-h-fit w-full  rounded-md bg-indigo-200 p-3 text-center text-[10px] font-bold  shadow-md"
            showWeekNumbers={true}
            tileClassName={handleDateStyle}
            //tileContent={handelDayStyle}
            onClickWeekNumber={handleOnClickWeekNum}
            minDetail="year"
            next2Label={""}
            prev2Label={""}
            nextLabel={
              <ChevronRightIcon className="float-right ml-2 h-2 w-2" />
            }
            prevLabel={<ChevronLeftIcon className="float-left mr-2 h-2 w-2" />}
          />
          <h1 className="m-4 text-center text-indigo-500">
            <span className="mr-2 rounded-lg bg-indigo-600 py-0.5 px-2 text-xs font-bold text-white">
              {categories.length}
            </span>
            <span
              //style={{ backgroundColor: "rgba(235, 179, 8 ,  1)" }}
              className=" tracking-wide underline decoration-yellow-400 "
            >
              Kategorier
            </span>
            <PlusCircleIcon
              className="relative ml-2 inline-block h-5 w-5 text-yellow-500 duration-300 hover:scale-110 hover:cursor-pointer"
              onClick={() => setShowCreateCategory(true)}
            />
            {showCreateCategory && (
              <CreateCategory
                setShowCreateCategory={setShowCreateCategory}
                user={user}
                auth={auth}
              />
            )}
          </h1>
          {categories.length !== 0 ? (
            <div className="space-y-2 rounded-lg  bg-indigo-50 p-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-lg bg-gray-50 py-1 px-2"
                >
                  <div
                    style={{
                      backgroundColor: `${category.attributes.color.data.attributes.hex}`,
                    }}
                    className={`mr-2 inline-block h-3 w-3 rounded-full`}
                  ></div>
                  {category.attributes.title}
                  <TrashIcon
                    id={category.id}
                    className="float-right inline-block h-5 w-5 text-red-600 duration-300 hover:scale-110 hover:cursor-pointer"
                    onClick={handleDeleteCategory}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-36 place-items-center justify-center rounded-lg bg-indigo-50 p-2 text-yellow-500">
              <span className="">Inga Kategorier</span>
              <ColorSwatchIcon className="ml-2 inline-block  h-6 w-6" />
            </div>
          )}
        </section>
        <section className="relative w-full snap-x grid-cols-1 divide-x-2 overflow-x-auto p-2 sm:col-span-4   sm:grid sm:grid-cols-5  ">
          {currentWeek.map((day) => (
            <div key={day.getDay()} className="w-full text-center ">
              <header className="rounded-t-md border-b-2 bg-gray-100  p-2 text-indigo-600">
                <button
                  id={day.toDateString()}
                  className="underline decoration-yellow-500"
                  onClick={() => {
                    setShowAddActivity(true);
                    setActivityObject({
                      day: day.getDay(),
                      date: day.getDate(),
                      month: day.getMonth() + 1,
                      year: day.getFullYear(),
                      week: selectedWeekNumber,
                      participant: user.id,
                    });
                  }}
                >
                  <span className="text-sm">Lägg till uppgift</span>
                  <PlusCircleIcon className="ml-2 inline-block h-4 w-4 text-yellow-500" />
                </button>
                <span className="block">
                  {day.toDateString().substring(0, 3)}
                </span>
                <span className=" rounded-lg px-2 py-1">
                  {day.toLocaleDateString()}
                </span>
              </header>
              <div className="grid grid-cols-1 place-items-center">
                {allActivities
                  .filter((activity) => activity.day === day.getDay())
                  .map((a) => (
                    <button
                      key={a.id}
                      id={a.id}
                      style={{
                        backgroundColor: `${a.color1}`,
                        borderColor: `${a.color4}`,
                      }}
                      className={`max-h-auto relative mt-4  w-10/12   rounded-md border-l-2 py-10  duration-500 hover:scale-105  `}
                      onClick={handleEditeActivity}
                    >
                      <BsFillPinFill
                        style={{ backgroundColor: `${a.color4}` }}
                        className={`absolute -top-3 -left-3  h-5 w-5 rounded-full p-1 text-white`}
                      />
                      <span
                        className={`font-bold `}
                        style={{ color: `${a.color4}` }}
                      >
                        {`${a.from_time.substring(
                          0,
                          5
                        )} - ${a.to_time.substring(0, 5)}`}
                      </span>
                      <span
                        className={`block `}
                        style={{ color: `${a.color3}` }}
                      >
                        {a.title}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </section>
        {showAddActivity && (
          <CreateActivity
            activityObject={activityObject}
            setShowAddActivity={setShowAddActivity}
            user={user}
            auth={auth}
            setAllActivities={setAllActivities}
            setActivityObject={setActivityObject}
            //colors={colors}
          />
        )}
      </main>
    </>
  );
};

export default ToDo;
