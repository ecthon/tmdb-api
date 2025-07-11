import { Request, Response } from 'express';
import { MovieService } from '../services/movieService';
import { MovieFilters } from '../types/movie.types';

const movieService = new MovieService();

export class MovieController {
  async getAllMovies(req: Request, res: Response) {
    console.log('Entrou no MovieController');
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters: MovieFilters = {};
      if (req.query.title) filters.title = req.query.title as string;
      if (req.query.status) filters.status = req.query.status as string;
      if (req.query.year) filters.year = parseInt(req.query.year as string);
      if (req.query.adult) filters.adult = req.query.adult === 'true';

      const result = await movieService.getAllMovies(page, limit, filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar filmes' });
    }
  }

  async getMovieById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'ID é obrigatório' });
        return;
      }
      const movie = await movieService.getMovieById(id);

      if (!movie) {
        res.status(404).json({ error: 'Filme não encontrado' });
        return;
      }

      res.json(movie);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar filme' });
    }
  }

  async createMovie(req: Request, res: Response) {
    try {
      const movieData = req.body;
      const movie = await movieService.createMovie(movieData);
      res.status(201).json(movie);
    } catch (error: any) {
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'Filme com este movie_id já existe' });
        return;
      }
      res.status(500).json({ error: 'Erro ao criar filme' });
    }
  }

  async updateMovie(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'ID é obrigatório' });
        return;
      }
      const updateData = req.body;

      const movie = await movieService.updateMovie(id, updateData);
      res.json(movie);
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Filme não encontrado' });
        return;
      }
      res.status(500).json({ error: 'Erro ao atualizar filme' });
    }
  }

  async deleteMovie(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'ID é obrigatório' });
        return;
      }
      await movieService.deleteMovie(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Filme não encontrado' });
        return;
      }
      res.status(500).json({ error: 'Erro ao deletar filme' });
    }
  }

  async searchMovies(req: Request, res: Response) {
    try {
      const { q, genre } = req.query;
  
      if (!q && !genre) {
        res.status(400).json({ error: 'Informe pelo menos um parâmetro de busca (nome ou gênero)' });
        return;
      }
  
      const movies = await movieService.searchMovies(q as string, genre as string);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar filmes' });
    }
  }

  async recommendMovies(req: Request, res: Response) {
    try {
      const language = req.query.language as string | undefined;
      const result = await movieService.recommendMovies(language);
      res.json(result);
    } catch (error) {
      console.error('Erro em recommendMovies:', error);
      res.status(500).json({ error: 'Erro ao selecionar filmes' });
    }
  }

  async getMoviesPerYear(req: Request, res: Response) {
    try {
      const result = await movieService.getMoviesPerYear();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar filmes por ano' });
    }
  }

}
