export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  production_companies: ProductionCompany[];
  videos: {
    results: Video[];
  };
  credits: {
    cast: Cast[];
    crew: Crew[];
  };
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Account {
  id: number;
  name: string;
  username: string;
  avatar: {
    gravatar: {
      hash: string;
    };
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  sessionId: string | null;
  accountId: string | null;
  username: string | null;
  loading: boolean;
  error: string | null;
}

export interface MoviesState {
  nowPlaying: Movie[];
  topRated: Movie[];
  watchlist: Movie[];
  favorites: Movie[];
  searchResults: Movie[];
  currentMovie: MovieDetails | null;
  loading: boolean;
  error: string | null;
}
