import FakeSchedulesRepository from '../repositories/fakes/FakeSchedulesRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeSchedulesRepository: FakeSchedulesRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailabilityService', () => {
  beforeEach(() => {
    fakeSchedulesRepository = new FakeSchedulesRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeSchedulesRepository,
    );
  });

  it('deve ser capaz de listar os dia do mês disponível para o provedor', async () => {
    await fakeSchedulesRepository.insert({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 1, 8, 0, 0),
    });
    await fakeSchedulesRepository.insert({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 1, 9, 0, 0),
    });
    await fakeSchedulesRepository.insert({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 1, 10, 0, 0),
    });
    await fakeSchedulesRepository.insert({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 1, 11, 0, 0),
    });
    await fakeSchedulesRepository.insert({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 1, 12, 0, 0),
    });
    await fakeSchedulesRepository.insert({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 1, 13, 0, 0),
    });
    await fakeSchedulesRepository.insert({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 1, 14, 0, 0),
    });
    await fakeSchedulesRepository.insert({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 1, 15, 0, 0),
    });
    await fakeSchedulesRepository.insert({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 1, 16, 0, 0),
    });
    await fakeSchedulesRepository.insert({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 1, 17, 0, 0),
    });

    await fakeSchedulesRepository.insert({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 2, 10, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'provider-id',
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 1, available: false },
        { day: 2, available: true },
      ]),
    );
  });
});
