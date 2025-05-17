import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import MovieCard from "../components/movie/MovieCard";
import { useMovies } from "../context/MoviesContext";
import LoadingSpinner from "@/components/common/Loading";

const Search: React.FC = () => {
  const location = useLocation();
  const { searchMoviesQuery, clearSearchResults, state } = useMovies();
  const { searchResults, loading, error } = state;

  const query = new URLSearchParams(location.search).get("query") || "";

  useEffect(() => {
    if (query) {
      searchMoviesQuery(query);
    } else {
      clearSearchResults();
    }

    return () => {
      clearSearchResults();
    };
  }, [query]);

  if (loading && !searchResults.length) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => searchMoviesQuery(query)}
          className="btn btn-primary"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {searchResults.length > 0
          ? `Hasil pencarian untuk "${query}"`
          : `Tidak ditemukan hasil untuk "${query}"`}
      </h1>

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {searchResults.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white/70">Coba cari dengan kata kunci lain.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
