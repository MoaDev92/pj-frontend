module.exports = {
  async redirects() {
    return [
      // if the header `x-redirect-me` is present,
      // this redirect will be applied
      {
        source: "/mina-sidor",
        has: [
          {
            type: "header",
            key: "role",
            value: "deltagare",
          },
        ],
        permanent: false,
        destination: "/mina-sidor/deltagare",
      },
      {
        source: "/mina-sidor",
        has: [
          {
            type: "header",
            key: "role",
            value: "coach",
          },
        ],
        permanent: false,
        destination: "/mina-sidor/coach",
      },
      {
        source: "/mina-sidor",
        has: [
          {
            type: "header",
            key: "role",
            value: "",
          },
        ],
        permanent: false,
        destination: "/login",
      },
      {
        source: "/minaSidor",
        has: [
          {
            type: "header",
            key: "cookie",
            value: "",
          },

          {
            type: "header",
            key: "cookie",
            value: "token=",
          },
        ],
        permanent: false,
        destination: "/login",
      },
      {
        source: "/coach",
        has: [
          {
            type: "header",
            key: "cookie",
            value: "token=",
          },
        ],
        permanent: false,
        destination: "/login",
      },
    ];
  },
};
