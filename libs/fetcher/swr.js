import axios from "axios";

const fetcher = (...args) =>
  axios(...args, {
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
  }).then((res) => res.data);

export default fetcher;
