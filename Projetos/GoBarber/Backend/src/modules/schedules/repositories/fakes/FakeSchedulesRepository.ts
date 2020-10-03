import { v4 } from 'uuid';
import { isEqual } from 'date-fns';

import SchedulesModel from '@models/SchedulesModel';
import ISchedulesRepository from '@modules/schedules/repositories/interfaces/ISchedulesRepository';
import ICreateScheduleDTO from '@modules/schedules/dtos/ICreateScheduleDTO';

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

  public async insert({
    provider_id,
    date,
  }: ICreateScheduleDTO): Promise<SchedulesModel> {
    const schedule = new SchedulesModel();

    Object.assign(schedule, { id: v4(), provider_id, date });

    this.schedules.push(schedule);

    return schedule;
  }
}
