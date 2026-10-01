import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Base primitives first, then domain styles from App, then gallery overrides.
import "./index.css";
import App from "./App.tsx";
import "./gallery.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
