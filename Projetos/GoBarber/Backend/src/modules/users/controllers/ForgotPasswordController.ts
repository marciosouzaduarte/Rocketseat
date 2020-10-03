import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordService from '@modules/users/services/SendForgotPasswordService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const service = container.resolve(SendForgotPasswordService);

    await service.execute({
      email,
    });

    return response.status(204).send();
  }
}
