import csvParse from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';
import AppError from '../errors/AppError';

interface Request {
  csvFilePath: string;
}

interface TempTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute({ csvFilePath }: Request): Promise<Transaction[]> {
    try {
      const readCSVStream = fs.createReadStream(csvFilePath);

      const parseStream = csvParse({
        from_line: 2,
        ltrim: true,
        rtrim: true,
      });

      const parseCSV = readCSVStream.pipe(parseStream);

      const transactions: TempTransaction[] = [];

      parseCSV.on('data', async line => {
        const [title, type, value, category] = line;
        const tempTransaction = { title, type, value, category };
        transactions.push(tempTransaction);
      });

      await new Promise(resolve => {
        parseCSV.on('end', resolve);
      });

      const returnedTransactions: Transaction[] = [];
      const transactionService = new CreateTransactionService();

      // eslint-disable-next-line no-restricted-syntax
      for (const transaction of transactions) {
        const { title, type, value, category } = transaction;

        // eslint-disable-next-line no-await-in-loop
        const newTransaction = await transactionService.execute({
          title,
          type,
          value,
          category,
        });

        returnedTransactions.push(newTransaction);
      }

      return returnedTransactions;
    } catch (err) {
      throw new AppError(`asasdasd${err}`);
    }
  }
}

export default ImportTransactionsService;
