/// <reference types="vite/client" />
import axios from "axios"

const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
  withCredentials: true,
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
})

api.interceptors.request.use((config) => {
  if (config.method === "post") {
    config.data = { ...config.data, timestamp: Date.now() }
  } else {
    config.params = { ...config.params, timestamp: Date.now() }
  }
  const cookie = localStorage.getItem("cookie")
  if (cookie) {
    if (config.method === "post") {
      config.data.cookie = cookie
    } else {
      config.params.cookie = cookie
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 301 || err.response?.data?.code === 301) {
      window.dispatchEvent(new CustomEvent("need-login"))
    }
    return Promise.reject(err)
  }
)

export default api