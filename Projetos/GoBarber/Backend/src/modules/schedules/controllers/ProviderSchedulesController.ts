import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProviderSchedulesService from '@modules/schedules/services/ListProviderSchedulesService';

export default class ProviderSchedulesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.query;

    const service = container.resolve(ListProviderSchedulesService);

    const results = await service.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.status(201).send(classToClass(results));
  }
}
