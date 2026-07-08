export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  media_type?: string;
  popularity: number;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status: string;
  tagline: string;
  homepage: string;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  spoken_languages: { english_name: string }[];
  videos?: { results: Video[] };
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  similar?: { results: Movie[] };
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export type ContentType = 'movie' | 'tv' | 'all';
