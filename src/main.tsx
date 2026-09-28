
  import { createRoot } from "react-dom/client";
  import App from "./app/App";
  import { HospitalProvider } from "./app/context/HospitalContext";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <HospitalProvider>
      <App />
    </HospitalProvider>,
  );
