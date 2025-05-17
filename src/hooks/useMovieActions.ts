import { useCallback } from "react";
import {
  getNowPlayingMovies,
  getTopRatedMovies,
  getMovieDetails,
  searchMovies,
} from "../api/tmdbApi";
import type { AuthState } from "../api/types";

type DispatchFunction = (action: any) => void;

export const useMovieActions = (
  dispatch: DispatchFunction,
  _authState: AuthState
) => {
  const fetchNowPlaying = useCallback(async () => {
    dispatch({ type: "FETCH_NOW_PLAYING_START" });
    try {
      const movies = await getNowPlayingMovies();
      dispatch({ type: "FETCH_NOW_PLAYING_SUCCESS", payload: movies });
    } catch (error) {
      dispatch({
        type: "FETCH_NOW_PLAYING_FAILURE",
        payload: "Gagal memuat film yang sedang tayang",
      });
    }
  }, [dispatch]);

  const fetchTopRated = useCallback(async () => {
    dispatch({ type: "FETCH_TOP_RATED_START" });
    try {
      const movies = await getTopRatedMovies();
      dispatch({ type: "FETCH_TOP_RATED_SUCCESS", payload: movies });
    } catch (error) {
      dispatch({
        type: "FETCH_TOP_RATED_FAILURE",
        payload: "Gagal memuat film dengan rating tertinggi",
      });
    }
  }, [dispatch]);

  const fetchMovieDetails = useCallback(
    async (movieId: string) => {
      dispatch({ type: "FETCH_MOVIE_DETAILS_START" });
      try {
        const movie = await getMovieDetails(movieId);
        dispatch({ type: "FETCH_MOVIE_DETAILS_SUCCESS", payload: movie });
      } catch (error) {
        dispatch({
          type: "FETCH_MOVIE_DETAILS_FAILURE",
          payload: "Gagal memuat detail film",
        });
      }
    },
    [dispatch]
  );

  const searchMoviesQuery = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        dispatch({ type: "CLEAR_SEARCH_RESULTS" });
        return;
      }

      dispatch({ type: "SEARCH_MOVIES_START" });
      try {
        const results = await searchMovies(query);
        dispatch({ type: "SEARCH_MOVIES_SUCCESS", payload: results });
      } catch (error) {
        dispatch({
          type: "SEARCH_MOVIES_FAILURE",
          payload: "Gagal mencari film",
        });
      }
    },
    [dispatch]
  );

  const clearSearchResults = useCallback(() => {
    dispatch({ type: "CLEAR_SEARCH_RESULTS" });
  }, [dispatch]);

  return {
    fetchNowPlaying,
    fetchTopRated,
    fetchMovieDetails,
    searchMoviesQuery,
    clearSearchResults,
  };
};
