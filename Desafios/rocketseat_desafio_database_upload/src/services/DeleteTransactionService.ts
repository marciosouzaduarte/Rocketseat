import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<boolean> {
    const transactionsRepository = getRepository(Transaction);
    const deleted = await transactionsRepository.delete(id);
    return (
      deleted.affected !== null &&
      deleted.affected !== undefined &&
      deleted.affected > 0
    );
  }
}

export default DeleteTransactionService;
