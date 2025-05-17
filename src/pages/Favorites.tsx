import React, { useEffect } from "react";
import MovieCard from "../components/movie/MovieCard";
import { useMovies } from "../context/MoviesContext";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "@/components/common/Loading";

const Favorites: React.FC = () => {
  const { state, fetchFavorites } = useMovies();
  const { authState } = useAuth();
  const { favorites, loading, error } = state;

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchFavorites();
    }
  }, [authState.isAuthenticated]);

  if (!authState.isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (loading && !favorites.length) {
    return <LoadingSpinner fullHeight />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => fetchFavorites()} className="btn btn-primary">
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Film Favorit Anda</h1>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card-bg rounded-lg">
          <p className="text-white/70 mb-4">
            Daftar favorit Anda masih kosong.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="btn btn-primary"
          >
            Jelajahi Film
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
