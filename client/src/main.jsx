import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CurrencyProvider } from "./context/CurrencyContext";
import "./styles.css";
import "./localization.css";
import "./ui-fixes.css";
import "./final-fixes.css";
import "./pc-image-fixes.css";
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </React.StrictMode>,
);
