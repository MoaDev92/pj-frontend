import axios from "axios";

export const useAddJobFavorit = async (url, auth, data) => {
  const res = axios({
    method: "post",
    url: url,
    data: data,
    headers: { Authorization: auth },
  });
  return res;
};
