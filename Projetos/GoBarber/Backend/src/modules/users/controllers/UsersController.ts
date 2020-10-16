import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UsersRepository from '@modules/users/repositories/typeorm/UsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const service = container.resolve(CreateUserService);

    const user = await service.execute({
      name,
      email,
      password,
    });

    return response.status(201).send({ user: classToClass(user) });
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const usersRepository = new UsersRepository();

    const users = await usersRepository.findAll();

    return response.send({ users: classToClass(users) });
  }
}
