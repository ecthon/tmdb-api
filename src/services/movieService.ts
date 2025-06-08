import prisma from '../utils/prisma';
import { CreateMovieDto, UpdateMovieDto, MovieFilters } from '../types/movie.types';

export class MovieService {
  async getAllMovies(page: number = 1, limit: number = 10, filters?: MovieFilters) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (filters?.title) {
      where.title = { contains: filters.title, mode: 'insensitive' };
    }
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.adult !== undefined) {
      where.adult = filters.adult;
    }
    
    if (filters?.year) {
      where.release_date = {
        gte: new Date(`${filters.year}-01-01`),
        lt: new Date(`${filters.year + 1}-01-01`)
      };
    }

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        skip,
        take: limit,
        orderBy: { release_date: 'desc' }
      }),
      prisma.movie.count({ where })
    ]);

    return {
      movies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getMovieById(id: string) {
    return await prisma.movie.findUnique({
      where: { id }
    });
  }

  async getMovieByMovieId(movie_id: number) {
    return await prisma.movie.findUnique({
      where: { movie_id }
    });
  }

  async createMovie(data: CreateMovieDto) {
    return await prisma.movie.create({
      data
    });
  }

  async updateMovie(id: string, data: UpdateMovieDto) {
    return await prisma.movie.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });
  }

  async deleteMovie(id: string) {
    return await prisma.movie.delete({
      where: { id }
    });
  }

  async searchMovies(query?: string, genre?: string) {
    const where: any = {};
  
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { original_title: { contains: query, mode: 'insensitive' } },
        { overview: { contains: query, mode: 'insensitive' } }
      ];
    }
  
    if (genre) {
      // Supondo que genres é um array de strings
      where.genres = { has: genre };
    }
  
    return await prisma.movie.findMany({
      where,
      take: 20
    });
  }
}