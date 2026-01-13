import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ReloadPrompt from "./components/ReloadPrompt.tsx";
import InstallPrompt from "./components/InstallPrompt.tsx";

const container = document.getElementById("root")!;
createRoot(container).render(
  <>
    <App />
    <ReloadPrompt />
    <InstallPrompt />
  </>
);

