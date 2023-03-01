import { injectable, inject } from 'tsyringe';
/* eslint-disable prettier/prettier */

import { Category } from '@modules/cars/infra/typeorm/entities/Category';
import { ICategoriesRepository } from '@modules/cars/repositories/ICategoriesRepository';

@injectable()
class ListCategoryUseCase {
    constructor(
        @inject('CategoriesRepository')
        private categoryRepository: ICategoriesRepository) { }
    async execute(): Promise<Category[]> {

        const categoriesList = await this.categoryRepository.list()
        return categoriesList
    }
}

export { ListCategoryUseCase };
