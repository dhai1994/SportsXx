import axios from "axios";



const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true // sends cookies if needed
});
/*await axios.get("http://localhost:8000/api/videos", {
  withCredentials: true
});*/


export default API;

//hello
