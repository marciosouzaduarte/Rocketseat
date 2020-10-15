import FakeSchedulesRepository from '../repositories/fakes/FakeSchedulesRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeSchedulesRepository: FakeSchedulesRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailabilityService', () => {
  beforeEach(() => {
    fakeSchedulesRepository = new FakeSchedulesRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeSchedulesRepository,
    );
  });

  it('deve ser capaz de listar as horas do dia disponível para o provedor', async () => {
    await fakeSchedulesRepository.insert({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 1, 8, 0, 0),
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

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 1, 11).getTime();
    });

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: 'provider-id',
      day: 1,
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 11, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ]),
    );
  });
});
