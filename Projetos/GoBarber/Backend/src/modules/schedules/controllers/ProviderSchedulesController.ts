import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderSchedulesService from '@modules/schedules/services/ListProviderSchedulesService';

export default class ProviderSchedulesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.body;

    const service = container.resolve(ListProviderSchedulesService);

    const results = await service.execute({ provider_id, day, month, year });

    return response.status(201).send(results);
  }
}
