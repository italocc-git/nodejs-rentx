import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';
import createConection from '@shared/infra/typeorm';
import '../../container';
import { AppError } from '@shared/errors/AppError';
import { router } from './routes';

import swaggerJsonFile from '../../../swagger.json';

createConection();
const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsonFile));
app.use(router);

/* Middleware para interceptar mensagens de erro customizadas */

app.use((err: Error, request: Request, response: Response) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            message: err.message,
        });
    }
    return response.status(500).json({
        status: 'error',
        message: `Internal server error - ${err.message}`,
    });
});

export { app };
