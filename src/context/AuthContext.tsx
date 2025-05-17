import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  createRequestToken,
  createSession,
  deleteSession,
  getAccountDetails,
} from "../api/tmdbApi";
import type { AuthState } from "../api/types";

interface AuthContextType {
  authState: AuthState;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  sessionId: null,
  accountId: null,
  username: null,
  loading: false,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const sessionId = localStorage.getItem("tmdb_session_id");
    const accountId = localStorage.getItem("tmdb_account_id");
    const username = localStorage.getItem("tmdb_username");

    if (sessionId && accountId) {
      return {
        isAuthenticated: true,
        sessionId,
        accountId,
        username,
        loading: false,
        error: null,
      };
    }

    return initialAuthState;
  });

  useEffect(() => {
    if (
      authState.isAuthenticated &&
      authState.sessionId &&
      authState.accountId
    ) {
      localStorage.setItem("tmdb_session_id", authState.sessionId);
      localStorage.setItem("tmdb_account_id", authState.accountId);
      if (authState.username) {
        localStorage.setItem("tmdb_username", authState.username);
      }
    } else if (!authState.isAuthenticated) {
      localStorage.removeItem("tmdb_session_id");
      localStorage.removeItem("tmdb_account_id");
      localStorage.removeItem("tmdb_username");
    }
  }, [
    authState.isAuthenticated,
    authState.sessionId,
    authState.accountId,
    authState.username,
  ]);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const requestToken = urlParams.get("request_token");
      const approved = urlParams.get("approved");

      if (requestToken && approved === "true" && !authState.isAuthenticated) {
        try {
          setAuthState((prev) => ({ ...prev, loading: true }));

          const sessionId = await createSession(requestToken);
          const accountDetails = await getAccountDetails(sessionId);

          setAuthState({
            isAuthenticated: true,
            sessionId: sessionId,
            accountId: accountDetails.id.toString(),
            username: accountDetails.username,
            loading: false,
            error: null,
          });
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        } catch (error) {
          console.error("Error handling auth callback:", error);
          setAuthState((prev) => ({
            ...prev,
            loading: false,
            error: "Gagal menyelesaikan proses login",
          }));
        }
      }
    };

    handleAuthCallback();
  }, []);

  const login = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const requestToken = await createRequestToken();
      const redirectUrl = `${window.location.origin}${window.location.pathname}`;
      window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${redirectUrl}`;
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Gagal login. Silakan coba lagi.",
      }));
      console.error("Error during login:", error);
    }
  };

  const logout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      if (authState.sessionId) {
        try {
          await deleteSession(authState.sessionId);
        } catch (logoutError) {
          console.error("Error saat menghapus sesi:", logoutError);
        }
      }
      localStorage.removeItem("auth_session_id");
      localStorage.removeItem("auth_account_id");
      setAuthState({
        ...initialAuthState,
        loading: false,
      });
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Gagal logout. Silakan coba lagi.",
      }));
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
