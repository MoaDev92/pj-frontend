import React from "react";

const Footer = () => {
  return (
    <footer className=" bg-indigo-500 text-center  w-full text-white h-24 print:hidden ">
      <p className="text-l">
        {" "}
        {new Date().getFullYear()} © All right reserved | Moafak Mohammed
      </p>
    </footer>
  );
};

export default Footer;
