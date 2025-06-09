import { Router } from 'express';
import { MovieController } from '../controllers/movieController';

const router = Router();

const movieController = new MovieController();

// GET /api/movies - Listar todos os filmes com paginação e filtros
router.get('/', movieController.getAllMovies);

// GET /api/movies/search - Buscar filmes
router.get('/search', movieController.searchMovies);

// GET /api/movies/recommend - Recomendar filmes
router.get('/recommend', movieController.recommendMovies);

// GET /api/movies/:id - Buscar filme por ID
router.get('/:id', movieController.getMovieById);

// POST /api/movies - Criar novo filme
router.post('/', movieController.createMovie);

// PUT /api/movies/:id - Atualizar filme
router.put('/:id', movieController.updateMovie);

// DELETE /api/movies/:id - Deletar filme
router.delete('/:id', movieController.deleteMovie);

export default router;
