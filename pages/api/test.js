import { BACKEND_URI } from "../../config";

export default async function handler(req, res) {
  res.redirect("/", 200);
}
