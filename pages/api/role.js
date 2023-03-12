import { BACKEND_URI } from "../../config";
import axios from "axios";

export default async (req, res) => {
  if (req.method === "GET") {
    const auth = req.headers.authorization;

    //return console.log(req.headers);
    const { data: role } = await axios(
      `${BACKEND_URI}/api/login-page/checkCalling`,
      {
        headers: { Authorization: auth },
      }
    );

    //console.log(role);
    res.status(200).json({ role });
  } else {
    res.status(400).json({ message: `${req.method} is not allowed` });
  }
};
