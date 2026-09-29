
  import { createRoot } from "react-dom/client";
  import { BrowserRouter } from "react-router-dom";
  import App from "./app/App";
  import { AppErrorBoundary } from "./app/AppErrorBoundary";
  import { HospitalProvider } from "./app/context/HospitalContext";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <AppErrorBoundary>
        <HospitalProvider>
          <App />
        </HospitalProvider>
      </AppErrorBoundary>
    </BrowserRouter>,
  );
