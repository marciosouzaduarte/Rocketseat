import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/schedules/services/ListProvidersService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const service = container.resolve(ListProvidersService);

    const results = await service.execute({ user_id });

    return response.status(201).send(results);
  }
}
