import { inject, injectable } from 'tsyringe';

import SchedulesModel from '@models/SchedulesModel';

import ISchedulesRepository from '../repositories/interfaces/ISchedulesRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
export default class ListProviderSchedulesService {
  constructor(
    @inject('ISchedulesRepository')
    private schedulesRepository: ISchedulesRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<SchedulesModel[]> {
    const schedules = await this.schedulesRepository.findAllInDayFromProvider({
      provider_id,
      day,
      month,
      year,
    });

    return schedules;
  }
}
