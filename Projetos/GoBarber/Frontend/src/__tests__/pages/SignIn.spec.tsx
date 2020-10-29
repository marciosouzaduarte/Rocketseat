import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignInPage', () => {
  beforeEach(() => {
    mockedPush.mockClear();
    mockedSignIn.mockClear();
    mockedAddToast.mockClear();
  });

  it('Deve ser possível logar', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const campoEmail = getByPlaceholderText('Email');
    const campoSenha = getByPlaceholderText('Senha');
    const botaoEntrar = getByText('Entrar');

    fireEvent.change(campoEmail, { target: { value: 'teste@teste.com.br' } });
    fireEvent.change(campoSenha, { target: { value: '1234567890' } });

    fireEvent.click(botaoEntrar);

    await waitFor(() => {
      expect(mockedPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('NÃO deve ser possível logar com email inválido', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const campoEmail = getByPlaceholderText('Email');
    const campoSenha = getByPlaceholderText('Senha');
    const botaoEntrar = getByText('Entrar');

    fireEvent.change(campoEmail, { target: { value: 'email-invalido' } });
    fireEvent.change(campoSenha, { target: { value: '1234567890' } });

    fireEvent.click(botaoEntrar);

    await waitFor(() => {
      expect(mockedPush).not.toHaveBeenCalled();
    });
  });

  it('Deve disparar um erro se o login falhar', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const campoEmail = getByPlaceholderText('Email');
    const campoSenha = getByPlaceholderText('Senha');
    const botaoEntrar = getByText('Entrar');

    fireEvent.change(campoEmail, { target: { value: 'teste@teste.com.br' } });
    fireEvent.change(campoSenha, { target: { value: '1234567890' } });

    fireEvent.click(botaoEntrar);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
  });
});
