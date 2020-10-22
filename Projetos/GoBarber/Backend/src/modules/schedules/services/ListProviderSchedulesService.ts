import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import SchedulesModel from '@models/SchedulesModel';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

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
    @inject('SchedulesRepository')
    private schedulesRepository: ISchedulesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<SchedulesModel[]> {
    const cacheKey = `provider-schedules:${provider_id}:${provider_id}:${year}-${month}-${day}`;

    let schedules = await this.cacheProvider.recover<SchedulesModel[]>(
      cacheKey,
    );

    if (!schedules) {
      schedules = await this.schedulesRepository.findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
      });

      await this.cacheProvider.save(cacheKey, classToClass(schedules));
    }

    return schedules;
  }
}
