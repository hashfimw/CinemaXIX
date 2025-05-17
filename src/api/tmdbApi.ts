import axios from "axios";
import type {
  Movie,
  MovieDetails,
  MoviesResponse,
  SearchResponse,
} from "./types";

const tmdbApiV4 = axios.create({
  baseURL: "https://api.themoviedb.org/4",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
  },
});

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
  },
});

export const getImageUrl = (
  path: string | null,
  size: string = "w500"
): string => {
  if (!path) return "/placeholder-poster.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getNowPlayingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await tmdbApiV4.get<MoviesResponse>("/list/1");
    return response.data.results;
  } catch (error) {
    console.error(
      "Error fetching now playing movies from v4, fallback to v3:",
      error
    );
    try {
      const response = await tmdbApi.get<MoviesResponse>("/movie/now_playing");
      return response.data.results;
    } catch (v3Error) {
      console.error("Error fetching now playing movies from v3:", v3Error);
      throw v3Error;
    }
  }
};

export const getTopRatedMovies = async (): Promise<Movie[]> => {
  try {
    const response = await tmdbApiV4.get<MoviesResponse>("/list/3");
    return response.data.results;
  } catch (error) {
    console.error(
      "Error fetching top rated movies from v4, fallback to v3:",
      error
    );
    try {
      const response = await tmdbApi.get<MoviesResponse>("/movie/top_rated");
      return response.data.results;
    } catch (v3Error) {
      console.error("Error fetching top rated movies from v3:", v3Error);
      throw v3Error;
    }
  }
};

export const getMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await tmdbApi.get<MovieDetails>(
      `/movie/${movieId}?append_to_response=videos,credits`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for movie ${movieId}:`, error);
    throw error;
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get<SearchResponse>("/search/movie", {
      params: { query },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const createRequestToken = async () => {
  try {
    const response = await tmdbApi.get("/authentication/token/new");
    return response.data.request_token;
  } catch (error) {
    console.error("Error creating request token:", error);
    throw error;
  }
};

export const createSession = async (requestToken: string) => {
  try {
    const response = await tmdbApi.post("/authentication/session/new", {
      request_token: requestToken,
    });
    return response.data.session_id;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

export const deleteSession = async (sessionId: string) => {
  try {
    await tmdbApi.delete("/authentication/session", {
      data: { session_id: sessionId },
    });
    return true;
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
};

export const getAccountDetails = async (sessionId: string) => {
  try {
    const response = await tmdbApi.get("/account", {
      params: { session_id: sessionId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching account details:", error);
    throw error;
  }
};

export const getWatchlist = async (
  sessionId: string,
  accountId: string
): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get<MoviesResponse>(
      `/account/${accountId}/watchlist/movies`,
      {
        params: { session_id: sessionId },
      }
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    throw error;
  }
};

export const getFavorites = async (
  sessionId: string,
  accountId: string
): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get<MoviesResponse>(
      `/account/${accountId}/favorite/movies`,
      {
        params: { session_id: sessionId },
      }
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};

export const addToWatchlist = async (
  sessionId: string,
  accountId: string,
  movieId: number,
  watchlist: boolean
) => {
  try {
    await tmdbApi.post(
      `/account/${accountId}/watchlist`,
      {
        media_type: "movie",
        media_id: movieId,
        watchlist,
      },
      {
        params: { session_id: sessionId },
      }
    );
    return true;
  } catch (error) {
    console.error("Error updating watchlist:", error);
    throw error;
  }
};

export const addToFavorites = async (
  sessionId: string,
  accountId: string,
  movieId: number,
  favorite: boolean
) => {
  try {
    await tmdbApi.post(
      `/account/${accountId}/favorite`,
      {
        media_type: "movie",
        media_id: movieId,
        favorite,
      },
      {
        params: { session_id: sessionId },
      }
    );
    return true;
  } catch (error) {
    console.error("Error updating favorites:", error);
    throw error;
  }
};

export const rateMovie = async (
  sessionId: string,
  movieId: number,
  rating: number
) => {
  try {
    await tmdbApi.post(
      `/movie/${movieId}/rating`,
      {
        value: rating,
      },
      {
        params: { session_id: sessionId },
      }
    );
    return true;
  } catch (error) {
    console.error("Error rating movie:", error);
    throw error;
  }
};

export { tmdbApi, tmdbApiV4 };
