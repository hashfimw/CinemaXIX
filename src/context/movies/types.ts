import type { Movie, MovieDetails } from "../../api/types";

export type MoviesState = {
  nowPlaying: Movie[];
  topRated: Movie[];
  watchlist: Movie[];
  favorites: Movie[];
  searchResults: Movie[];
  currentMovie: MovieDetails | null;
  loading: boolean;
  error: string | null;
};

export type MoviesAction =
  | { type: "FETCH_NOW_PLAYING_START" }
  | { type: "FETCH_NOW_PLAYING_SUCCESS"; payload: Movie[] }
  | { type: "FETCH_NOW_PLAYING_FAILURE"; payload: string }
  | { type: "FETCH_TOP_RATED_START" }
  | { type: "FETCH_TOP_RATED_SUCCESS"; payload: Movie[] }
  | { type: "FETCH_TOP_RATED_FAILURE"; payload: string }
  | { type: "FETCH_MOVIE_DETAILS_START" }
  | { type: "FETCH_MOVIE_DETAILS_SUCCESS"; payload: MovieDetails }
  | { type: "FETCH_MOVIE_DETAILS_FAILURE"; payload: string }
  | { type: "SEARCH_MOVIES_START" }
  | { type: "SEARCH_MOVIES_SUCCESS"; payload: Movie[] }
  | { type: "SEARCH_MOVIES_FAILURE"; payload: string }
  | { type: "FETCH_WATCHLIST_START" }
  | { type: "FETCH_WATCHLIST_SUCCESS"; payload: Movie[] }
  | { type: "FETCH_WATCHLIST_FAILURE"; payload: string }
  | { type: "FETCH_FAVORITES_START" }
  | { type: "FETCH_FAVORITES_SUCCESS"; payload: Movie[] }
  | { type: "FETCH_FAVORITES_FAILURE"; payload: string }
  | { type: "ADD_TO_WATCHLIST"; payload: Movie }
  | { type: "REMOVE_FROM_WATCHLIST"; payload: number }
  | { type: "ADD_TO_FAVORITES"; payload: Movie }
  | { type: "REMOVE_FROM_FAVORITES"; payload: number }
  | { type: "CLEAR_SEARCH_RESULTS" };

export interface MoviesContextType {
  state: MoviesState;
  fetchNowPlaying: () => Promise<void>;
  fetchTopRated: () => Promise<void>;
  fetchMovieDetails: (movieId: string) => Promise<void>;
  searchMoviesQuery: (query: string) => Promise<void>;
  clearSearchResults: () => void;
  fetchWatchlist: () => Promise<void>;
  fetchFavorites: () => Promise<void>;
  addToWatchlist: (movie: Movie) => Promise<void>;
  removeFromWatchlist: (movieId: number) => Promise<void>;
  addToFavorites: (movie: Movie) => Promise<void>;
  removeFromFavorites: (movieId: number) => Promise<void>;
  isInWatchlist: (movieId: number) => boolean;
  isInFavorites: (movieId: number) => boolean;
}
