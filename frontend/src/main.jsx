import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/other/ScrollToTop.jsx";
import { Toaster } from "sonner";

window.history.scrollRestoration = "manual";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <ScrollToTop />
      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  </StrictMode>,
);
