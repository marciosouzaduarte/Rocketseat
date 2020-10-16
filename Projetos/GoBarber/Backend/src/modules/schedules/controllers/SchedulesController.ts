import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SchedulesRepository from '@modules/schedules/repositories/typeorm/SchedulesRepository';
import CreateScheduleService from '@modules/schedules/services/CreateScheduleService';

export default class SchedulesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date } = request.body;

    const service = container.resolve(CreateScheduleService);

    const schedule = await service.execute({
      provider_id,
      user_id,
      date,
    });

    return response.status(201).send(schedule);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const schedulesRepository = new SchedulesRepository();

    const schedules = await schedulesRepository.findAll();

    return response.send(schedules);
  }
}
