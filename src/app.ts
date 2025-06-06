import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import movieRoutes from './routes/movieRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/movies", movieRoutes);

export default app;