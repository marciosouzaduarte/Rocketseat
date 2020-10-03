import path from 'path';
import { Router } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';

import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';

import Transaction from '../models/Transaction';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../configs/upload.config';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getRepository(Transaction);
  const transactions = await transactionRepository.find();
  const customTransactionRepository = getCustomRepository(
    TransactionsRepository,
  );
  const balance = await customTransactionRepository.getBalance();

  return response.send({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const transactionService = new CreateTransactionService();
  const transaction = await transactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.send(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const transactionService = new DeleteTransactionService();
  const transaction = await transactionService.execute({
    id: request.params.id,
  });
  return response.send(transaction);
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const csvFilePath = path.resolve(
      uploadConfig.locationPath,
      request.file.filename,
    );

    const transactionService = new ImportTransactionsService();
    const transaction = await transactionService.execute({
      csvFilePath,
    });
    return response.send(transaction);
  },
);

export default transactionsRouter;
