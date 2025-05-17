import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

import { moviesReducer, initialState } from "./movies/moviesReducer";
import { useMovieActions } from "../hooks/useMovieActions";
import { useUserMovieActions } from "../hooks/useUserMovieActions";
import { useMovieListChecks } from "../hooks/useMovieListChecks";
import type { MoviesContextType } from "./movies/types";

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

export const MoviesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(moviesReducer, initialState);
  const { authState } = useAuth();
  const movieActions = useMovieActions(dispatch, authState);
  const userMovieActions = useUserMovieActions(dispatch, authState);
  const movieListChecks = useMovieListChecks({
    watchlist: state.watchlist,
    favorites: state.favorites,
  });

  useEffect(() => {
    movieActions.fetchNowPlaying();
    movieActions.fetchTopRated();
  }, []);

  useEffect(() => {
    if (authState.isAuthenticated) {
      userMovieActions.fetchWatchlist();
      userMovieActions.fetchFavorites();
    }
  }, [authState.isAuthenticated]);

  const contextValue: MoviesContextType = {
    state,
    ...movieActions,
    ...userMovieActions,
    ...movieListChecks,
  };

  return (
    <MoviesContext.Provider value={contextValue}>
      {children}
    </MoviesContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MoviesContext);
  if (context === undefined) {
    throw new Error("useMovies must be used within a MoviesProvider");
  }
  return context;
};
