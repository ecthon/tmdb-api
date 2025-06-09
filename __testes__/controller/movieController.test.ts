import { MovieController } from '../../src/controllers/movieController';
import { MovieService } from '../../src/services/movieService';

jest.mock('../../src/services/movieService');

describe('MovieController', () => {
  let controller: MovieController;
  let req: any;
  let res: any;

  beforeEach(() => {
    controller = new MovieController();
    req = { query: {}, params: {}, body: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  it('deve retornar filmes paginados', async () => {
    (MovieService.prototype.getAllMovies as jest.Mock).mockResolvedValueOnce({ movies: [{ id: '1', title: 'Filme Teste' }], pagination: { total: 1 } });
    await controller.getAllMovies(req, res);
    expect(res.json).toHaveBeenCalledWith({ movies: [{ id: '1', title: 'Filme Teste' }], pagination: { total: 1 } });
  });

  it('deve retornar erro 404 se filme não encontrado por id', async () => {
    req.params.id = '1';
    (MovieService.prototype.getMovieById as jest.Mock).mockResolvedValueOnce(null);
    await controller.getMovieById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Filme não encontrado' });
  });

  it('deve criar um novo filme', async () => {
    req.body = { movie_id: 1, title: 'Novo Filme', original_title: 'Novo Filme', overview: '', status: 'Released', release_date: new Date(), original_language: 'pt' };
    (MovieService.prototype.createMovie as jest.Mock).mockResolvedValueOnce({ id: '1', title: 'Novo Filme' });
    await controller.createMovie(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: '1', title: 'Novo Filme' });
  });
}); 