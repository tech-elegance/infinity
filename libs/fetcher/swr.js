import axios from "axios";

const fetcher = (...args) => axios(...args).then((res) => res.data);

export default fetcher;
