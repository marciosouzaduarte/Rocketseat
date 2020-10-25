import React, { useRef, useCallback } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FiLogIn, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo/logo.svg';

import { Container, Content, Background } from './styles';
import api from '../../services/api';

interface FormData {
  password: string;
  passwordConfirmation: string;
}

const ResetPassword: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { addToast } = useToast();

  const formRef = useRef<FormHandles>(null);

  const validationFormFromSchema = async (dataFromForm: FormData) => {
    const schemaValidation = Yup.object().shape({
      password: Yup.string().required('Senha: Campo Obrigatório'),
      passwordConfirmation: Yup.string().oneOf(
        [Yup.ref('password'), undefined],
        'As senhas devem ser iguais',
      ),
    });

    await schemaValidation.validate(dataFromForm, { abortEarly: false });
  };

  const handleSubmit = useCallback(
    async (dataFromForm: FormData): Promise<void> => {
      try {
        await validationFormFromSchema(dataFromForm);

        const { password, passwordConfirmation } = dataFromForm;
        const token = location.search.replace('?token=', '');

        if (!token) {
          addToast({
            type: 'error',
            title: 'Erro no Reset',
            description: 'Token não definido!',
          });

          return;
        }

        const retorno = await api.post('/password/reset', {
          password,
          password_confirmation: passwordConfirmation,
          token,
        });

        if (retorno.status === 204) {
          addToast({
            type: 'success',
            title: 'Senha alterada',
            description: 'Senha alterada com sucesso!',
          });
        }

        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          // eslint-disable-next-line no-unused-expressions
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no Reset',
          description:
            'Ocorreu um erro ao tentar resetar sua senha. Tente novamente!',
        });
      }
    },
    [addToast, history, location],
  );

  return (
    <Container>
      <Content>
        <img src={logoImg} alt="GoBarber Logo" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Resetar senha</h1>

          <Input
            name="password"
            placeholder="Nova Senha"
            icon={FiLock}
            type="password"
          />

          <Input
            name="passwordConfirmation"
            placeholder="Confirmação da Senha"
            icon={FiLock}
            type="password"
          />

          <Button type="submit">Alterar senha</Button>
        </Form>

        <Link to="/">
          <FiLogIn />
          Voltar ao login
        </Link>
      </Content>

      <Background />
    </Container>
  );
};

export default ResetPassword;
