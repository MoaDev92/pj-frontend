import React from "react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { IoDiamond } from "react-icons/io5";
import PropTypes from "prop-types";
import Head from "next/head";

const Footer = ({ companyInfo, footer }) => {
  return (
    <footer
      style={{ backgroundColor: `${footer.color.data.attributes.rgb}` }}
      className="mt-10 text-center text-white"
    >
      <p className="text-l">
        {new Date().getFullYear()} © All right reserved |{" "}
        <span className="text-Black font-Gwendolyn text-3xl">
          {companyInfo.name}
        </span>
      </p>
    </footer>
  );
};

export default Footer;
