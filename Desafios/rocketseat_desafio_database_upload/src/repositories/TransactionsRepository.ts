import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const findEverything = await this.find();

    const income = findEverything
      .filter(item => item.type === 'income')
      .reduce((acc, cur) => acc + cur.value, 0);

    const outcome = findEverything
      .filter(item => item.type === 'outcome')
      .reduce((acc, cur) => acc + cur.value, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
