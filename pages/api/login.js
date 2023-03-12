import { BACKEND_URI } from "../../config";
import axios from "axios";
import cookie from "cookie";

export default async (req, res) => {
  if (req.method === "POST") {
    const { identifier, password } = req.body;

    const strapiRes = await axios.post(`${BACKEND_URI}/api/auth/local`, {
      identifier,
      password,
    });

    if (strapiRes.status === 200) {
      const { data: role } = await axios(
        `${BACKEND_URI}/api/login-page/checkCalling`,
        {
          headers: { Authorization: `Bearer ${strapiRes.data.jwt}` },
        }
      );

      res.setHeader("role", `${role}`);

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", strapiRes.data.jwt, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
        })
      );

      //res.redirect(200, `/mina-sidor/${role}`);

      res.status(200).json(strapiRes.data.user);
    } else {
      res.status(strapiRes.status).json("faild");
    }
  } else {
    res.status(400).json({ message: `${req.method} is not allowed` });
  }
};
