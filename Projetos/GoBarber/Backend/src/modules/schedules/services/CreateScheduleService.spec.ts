import AppError from '@shared/errors/AppError';

import FakeSchedulesRepository from '../repositories/fakes/FakeSchedulesRepository';

import CreateScheduleService from './CreateScheduleService';

interface INewScheduleInterface {
  date: Date;
  provider_id: string;
}

let fakeSchedulesRepository: FakeSchedulesRepository;
let createSchedule: CreateScheduleService;
let newSchedule: INewScheduleInterface;

describe('CreateScheduleService', () => {
  beforeEach(() => {
    fakeSchedulesRepository = new FakeSchedulesRepository();

    createSchedule = new CreateScheduleService(fakeSchedulesRepository);

    newSchedule = {
      date: new Date(),
      provider_id: '1234-5678-9012',
    };
  });

  it('Deve ser capaz de criar um novo agendamento', async () => {
    const schedule = await createSchedule.execute(newSchedule);

    expect(schedule).toHaveProperty('id');
    expect(schedule.provider_id).toBe(newSchedule.provider_id);
  });

  it('Não deve ser capaz de criar dois agendamentos em um mesmo horário', async () => {
    await createSchedule.execute(newSchedule);

    await expect(
      createSchedule.execute({
        date: newSchedule.date,
        provider_id: newSchedule.provider_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
