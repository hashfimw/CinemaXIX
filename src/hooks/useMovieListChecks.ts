import { useMemo } from "react";
import type { Movie } from "../api/types";

type MovieList = {
  watchlist: Movie[];
  favorites: Movie[];
};

export const useMovieListChecks = (movieLists: MovieList) => {
  const isInWatchlist = useMemo(
    () => (movieId: number) => {
      return movieLists.watchlist.some((movie) => movie.id === movieId);
    },
    [movieLists.watchlist]
  );

  const isInFavorites = useMemo(
    () => (movieId: number) => {
      return movieLists.favorites.some((movie) => movie.id === movieId);
    },
    [movieLists.favorites]
  );

  return {
    isInWatchlist,
    isInFavorites,
  };
};
