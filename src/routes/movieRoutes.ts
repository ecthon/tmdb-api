import { Router } from 'express';
import { MovieController } from '../controllers/movieController';
import asyncHandler from 'express-async-handler';

const router = Router();

const movieController = new MovieController();

// GET /api/movies - Listar todos os filmes com paginação e filtros
router.get('/', asyncHandler(movieController.getAllMovies.bind(movieController)));

// GET /api/movies/search - Buscar filmes
router.get('/search', asyncHandler(movieController.searchMovies.bind(movieController)));

// GET /api/movies/recommend - Recomendar filmes
router.get('/recommend', asyncHandler(movieController.recommendMovies.bind(movieController)));

// GET /api/movies/per-year - Quantidade de filmes lançados por ano
router.get('/per-year', asyncHandler(movieController.getMoviesPerYear.bind(movieController)));

// GET /api/movies/:id - Buscar filme por ID
router.get('/:id', asyncHandler(movieController.getMovieById.bind(movieController)));


// POST /api/movies - Criar novo filme
router.post('/', asyncHandler(movieController.createMovie.bind(movieController)));

// PUT /api/movies/:id - Atualizar filme
router.put('/:id', asyncHandler(movieController.updateMovie.bind(movieController)));

// DELETE /api/movies/:id - Deletar filme
router.delete('/:id', asyncHandler(movieController.deleteMovie.bind(movieController)));

export default router;
