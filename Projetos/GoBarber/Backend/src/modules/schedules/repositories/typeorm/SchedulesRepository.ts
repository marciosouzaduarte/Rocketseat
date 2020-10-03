import { getRepository, Repository } from 'typeorm';

import SchedulesModel from '@models/SchedulesModel';
import ISchedulesRepository from '@modules/schedules/repositories/interfaces/ISchedulesRepository';
import ICreateScheduleDTO from '@modules/schedules/dtos/ICreateScheduleDTO';

export default class SchedulesRepository implements ISchedulesRepository {
  private ormRepository: Repository<SchedulesModel>;

  constructor() {
    this.ormRepository = getRepository(SchedulesModel);
  }

  public async findByDate(date: Date): Promise<SchedulesModel | undefined> {
    const findSchedule = await this.ormRepository.findOne({
      where: { date },
    });

    return findSchedule;
  }

  public async findAll(): Promise<SchedulesModel[]> {
    const findSchedules = await this.ormRepository.find();
    return findSchedules;
  }

  public async insert({
    provider_id,
    date,
  }: ICreateScheduleDTO): Promise<SchedulesModel> {
    const dataToSave = this.ormRepository.create({
      provider_id,
      date,
    });

    await this.ormRepository.save(dataToSave);

    return dataToSave;
  }
}
