import { v4 } from 'uuid';

class Transaction {
  id: string;

  title: string;

  value: number;

  type: 'income' | 'outcome';

  constructor({ title, value, type }: Omit<Transaction, 'id'>) {
    this.id = v4();
    this.title = title;
    this.value = value;
    this.type = type;
  }
}

export default Transaction;
