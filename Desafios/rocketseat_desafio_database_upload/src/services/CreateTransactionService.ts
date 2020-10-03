import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import CreateCategoryService from './CreateCategoryService';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const isValidType = type === 'income' || type === 'outcome';

    if (!isValidType) {
      throw new AppError('type is invalid');
    }

    const categoryService = new CreateCategoryService();
    const categoryFinded = await categoryService.execute({ title: category });

    const transactionRepository = getRepository(Transaction);

    if (type === 'outcome') {
      const allIncomes = (
        await transactionRepository.find({ type: 'income' })
      ).reduce((acc, cur) => acc + cur.value, 0);

      if (allIncomes < value) {
        throw new AppError('not enough balance');
      }
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryFinded.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
