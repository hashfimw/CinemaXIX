import type { MoviesState } from "../../api/types";
import type { MoviesAction } from "./types";

export const initialState: MoviesState = {
  nowPlaying: [],
  topRated: [],
  watchlist: [],
  favorites: [],
  searchResults: [],
  currentMovie: null,
  loading: false,
  error: null,
};

export const moviesReducer = (
  state: MoviesState,
  action: MoviesAction
): MoviesState => {
  switch (action.type) {
    case "FETCH_NOW_PLAYING_START":
    case "FETCH_TOP_RATED_START":
    case "FETCH_MOVIE_DETAILS_START":
    case "SEARCH_MOVIES_START":
    case "FETCH_WATCHLIST_START":
    case "FETCH_FAVORITES_START":
      return { ...state, loading: true, error: null };

    case "FETCH_NOW_PLAYING_SUCCESS":
      return { ...state, nowPlaying: action.payload, loading: false };

    case "FETCH_TOP_RATED_SUCCESS":
      return { ...state, topRated: action.payload, loading: false };

    case "FETCH_MOVIE_DETAILS_SUCCESS":
      return { ...state, currentMovie: action.payload, loading: false };

    case "SEARCH_MOVIES_SUCCESS":
      return { ...state, searchResults: action.payload, loading: false };

    case "FETCH_WATCHLIST_SUCCESS":
      return { ...state, watchlist: action.payload, loading: false };

    case "FETCH_FAVORITES_SUCCESS":
      return { ...state, favorites: action.payload, loading: false };

    case "FETCH_NOW_PLAYING_FAILURE":
    case "FETCH_TOP_RATED_FAILURE":
    case "FETCH_MOVIE_DETAILS_FAILURE":
    case "SEARCH_MOVIES_FAILURE":
    case "FETCH_WATCHLIST_FAILURE":
    case "FETCH_FAVORITES_FAILURE":
      return { ...state, error: action.payload, loading: false };

    case "CLEAR_SEARCH_RESULTS":
      return { ...state, searchResults: [] };

    case "ADD_TO_WATCHLIST":
      return {
        ...state,
        watchlist: [...state.watchlist, action.payload],
      };

    case "REMOVE_FROM_WATCHLIST":
      return {
        ...state,
        watchlist: state.watchlist.filter(
          (movie) => movie.id !== action.payload
        ),
      };

    case "ADD_TO_FAVORITES":
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    case "REMOVE_FROM_FAVORITES":
      return {
        ...state,
        favorites: state.favorites.filter(
          (movie) => movie.id !== action.payload
        ),
      };

    default:
      return state;
  }
};
