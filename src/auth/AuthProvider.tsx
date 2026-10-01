import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import keycloak from "./keycloak";
import { getCurrentUser } from "../services/api";

type AuthContextValue = {
  authenticated: boolean;
  loading: boolean;
  error?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  permissions: string[];
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export function AuthProvider({ children }: AuthProviderProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();

  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        if (DEMO_MODE) {
          const currentUser = await getCurrentUser();

          if (!mounted) {
            return;
          }

          setAuthenticated(true);
          setError(undefined);

          setUsername("demo");
          setEmail(currentUser.email);
          setFirstName("CareFlow");
          setLastName("Demo");

          setRoles(currentUser.roles ?? []);
          setPermissions(currentUser.permissions ?? []);
          setLoading(false);

          return;
        }

        const isAuthenticated = await keycloak.init({
          onLoad: "check-sso",
          pkceMethod: "S256",
          silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
          checkLoginIframe: false,
        });

        if (!mounted) {
          return;
        }

        setAuthenticated(isAuthenticated);
        setError(undefined);

        if (!isAuthenticated || !keycloak.tokenParsed) {
          setLoading(false);
          return;
        }

        setUsername(keycloak.tokenParsed.preferred_username);
        setEmail(keycloak.tokenParsed.email);
        setFirstName(keycloak.tokenParsed.given_name);
        setLastName(keycloak.tokenParsed.family_name);

        await keycloak.updateToken(30);

        const currentUser = await getCurrentUser();

        if (!mounted) {
          return;
        }

        setRoles(currentUser.roles ?? []);
        setPermissions(currentUser.permissions ?? []);
        setLoading(false);
      } catch (error) {
        if (mounted) {
          setAuthenticated(false);
          setRoles([]);
          setPermissions([]);

          setError(
            error instanceof Error
              ? error.message
              : "Your account is not available in CareFlow."
          );

          setLoading(false);
        }
      }
    };

    void initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async () => {
    if (DEMO_MODE) {
      return;
    }

    await keycloak.login();
  };

  const logout = async () => {
    if (DEMO_MODE) {
      window.location.reload();
      return;
    }

    await keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        loading,
        error,
        username,
        email,
        firstName,
        lastName,
        roles,
        permissions,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
