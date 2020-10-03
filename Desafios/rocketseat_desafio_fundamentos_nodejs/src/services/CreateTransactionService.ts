import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface CreateTransactionServiceInterface {
  title: string;
  value: number;
  type: string;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({
    title,
    value,
    type,
  }: CreateTransactionServiceInterface): Transaction {
    if (type !== 'income' && type !== 'outcome') {
      throw Error("This type doesn't exist");
    }

    if (type === 'outcome') {
      const account = this.transactionsRepository.getBalance();
      if (account.total - value < 0) {
        throw Error('Not enough in the current account');
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
