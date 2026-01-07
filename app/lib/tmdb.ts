"use server";

import axios, { AxiosInstance } from "axios";
import {
  Genre,
  Movie,
  MovieFilters,
  TMDBDiscoverResponse,
  TMDBGenreResponse,
  TMDBMovieResponse,
  TMDBWatchProvidersResponse,
  WatchProviderResult,
} from "./types";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const MAX_PAGES = 500;

function getApiKey(): string {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not set in environment variables");
  }
  return apiKey;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: getApiKey(),
    language: "pt-BR",
  },
  timeout: 10000,
});

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  try {
    const response = await axiosInstance.get<T>(endpoint, {
      params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`TMDB API error: ${error.response?.statusText || error.message}`);
    }
    throw error;
  }
}

export async function getGenres(): Promise<Genre[]> {
  try {
    const data = await fetchTMDB<TMDBGenreResponse>("/genre/movie/list");
    return data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

export async function getRandomMovie(filters: MovieFilters = {}): Promise<Movie | null> {
  try {
    const params: Record<string, string> = {
      sort_by: "popularity.desc",
      include_adult: "false",
      include_video: "false",
    };

    if (filters.genreIds && filters.genreIds.length > 0) {
      params.with_genres = filters.genreIds.join(",");
    }

    if (filters.startYear) {
      params["primary_release_date.gte"] = `${filters.startYear}-01-01`;
    }

    if (filters.endYear) {
      params["primary_release_date.lte"] = `${filters.endYear}-12-31`;
    }

    if (filters.minRating !== undefined && filters.minRating > 0) {
      params["vote_average.gte"] = filters.minRating.toString();
    }

    const initialResponse = await fetchTMDB<TMDBDiscoverResponse>("/discover/movie", {
      ...params,
      page: "1",
    });

    if (initialResponse.total_results === 0) {
      return null;
    }

    const totalPages = Math.min(initialResponse.total_pages, MAX_PAGES);
    const randomPage = Math.floor(Math.random() * totalPages) + 1;

    const randomPageResponse = await fetchTMDB<TMDBDiscoverResponse>("/discover/movie", {
      ...params,
      page: randomPage.toString(),
    });

    if (randomPageResponse.results.length === 0) {
      return null;
    }

    const validMovies = randomPageResponse.results.filter(
      (m) => m.poster_path && m.overview && m.overview.trim().length > 0
    );

    if (validMovies.length === 0) {
      return null;
    }

    const maxAttempts = Math.min(validMovies.length, 20);
    let attempts = 0;

    while (attempts < maxAttempts) {
      const randomIndex = Math.floor(Math.random() * validMovies.length);
      const movie = validMovies[randomIndex];

      const detailedMovie = await fetchTMDB<TMDBMovieResponse>(`/movie/${movie.id}`);

      if (detailedMovie.imdb_id && detailedMovie.poster_path && detailedMovie.overview && detailedMovie.overview.trim().length > 0) {
        return {
          ...movie,
          genres: detailedMovie.genres,
          runtime: detailedMovie.runtime,
          tagline: detailedMovie.tagline,
          imdb_id: detailedMovie.imdb_id,
          status: detailedMovie.status,
        };
      }

      attempts++;
    }

    return null;
  } catch (error) {
    console.error("Error fetching random movie:", error);
    return null;
  }
}

export async function getWatchProviders(movieId: number): Promise<WatchProviderResult | null> {
  try {
    const data = await fetchTMDB<TMDBWatchProvidersResponse>(`/movie/${movieId}/watch/providers`);

    return data.results["BR"] || null;
  } catch (error) {
    console.error("Error fetching watch providers:", error);
    return null;
  }
}


