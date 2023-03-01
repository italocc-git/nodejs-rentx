import { container } from 'tsyringe';
/* eslint-disable prettier/prettier */
import { Request, Response } from 'express';
import { ListCategoryUseCase } from './ListCategoriesUseCase';

class ListCategoriesController {


    async handle(request: Request, response: Response): Promise<Response> {
        const listCategoriesUseCase = container.resolve(ListCategoryUseCase)
        const categories = await listCategoriesUseCase.execute();

        return response.json(categories);
    }
}

export { ListCategoriesController };
