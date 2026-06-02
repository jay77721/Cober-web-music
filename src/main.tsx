
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { applyTheme } from "./stores/useThemeStore"

// Apply saved theme before render — prevent flash
const savedScheme = localStorage.getItem("theme_scheme") || "auto"
const savedAccent = localStorage.getItem("theme_accent") || "#E8593C"
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
const isDark = savedScheme === "auto" ? prefersDark : savedScheme === "dark"
applyTheme(savedAccent, isDark)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <App />
)

