import axios from "axios";

const API_KEY = "d3a8b762c1c9cbf6e8d16b223a94614f";
const BASE_URL = "https://api.themoviedb.org/3";

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  genre_ids: number[];
}

export interface TmdbResponse {
  results: Movie[];
}

export const IMAGE_BASE = "https://image.tmdb.org/t/p";

export const getImageUrl = (path: string | null, size: string = "w500"): string => {
  if (!path) return "/placeholder.jpg";
  return `${IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: string = "original"): string => {
  if (!path) return "";
  return `${IMAGE_BASE}/${size}${path}`;
};

export const fetchTrending = async (): Promise<Movie[]> => {
  const { data } = await tmdb.get<TmdbResponse>("/trending/all/week");
  return data.results;
};

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  const { data } = await tmdb.get<TmdbResponse>("/movie/popular");
  return data.results;
};

export const fetchTopRated = async (): Promise<Movie[]> => {
  const { data } = await tmdb.get<TmdbResponse>("/movie/top_rated");
  return data.results;
};

export const fetchUpcoming = async (): Promise<Movie[]> => {
  const { data } = await tmdb.get<TmdbResponse>("/movie/upcoming");
  return data.results;
};

export const fetchActionMovies = async (): Promise<Movie[]> => {
  const { data } = await tmdb.get<TmdbResponse>("/discover/movie", {
    params: { with_genres: 28 },
  });
  return data.results;
};

export const fetchComedyMovies = async (): Promise<Movie[]> => {
  const { data } = await tmdb.get<TmdbResponse>("/discover/movie", {
    params: { with_genres: 35 },
  });
  return data.results;
};

export const fetchHorrorMovies = async (): Promise<Movie[]> => {
  const { data } = await tmdb.get<TmdbResponse>("/discover/movie", {
    params: { with_genres: 27 },
  });
  return data.results;
};

export const fetchDocumentaries = async (): Promise<Movie[]> => {
  const { data } = await tmdb.get<TmdbResponse>("/discover/movie", {
    params: { with_genres: 99 },
  });
  return data.results;
};

export const fetchTVShows = async (): Promise<Movie[]> => {
  const { data } = await tmdb.get<TmdbResponse>("/tv/popular");
  return data.results;
};

export const fetchMovieDetails = async (id: number) => {
  const { data } = await tmdb.get(`/movie/${id}`);
  return data;
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query.trim()) return [];
  const { data } = await tmdb.get<TmdbResponse>("/search/multi", {
    params: { query, page: 1 },
  });
  return data.results.filter(
    (item) => (item.media_type === "movie" || item.media_type === "tv") && item.poster_path
  );
};
