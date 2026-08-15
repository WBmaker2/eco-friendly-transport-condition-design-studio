import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TransportApp from "../app/TransportApp";
import "../app/globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Pages root element is missing");
}

createRoot(root).render(
  <StrictMode>
    <TransportApp />
  </StrictMode>,
);
