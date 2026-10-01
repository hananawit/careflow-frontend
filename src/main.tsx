import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { AppErrorBoundary } from "./app/AppErrorBoundary";
import { HospitalProvider } from "./app/context/HospitalContext";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { LoginPage } from "./app/components/auth/LoginPage";
import "./styles/index.css";

function AuthenticatedApp() {
  const { loading, authenticated, error, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">
          Loading CareFlow...
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginPage error={error} onLogin={() => void login()} onLogout={() => void logout()} />;
  }

  return (
    <HospitalProvider>
      <App />
    </HospitalProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AppErrorBoundary>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </AppErrorBoundary>
  </BrowserRouter>,
);
