/* eslint-disable prettier/prettier */
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ImportCategoryUseCase } from './ImportCategoryUseCase';

class ImportCategoryController {


    async handle(request: Request, response: Response): Promise<Response> {
        const { file } = request;

        const createCategoryUseCase = container.resolve(ImportCategoryUseCase)

        await createCategoryUseCase.execute(file);
        return response.status(201).send();
    }
}

export { ImportCategoryController };
