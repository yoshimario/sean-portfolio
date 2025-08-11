import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // make sure this path exists

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error('Missing <div id="root"></div> in index.html');
}

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
