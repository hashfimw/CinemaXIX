import { useCallback } from "react";
import {
  getWatchlist,
  getFavorites,
  addToWatchlist as apiAddToWatchlist,
  addToFavorites as apiAddToFavorites,
} from "../api/tmdbApi";
import type { AuthState, Movie } from "../api/types";

type DispatchFunction = (action: any) => void;

export const useUserMovieActions = (
  dispatch: DispatchFunction,
  authState: AuthState
) => {
  const checkAuthRequirements = useCallback(() => {
    if (
      !authState.isAuthenticated ||
      !authState.sessionId ||
      !authState.accountId
    ) {
      return false;
    }
    return true;
  }, [authState]);

  const fetchWatchlist = useCallback(async () => {
    if (!checkAuthRequirements()) {
      return;
    }

    dispatch({ type: "FETCH_WATCHLIST_START" });
    try {
      const movies = await getWatchlist(
        authState.sessionId!,
        authState.accountId!
      );
      dispatch({ type: "FETCH_WATCHLIST_SUCCESS", payload: movies });
    } catch (error) {
      dispatch({
        type: "FETCH_WATCHLIST_FAILURE",
        payload: "Gagal memuat watchlist",
      });
    }
  }, [dispatch, authState, checkAuthRequirements]);

  const fetchFavorites = useCallback(async () => {
    if (!checkAuthRequirements()) {
      return;
    }

    dispatch({ type: "FETCH_FAVORITES_START" });
    try {
      const movies = await getFavorites(
        authState.sessionId!,
        authState.accountId!
      );
      dispatch({ type: "FETCH_FAVORITES_SUCCESS", payload: movies });
    } catch (error) {
      dispatch({
        type: "FETCH_FAVORITES_FAILURE",
        payload: "Gagal memuat film favorit",
      });
    }
  }, [dispatch, authState, checkAuthRequirements]);

  const addToWatchlist = useCallback(
    async (movie: Movie) => {
      if (!checkAuthRequirements()) {
        throw new Error("Login diperlukan untuk menambahkan ke watchlist");
      }

      try {
        await apiAddToWatchlist(
          authState.sessionId!,
          authState.accountId!,
          movie.id,
          true
        );
        dispatch({ type: "ADD_TO_WATCHLIST", payload: movie });
      } catch (error) {
        console.error("Error adding to watchlist:", error);
        throw error;
      }
    },
    [dispatch, authState, checkAuthRequirements]
  );

  const removeFromWatchlist = useCallback(
    async (movieId: number) => {
      if (!checkAuthRequirements()) {
        throw new Error("Login diperlukan untuk menghapus dari watchlist");
      }

      try {
        await apiAddToWatchlist(
          authState.sessionId!,
          authState.accountId!,
          movieId,
          false
        );
        dispatch({ type: "REMOVE_FROM_WATCHLIST", payload: movieId });
      } catch (error) {
        console.error("Error removing from watchlist:", error);
        throw error;
      }
    },
    [dispatch, authState, checkAuthRequirements]
  );

  const addToFavorites = useCallback(
    async (movie: Movie) => {
      if (!checkAuthRequirements()) {
        throw new Error("Login diperlukan untuk menambahkan ke favorit");
      }

      try {
        await apiAddToFavorites(
          authState.sessionId!,
          authState.accountId!,
          movie.id,
          true
        );
        dispatch({ type: "ADD_TO_FAVORITES", payload: movie });
      } catch (error) {
        console.error("Error adding to favorites:", error);
        throw error;
      }
    },
    [dispatch, authState, checkAuthRequirements]
  );

  const removeFromFavorites = useCallback(
    async (movieId: number) => {
      if (!checkAuthRequirements()) {
        throw new Error("Login diperlukan untuk menghapus dari favorit");
      }

      try {
        await apiAddToFavorites(
          authState.sessionId!,
          authState.accountId!,
          movieId,
          false
        );
        dispatch({ type: "REMOVE_FROM_FAVORITES", payload: movieId });
      } catch (error) {
        console.error("Error removing from favorites:", error);
        throw error;
      }
    },
    [dispatch, authState, checkAuthRequirements]
  );

  return {
    fetchWatchlist,
    fetchFavorites,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
  };
};
