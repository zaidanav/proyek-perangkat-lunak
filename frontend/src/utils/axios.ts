import axios from 'axios';

const isDev = import.meta.env.MODE === 'development';

const envBaseURL = import.meta.env.VITE_API_BASE_URL;
const runtimeBaseURL = `${window.location.protocol}//${window.location.hostname}:3000/api`;

const API_BASE_URL = isDev
  ? (envBaseURL && !envBaseURL.includes('localhost') ? envBaseURL : runtimeBaseURL)
  : envBaseURL; // ✅ in production, ONLY use env

if (isDev) {
  console.warn("MNKI | DEV MODE, runtime url exposed, don't forget to remove");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});


export default api;
