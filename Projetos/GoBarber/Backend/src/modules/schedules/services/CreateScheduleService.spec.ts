import AppError from '@shared/errors/AppError';

import FakeSchedulesRepository from '../repositories/fakes/FakeSchedulesRepository';

import CreateScheduleService from './CreateScheduleService';

interface INewScheduleInterface {
  date: Date;
  user_id: string;
  provider_id: string;
}

let fakeSchedulesRepository: FakeSchedulesRepository;
let createSchedule: CreateScheduleService;
let newSchedule: INewScheduleInterface;

describe('CreateScheduleService', () => {
  beforeEach(() => {
    fakeSchedulesRepository = new FakeSchedulesRepository();

    createSchedule = new CreateScheduleService(fakeSchedulesRepository);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 13).getTime();
    });

    newSchedule = {
      date: new Date(),
      user_id: 'user-id',
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
        user_id: newSchedule.user_id,
        provider_id: newSchedule.provider_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve ser capaz de criar um agendamentos em data passada', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await createSchedule.execute(newSchedule);

    await expect(
      createSchedule.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: newSchedule.user_id,
        provider_id: newSchedule.provider_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve ser capaz de criar um agendamento com o mesmo usuário e provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 13).getTime();
    });

    await createSchedule.execute(newSchedule);

    await expect(
      createSchedule.execute({
        date: new Date(2020, 4, 10, 14),
        user_id: newSchedule.user_id,
        provider_id: newSchedule.user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve ser capaz de criar um agendamento antes das 8:00', async () => {
    await expect(
      createSchedule.execute({
        date: new Date(2020, 4, 11, 7),
        user_id: newSchedule.user_id,
        provider_id: newSchedule.provider_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve ser capaz de criar um agendamento depois das 18:00', async () => {
    await expect(
      createSchedule.execute({
        date: new Date(2020, 4, 11, 18),
        user_id: newSchedule.user_id,
        provider_id: newSchedule.provider_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
