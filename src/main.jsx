// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// ⬇️ add this line
import SoundProvider from "./sound/SoundProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Keep the provider OUTSIDE the router/App so the audio element never unmounts */}
    <SoundProvider src="/audio/forest-ambience.mp3" defaultVolume={0.35}>
      <App />
    </SoundProvider>
  </React.StrictMode>
);