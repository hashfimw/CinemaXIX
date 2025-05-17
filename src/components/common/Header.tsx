import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import LoginPopup from "../common/LoginPopup";

const Header: React.FC = () => {
  const { authState, login, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogoutClick = () => {
    logout();
  };

  const handleAuthRequiredNavigation = (
    e: React.MouseEvent,
    path: string,
    message: string
  ) => {
    if (!authState.isAuthenticated) {
      e.preventDefault();
      setLoginMessage(message);
      setRedirectPath(path);
      setShowLoginPopup(true);
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    setShowLoginPopup(false);
    login();
    const checkAuthAndRedirect = setInterval(() => {
      if (authState.isAuthenticated && redirectPath) {
        navigate(redirectPath);
        setRedirectPath("");
        clearInterval(checkAuthAndRedirect);
      }
    }, 500);
    setTimeout(() => clearInterval(checkAuthAndRedirect), 10000);
  };

  return (
    <header className="bg-zinc-800 py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <Link to="/" className="text-white font-bold text-2xl">
            CINEMA XIX
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className="w-full md:w-auto flex-grow md:max-w-md"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Cari film..."
              className="w-full py-2 px-4 pr-10 rounded-full bg-white/20 text-white placeholder-white/70 focus:outline-none focus:bg-white/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </form>

        <nav className="flex items-center gap-6">
          <a
            href="/favorites"
            className="text-white hover:text-white/80"
            onClick={(e) =>
              handleAuthRequiredNavigation(
                e,
                "/favorites",
                "Silakan login untuk melihat film favorit Anda."
              )
            }
          >
            Favorites
          </a>
          <a
            href="/watchlist"
            className="text-white hover:text-white/80"
            onClick={(e) =>
              handleAuthRequiredNavigation(
                e,
                "/watchlist",
                "Silakan login untuk melihat watchlist Anda."
              )
            }
          >
            Watchlist
          </a>

          {authState.isAuthenticated && (
            <div className="flex items-center gap-2">
              <span className="text-white hidden md:inline"></span>
              <button
                onClick={handleLogoutClick}
                className="bg-white/20 hover:bg-white/30 text-white py-1 px-3 rounded-full text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
      {showLoginPopup && (
        <LoginPopup
          onClose={() => setShowLoginPopup(false)}
          onLogin={handleLogin}
          message={loginMessage}
        />
      )}
    </header>
  );
};

export default Header;
