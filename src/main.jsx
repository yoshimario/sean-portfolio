// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode is fine; it doesn’t duplicate DOM, but keep only ONE <App />
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
