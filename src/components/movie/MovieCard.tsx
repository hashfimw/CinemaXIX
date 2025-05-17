import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HeartIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
import type { Movie } from "../../api/types";
import { useAuth } from "../../context/AuthContext";
import { useMovies } from "../../context/MoviesContext";
import { getImageUrl } from "../../api/tmdbApi";
import LoginPopup from "../common/LoginPopup";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { authState, login } = useAuth();
  const {
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    isInWatchlist,
    isInFavorites,
  } = useMovies();

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  const inWatchlist = isInWatchlist(movie.id);
  const inFavorites = isInFavorites(movie.id);
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";

  const handleWatchlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authState.isAuthenticated) {
      setLoginMessage("Anda perlu login untuk menambahkan film ke watchlist.");
      setShowLoginPopup(true);
      return;
    }

    try {
      if (inWatchlist) {
        await removeFromWatchlist(movie.id);
      } else {
        await addToWatchlist(movie);
      }
    } catch (error) {
      console.error("Error managing watchlist:", error);
      alert("Gagal mengubah watchlist. Silakan coba lagi.");
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authState.isAuthenticated) {
      setLoginMessage("Anda perlu login untuk menambahkan film ke favorit.");
      setShowLoginPopup(true);
      return;
    }

    try {
      if (inFavorites) {
        await removeFromFavorites(movie.id);
      } else {
        await addToFavorites(movie);
      }
    } catch (error) {
      console.error("Error managing favorites:", error);
      alert("Gagal mengubah favorit. Silakan coba lagi.");
    }
  };

  const handleLogin = () => {
    setShowLoginPopup(false);
    login();
  };

  return (
    <div className="flex flex-col">
      <Link to={`/movie/${movie.id}`} className="movie-card group relative">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full rounded-md object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "/placeholder-poster.jpg";
          }}
        />
        <div className="movie-card-overlay opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-black/60 rounded-md">
          <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center">
            <div className="flex items-center">
              <StarIconSolid className="w-4 h-4 text-white mr-1" />
              <span className="text-white text-xs font-medium">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleWatchlistClick}
                className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                aria-label={
                  inWatchlist
                    ? "Hapus dari watchlist"
                    : "Tambahkan ke watchlist"
                }
              >
                {inWatchlist ? (
                  <BookmarkIconSolid className="w-5 h-5 text-tmdb-blue" />
                ) : (
                  <BookmarkIcon className="w-5 h-5 text-white" />
                )}
              </button>
              <button
                onClick={handleFavoriteClick}
                className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                aria-label={
                  inFavorites ? "Hapus dari favorit" : "Tambahkan ke favorit"
                }
              >
                {inFavorites ? (
                  <HeartIconSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
      <div className="mt-2">
        <h3 className="text-sm font-medium truncate">{movie.title}</h3>
        {releaseYear && <p className="text-xs text-gray-500">{releaseYear}</p>}
      </div>
      {showLoginPopup && (
        <LoginPopup
          onClose={() => setShowLoginPopup(false)}
          onLogin={handleLogin}
          message={loginMessage}
        />
      )}
    </div>
  );
};

export default MovieCard;
