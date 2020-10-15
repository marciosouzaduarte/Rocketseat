import { v4 } from 'uuid';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import SchedulesModel from '@models/SchedulesModel';
import ISchedulesRepository from '@modules/schedules/repositories/interfaces/ISchedulesRepository';
import ICreateScheduleDTO from '@modules/schedules/dtos/ICreateScheduleDTO';
import IFindAllInMonthFromProviderDTO from '@modules/schedules/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/schedules/dtos/IFindAllInDayFromProviderDTO';

export default class FakeSchedulesRepository implements ISchedulesRepository {
  private schedules: SchedulesModel[] = [];

  public async findByDate(date: Date): Promise<SchedulesModel | undefined> {
    const findSchedule = this.schedules.find(schedule =>
      isEqual(schedule.date, date),
    );

    return findSchedule;
  }

  public async findAll(): Promise<SchedulesModel[]> {
    return this.schedules;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<SchedulesModel[]> {
    const findSchedules = this.schedules.filter(
      schedule =>
        schedule.provider_id === provider_id &&
        getMonth(schedule.date) + 1 === month &&
        getYear(schedule.date) === year,
    );

    return findSchedules;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<SchedulesModel[]> {
    const findSchedules = this.schedules.filter(
      schedule =>
        schedule.provider_id === provider_id &&
        getDate(schedule.date) === day &&
        getMonth(schedule.date) + 1 === month &&
        getYear(schedule.date) === year,
    );

    return findSchedules;
  }

  public async insert({
    provider_id,
    user_id,
    date,
  }: ICreateScheduleDTO): Promise<SchedulesModel> {
    const schedule = new SchedulesModel();

    Object.assign(schedule, { id: v4(), provider_id, user_id, date });

    this.schedules.push(schedule);

    return schedule;
  }
}
