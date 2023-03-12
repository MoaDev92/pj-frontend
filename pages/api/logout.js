import cookie from "cookie";
export default async (req, res) => {
  if (req.method === "POST") {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      })
    );

    res.status(200).json({ message: "Logged Out!" });
  } else {
    res.status(400).json({ message: `${req.method} is not allowed` });
  }
};
