export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  genres?: Genre[];
  popularity: number;
  adult: boolean;
  original_language: string;
  runtime?: number;
  tagline?: string;
  imdb_id?: string;
  status?: string;
}

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface WatchProviderResult {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface MovieFilters {
  genreIds?: number[];
  startYear?: number;
  endYear?: number;
  minRating?: number;
}

export interface TMDBGenreResponse {
  genres: Genre[];
}

export interface TMDBDiscoverResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieResponse {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  popularity: number;
  adult: boolean;
  original_language: string;
  runtime: number;
  status: string;
  tagline: string;
  imdb_id: string;
}

export interface TMDBWatchProvidersResponse {
  id: number;
  results: {
    [countryCode: string]: WatchProviderResult;
  };
}
