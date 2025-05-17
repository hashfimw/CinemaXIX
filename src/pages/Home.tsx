import React, { useEffect } from "react";
import MovieList from "../components/movie/MovieList";
import { useMovies } from "../context/MoviesContext";

const Home: React.FC = () => {
  const { state, fetchNowPlaying, fetchTopRated } = useMovies();
  const { nowPlaying, topRated, loading, error } = state;

  useEffect(() => {
    fetchNowPlaying();
    fetchTopRated();
  }, []);

  if (loading && (!nowPlaying.length || !topRated.length)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-cinema-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => {
            fetchNowPlaying();
            fetchTopRated();
          }}
          className="btn btn-primary"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MovieList
        title="Now Playing"
        movies={nowPlaying}
        layout="scroll"
        viewAllLink="/movies/now-playing"
      />

      <MovieList
        title="Top Rated"
        movies={topRated}
        limit={12}
        viewAllLink="/movies/top-rated"
      />
    </div>
  );
};

export default Home;
