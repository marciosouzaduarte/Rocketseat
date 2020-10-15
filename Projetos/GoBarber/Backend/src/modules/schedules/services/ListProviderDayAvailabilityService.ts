import { inject, injectable } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import ISchedulesRepository from '../repositories/interfaces/ISchedulesRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService {
  constructor(
    @inject('ISchedulesRepository')
    private schedulesRepository: ISchedulesRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const schedules = await this.schedulesRepository.findAllInDayFromProvider({
      provider_id,
      day,
      month,
      year,
    });

    const hourStart = 8;

    const forEachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const availability = forEachHourArray.map(hour => {
      const hasSchedulesInHour = schedules.find(
        schedule => getHours(schedule.date) === hour,
      );

      const currentDate = new Date(Date.now());
      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasSchedulesInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}
