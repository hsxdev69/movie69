// TMDB API service layer
const API_KEY = "d3a8b762c1c9cbf6e8d16b223a94614f";
export const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE = "https://image.tmdb.org/t/p/";

export type MediaType = "movie" | "tv";

export interface Genre {
  id: number;
  name: string;
}

export interface Media {
  id: number;
  media_type?: MediaType;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  number_of_seasons?: number;
  adult?: boolean;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
  iso_639_1?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface MediaDetails extends Media {
  videos?: { results: Video[] };
  credits?: { cast: CastMember[] };
  similar?: { results: Media[] };
  "watch/providers"?: { results: Record<string, WatchProviderCountry> };
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function imageUrl(path: string | null | undefined, size: string = "w500"): string {
  if (!path) return "";
  return `${IMAGE_BASE}${size}${path}`;
}

export function title(media: Media): string {
  return media.title ?? media.name ?? "Untitled";
}

export function releaseYear(media: Media): string {
  const date = media.release_date ?? media.first_air_date;
  return date ? date.slice(0, 4) : "";
}

// ---- Listing endpoints ----
export const getTrending = (timeWindow: "day" | "week" = "week") =>
  tmdbFetch<{ results: Media[] }>(`/trending/all/${timeWindow}`).then((r) => r.results);

export const getPopularMovies = (page = 1) =>
  tmdbFetch<{ results: Media[] }>("/movie/popular", { page }).then((r) =>
    r.results.map((m) => ({ ...m, media_type: "movie" as MediaType }))
  );

export const getTopRatedMovies = (page = 1) =>
  tmdbFetch<{ results: Media[] }>("/movie/top_rated", { page }).then((r) =>
    r.results.map((m) => ({ ...m, media_type: "movie" as MediaType }))
  );

export const getUpcomingMovies = (page = 1) =>
  tmdbFetch<{ results: Media[] }>("/movie/upcoming", { page }).then((r) =>
    r.results.map((m) => ({ ...m, media_type: "movie" as MediaType }))
  );

export const getNowPlayingMovies = (page = 1) =>
  tmdbFetch<{ results: Media[] }>("/movie/now_playing", { page }).then((r) =>
    r.results.map((m) => ({ ...m, media_type: "movie" as MediaType }))
  );

export const getPopularTV = (page = 1) =>
  tmdbFetch<{ results: Media[] }>("/tv/popular", { page }).then((r) =>
    r.results.map((m) => ({ ...m, media_type: "tv" as MediaType }))
  );

export const getTopRatedTV = (page = 1) =>
  tmdbFetch<{ results: Media[] }>("/tv/top_rated", { page }).then((r) =>
    r.results.map((m) => ({ ...m, media_type: "tv" as MediaType }))
  );

export const getAiringTodayTV = (page = 1) =>
  tmdbFetch<{ results: Media[] }>("/tv/airing_today", { page }).then((r) =>
    r.results.map((m) => ({ ...m, media_type: "tv" as MediaType }))
  );

export const discoverByGenre = (mediaType: MediaType, genreId: number, page = 1) =>
  tmdbFetch<{ results: Media[] }>(`/discover/${mediaType}`, { with_genres: genreId, page }).then((r) =>
    r.results.map((m) => ({ ...m, media_type: mediaType }))
  );

export const getGenres = (mediaType: MediaType) =>
  tmdbFetch<{ genres: Genre[] }>(`/genre/${mediaType}/list`).then((r) => r.genres);

export const searchMulti = (query: string, page = 1) =>
  tmdbFetch<{ results: Media[] }>("/search/multi", { query, page, include_adult: "false" }).then((r) =>
    r.results.filter((m) => m.media_type === "movie" || m.media_type === "tv")
  );

export const getDetails = (mediaType: MediaType, id: number) =>
  tmdbFetch<MediaDetails>(`/${mediaType}/${id}`, {
    append_to_response: "videos,credits,similar,watch/providers",
  }).then((m) => ({ ...m, media_type: mediaType }));

export const getVideos = (mediaType: MediaType, id: number) =>
  tmdbFetch<{ id: number; results: Video[] }>(`/${mediaType}/${id}/videos`).then((r) => r.results);

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface WatchProviderCountry {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  free?: WatchProvider[];
  ads?: WatchProvider[];
}

export const getWatchProviders = (mediaType: MediaType, id: number) =>
  tmdbFetch<{ id: number; results: Record<string, WatchProviderCountry> }>(
    `/${mediaType}/${id}/watch/providers`
  ).then((r) => r.results);

export function pickCountryProviders(
  results: Record<string, WatchProviderCountry> | undefined
): { code: string; data: WatchProviderCountry } | null {
  if (!results) return null;
  // Try user's likely region first, then fall back to US
  const prefs = ["IN", "US", "GB", "CA", "AU"];
  for (const c of prefs) {
    if (results[c]) return { code: c, data: results[c] };
  }
  const keys = Object.keys(results);
  if (keys.length === 0) return null;
  return { code: keys[0], data: results[keys[0]] };
}
