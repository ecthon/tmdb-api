import { MovieService } from '../../src/services/movieService';
import prisma from '../../src/utils/prisma';

jest.mock('../../src/utils/prisma', () => ({
  __esModule: true,
  default: {
    movie: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      groupBy: jest.fn(),
    },
  },
}));

describe('MovieService', () => {
  const service = new MovieService();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar filmes paginados', async () => {
    (prisma.movie.findMany as jest.Mock).mockResolvedValueOnce([{ id: '1', title: 'Filme Teste' }]);
    (prisma.movie.count as jest.Mock).mockResolvedValueOnce(1);
    const result = await service.getAllMovies(1, 10);
    expect(result.movies).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
  });

  it('deve buscar filme por id', async () => {
    (prisma.movie.findUnique as jest.Mock).mockResolvedValueOnce({ id: '1', title: 'Filme Teste' });
    const movie = await service.getMovieById('1');
    expect(movie).toEqual({ id: '1', title: 'Filme Teste' });
  });

  it('deve criar um novo filme', async () => {
    (prisma.movie.create as jest.Mock).mockResolvedValueOnce({ id: '1', title: 'Novo Filme' });
    const movie = await service.createMovie({ movie_id: 1, title: 'Novo Filme', original_title: 'Novo Filme', overview: '', status: 'Released', release_date: new Date(), original_language: 'pt' });
    expect(movie).toEqual({ id: '1', title: 'Novo Filme' });
  });
}); 