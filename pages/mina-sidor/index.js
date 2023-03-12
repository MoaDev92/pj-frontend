import { Router, useRouter } from "next/router";
import React from "react";

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/mina-sidor/deltagare",
      permanent: false,
    },
  };
}

const index = () => {
  return (
    <main className="bg-pink-500 md:container md:mx-auto">
      <div></div>;
    </main>
  );
};

export default index;
