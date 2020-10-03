import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const service = container.resolve(AuthenticateUserService);

    const { user, token } = await service.execute({
      email,
      password,
    });

    const tempUser = Object.assign(user);

    delete tempUser.password;

    return response.send({ user: tempUser, token });
  }
}
