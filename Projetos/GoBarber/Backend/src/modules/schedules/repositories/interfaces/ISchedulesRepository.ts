import SchedulesModel from '@models/SchedulesModel';
import ICreateScheduleDTO from '@modules/schedules/dtos/ICreateScheduleDTO';
import IFindAllInMonthFromProviderDTO from '@modules/schedules/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/schedules/dtos/IFindAllInDayFromProviderDTO';

// CRUDS
export default interface ISchedulesRepository {
  insert(data: ICreateScheduleDTO): Promise<SchedulesModel>;

  // shows / list
  findAll(): Promise<SchedulesModel[]>;
  findByDate(date: Date): Promise<SchedulesModel | undefined>;

  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<SchedulesModel[]>;

  findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<SchedulesModel[]>;
}
