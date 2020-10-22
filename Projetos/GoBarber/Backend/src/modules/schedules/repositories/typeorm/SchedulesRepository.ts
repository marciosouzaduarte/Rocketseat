import { getRepository, Raw, Repository } from 'typeorm';

import SchedulesModel from '@models/SchedulesModel';
import ISchedulesRepository from '@modules/schedules/repositories/interfaces/ISchedulesRepository';
import ICreateScheduleDTO from '@modules/schedules/dtos/ICreateScheduleDTO';
import IFindAllInMonthFromProviderDTO from '@modules/schedules/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/schedules/dtos/IFindAllInDayFromProviderDTO';

export default class SchedulesRepository implements ISchedulesRepository {
  private ormRepository: Repository<SchedulesModel>;

  constructor() {
    this.ormRepository = getRepository(SchedulesModel);
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<SchedulesModel | undefined> {
    const findSchedule = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findSchedule;
  }

  public async findAll(): Promise<SchedulesModel[]> {
    const findSchedules = await this.ormRepository.find();
    return findSchedules;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<SchedulesModel[]> {
    const parsedMonth = month.toString().padStart(2, '0');

    const findSchedules = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    return findSchedules;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<SchedulesModel[]> {
    const parsedDay = day.toString().padStart(2, '0');
    const parsedMonth = month.toString().padStart(2, '0');

    const findSchedules = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    });

    return findSchedules;
  }

  public async insert({
    provider_id,
    user_id,
    date,
  }: ICreateScheduleDTO): Promise<SchedulesModel> {
    const dataToSave = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    await this.ormRepository.save(dataToSave);

    return dataToSave;
  }
}
