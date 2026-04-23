import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initSentry } from "@/lib/monitoring/sentry";
import "./styles.css";
import "./index.css";

initSentry();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
