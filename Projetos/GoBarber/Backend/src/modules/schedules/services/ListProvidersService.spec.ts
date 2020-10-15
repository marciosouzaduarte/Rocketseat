import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('deve ser capaz de listar os provedores', async () => {
    const user1 = await fakeUsersRepository.insert({
      name: 'Teste1',
      email: 'teste1@teste.com.br',
      password: '123123123',
    });

    const user2 = await fakeUsersRepository.insert({
      name: 'Teste2',
      email: 'teste2@teste.com.br',
      password: '123123123',
    });

    const loggedUser = await fakeUsersRepository.insert({
      name: 'Teste3',
      email: 'teste3@teste.com.br',
      password: '123123123',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
