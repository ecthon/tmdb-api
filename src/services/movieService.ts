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

  // Desafio extra
  async recommendMovies(language?: string) {
    console.log('Entrou no recommendMovies');
    // 1. Filtros básicos
    const where: any = {
      status: 'Released',
      adult: false,
      vote_average: { gte: 6.0 },
      popularity: { gte: 10 },
      release_date: {
        gte: new Date('2020-01-01'),
        lte: new Date(),
      },
    };

    // 2. Priorizar idioma do usuário ou inglês
    if (language) {
      where.OR = [
        { original_language: language },
        { original_language: 'en' },
      ];
    } else {
      where.OR = [
        { original_language: 'pt' },
        { original_language: 'en' },
      ];
    }

    // 3. Buscar muitos filmes para garantir diversidade
    const filmes = await prisma.movie.findMany({
      where,
      orderBy: [
        { vote_average: 'desc' },
        { popularity: 'desc' },
      ],
      take: 100, // Buscar mais para filtrar depois
    });

    // 4. Balancear gêneros
    const generoCount: Record<string, number> = {};
    const recomendados: any[] = [];
    for (const filme of filmes) {
      if (!filme.genres || filme.genres.length === 0) continue;
      // Pega o primeiro gênero como principal
      const principal = filme.genres[0];
      if (!principal) continue;
      if (!generoCount[principal]) generoCount[principal] = 0;
      if (generoCount[principal] >= 3) continue; // Limite por gênero
      recomendados.push(filme);
      generoCount[principal]++;
      if (recomendados.length >= 10) break;
    }

    // 5. Se não tiver 10, completa com outros filmes aleatórios
    if (recomendados.length < 10) {
      const restantes = filmes.filter(f => !recomendados.includes(f));
      while (recomendados.length < 10 && restantes.length > 0) {
        const idx = Math.floor(Math.random() * restantes.length);
        recomendados.push(restantes[idx]);
        restantes.splice(idx, 1);
      }
    }

    // 6. Embaralha para dar variedade
    for (let i = recomendados.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [recomendados[i], recomendados[j]] = [recomendados[j], recomendados[i]];
    }

    return recomendados.slice(0, 10);
  }

  async getMoviesPerYear() {
    // Prisma aggregation para agrupar por ano
    const result = await prisma.movie.groupBy({
      by: ['release_date'],
      _count: { _all: true },
    });

    // Agrupa por ano
    const yearMap: Record<number, number> = {};
    for (const item of result) {
      const year = new Date(item.release_date).getFullYear();
      if (!yearMap[year]) yearMap[year] = 0;
      yearMap[year] += item._count._all;
    }
    // Filtra para os últimos 10 anos
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 9;
    const timelineData = Object.entries(yearMap)
      .map(([year, movies]) => ({ year: Number(year), movies }))
      .filter(item => item.year >= minYear && item.year <= currentYear)
      .sort((a, b) => a.year - b.year);
    return timelineData;
  }
}