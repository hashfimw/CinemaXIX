import React, { useEffect } from "react";
import MovieList from "../components/movie/MovieList";
import { useMovies } from "../context/MoviesContext";
import LoadingSpinner from "@/components/common/Loading";

const Home: React.FC = () => {
  const { state, fetchNowPlaying, fetchTopRated } = useMovies();
  const { nowPlaying, topRated, loading, error } = state;

  useEffect(() => {
    fetchNowPlaying();
    fetchTopRated();
  }, []);

  if (loading && (!nowPlaying.length || !topRated.length)) {
    return <LoadingSpinner fullHeight />;
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
