import { inject, injectable } from 'tsyringe';
import { getDate, getDaysInMonth, isAfter } from 'date-fns';

import ISchedulesRepository from '../repositories/interfaces/ISchedulesRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject('ISchedulesRepository')
    private schedulesRepository: ISchedulesRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const schedules = await this.schedulesRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const forEachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availability = forEachDayArray.map(day => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      const schedulesInDay = schedules.filter(
        schedule => getDate(schedule.date) === day,
      );

      return {
        day,
        available:
          isAfter(compareDate, new Date()) && schedulesInDay.length < 10,
      };
    });

    return availability;
  }
}
