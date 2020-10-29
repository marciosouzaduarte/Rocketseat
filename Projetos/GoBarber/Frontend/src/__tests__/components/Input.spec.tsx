import React from 'react';
import { render } from '@testing-library/react';
import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'teste',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Input Component', () => {
  it('Deve ser capaz de renderizar', () => {
    const { getByPlaceholderText } = render(
      <Input name="teste" placeholder="teste" />,
    );

    expect(getByPlaceholderText('teste')).toBeTruthy();
  });
});
