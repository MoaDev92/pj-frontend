import { PlusCircleIcon, XIcon } from "@heroicons/react/outline";
import axios from "axios";
import React, { useCallback, useState, useEffect } from "react";
import { BACKEND_URI } from "../../config";

const CreateCategory = ({ setShowCreateCategory, user, auth }) => {
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryColor, setCategoryColor] = useState(null);
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

  const handleCreateCategory = useCallback(() => {
    axios(`${BACKEND_URI}/api/categories`, {
      method: "POST",
      headers: { Authorization: auth },
      data: {
        data: {
          title: categoryTitle,
          participant: { id: user.id },
          color: { id: categoryColor },
        },
      },
    })
      .then((res) => {
        setShowCreateCategory(false);
        console.log(res.data);
      })
      .catch((err) => toast.error(err.message));
  });

  return (
    <main className="absolute top-60 left-3 h-64 w-fit rounded-lg border border-indigo-500 bg-white p-2 shadow">
      <XIcon
        className="float-right mr-5 h-6 w-6 text-red-600 duration-300  hover:scale-125 hover:cursor-pointer"
        onClick={() => setShowCreateCategory(false)}
      />
      <h1 className="w-fit font-bold">Skapa Kategori</h1>

      <label className="block p-1 text-left">Namn</label>
      <input
        type="text"
        className="mb-3 rounded bg-gray-50 p-1 text-black outline-none placeholder:text-sm placeholder:text-gray-400"
        placeholder="Namn"
        onChange={(e) => setCategoryTitle(e.target.value)}
      ></input>
      <label className="block text-left">Färg</label>
      <div className="grid grid-cols-3 gap-2">
        {colors.map((color) => (
          <button
            key={color.id}
            id={color.id}
            className={`h-6 w-6 rounded-full focus:border-2  `}
            onClick={(e) => setCategoryColor(e.currentTarget.id)}
            style={{ backgroundColor: `${color.attributes.hex}` }}
          ></button>
        ))}
      </div>
      <button
        onClick={handleCreateCategory}
        className="ml-auto  flex text-indigo-600 disabled:text-gray-300"
        disabled={categoryTitle === "" || categoryColor === null ? true : false}
      >
        <PlusCircleIcon className="ml-auto mr-2 h-8 w-8  duration-300 hover:scale-110 hover:cursor-pointer " />
      </button>
    </main>
  );
};

export default CreateCategory;
