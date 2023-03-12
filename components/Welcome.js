import React from "react";
import { UserCircleIcon } from "@heroicons/react/outline";
import { CogIcon } from "@heroicons/react/solid";

const Welcome = ({ user, bransch, occuaptions }) => {
  const { data } = occuaptions;
  if (!data) {
    return <div>Du ska logga in</div>;
  }
  return (
    <main className="space-y-10">
      <div className=" bg-green-700 rounded-md mx-auto text-white  text-center p-5 text-2xl ">
        <h1>Välkommen till Merit jobbportal!😊 </h1>
      </div>
      <div className="grid grid-cols-1 mx-auto w-[300px]">
        <div className="relative bg-yellow-400  h-[100px] rounded-t-md">
          <UserCircleIcon className=" absolute text-indigo-400 w-12 h-12 left-[43%] top-20 rounded-full bg-white" />
        </div>
        <div className="bg-white shadow-xl rounded-b-md h-[300px] mt-5 px-4">
          <p className="text-center">{user.username}</p>
          <h1 className="underline decoration-orange-600 font-bold mt-4">
            Mina Yrken
          </h1>
          <ul>
            {data.map((o) => (
              <li key={o.id} className=" flex">
                <CogIcon className="w-6 h-6 text-indigo-500" />
                {o.attributes.occupation}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-indigo-50 w-fit mx-auto p-5 border-l-4 border-l-indigo-400">
        <h1>Behöver du hjälp?</h1>
        <p>Du kan titta på följande filmer .....</p>
      </div>
    </main>
  );
};

export default Welcome;
