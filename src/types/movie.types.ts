export interface CreateMovieDto {
    movie_id: number;
    title: string;
    original_title: string;
    overview: string;
    tagline?: string;
    status: string;
    release_date: Date;
    runtime?: number;
    adult?: boolean;
    original_language: string;
    homepage?: string;
    imdb_id?: string;
    budget?: number;
    revenue?: number;
    vote_average?: number;
    vote_count?: number;
    popularity?: number;
    backdrop_path?: string;
    poster_path?: string;
    genres?: string[];
    production_companies?: string[];
    production_countries?: string[];
    spoken_languages?: string[];
    keywords?: string[];
  }
  
  export interface UpdateMovieDto extends Partial<CreateMovieDto> {}
  
  export interface MovieFilters {
    title?: string;
    genre?: string;
    year?: number;
    status?: string;
    adult?: boolean;
  }