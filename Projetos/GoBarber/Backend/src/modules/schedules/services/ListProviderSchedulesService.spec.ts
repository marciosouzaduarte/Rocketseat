import FakeSchedulesRepository from '@modules/schedules/repositories/fakes/FakeSchedulesRepository';
import ListProviderSchedulesService from './ListProviderSchedulesService';

let fakeSchedulesRepository: FakeSchedulesRepository;
let listProviderSchedulesService: ListProviderSchedulesService;

describe('ListProviderSchedulesService', () => {
  beforeEach(() => {
    fakeSchedulesRepository = new FakeSchedulesRepository();
    listProviderSchedulesService = new ListProviderSchedulesService(
      fakeSchedulesRepository,
    );
  });

  it('deve ser possível listar os agendamentos de um dia específico', async () => {
    const schedules1 = await fakeSchedulesRepository.insert({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 1, 1, 10),
    });

    const schedules2 = await fakeSchedulesRepository.insert({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 1, 1, 11),
    });

    const schedules3 = await fakeSchedulesRepository.insert({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 1, 1, 15),
    });

    const schedules = await listProviderSchedulesService.execute({
      provider_id: 'provider-id',
      day: 1,
      month: 1,
      year: 2020,
    });

    expect(schedules).toEqual([schedules1, schedules2, schedules3]);
  });
});
