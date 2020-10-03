import SchedulesModel from '@models/SchedulesModel';
import ICreateScheduleDTO from '@modules/schedules/dtos/ICreateScheduleDTO';

// CRUDS
export default interface ISchedulesRepository {
  insert(data: ICreateScheduleDTO): Promise<SchedulesModel>;

  // shows / list
  findAll(): Promise<SchedulesModel[]>;
  findByDate(date: Date): Promise<SchedulesModel | undefined>;
}
