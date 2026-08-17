import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TransportApp from "../app/TransportApp";
import "../app/globals.css";

const root = typeof document === "undefined" ? null : document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <TransportApp />
    </StrictMode>,
  );
}
