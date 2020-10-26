import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/schedules/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year } = request.body;

    const service = container.resolve(ListProviderMonthAvailabilityService);

    const results = await service.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    });

    return response.status(201).send(results);
  }
}
