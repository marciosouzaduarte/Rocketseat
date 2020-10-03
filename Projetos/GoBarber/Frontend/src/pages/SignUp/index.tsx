import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background } from './styles';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();

  const formRef = useRef<FormHandles>(null);

  const validationFormFromSchema = async (dataFromForm: FormData) => {
    const schemaValidation = Yup.object().shape({
      name: Yup.string().required('Nome: Campo Obrigatório'),
      email: Yup.string()
        .required('Email: Campo Obrigatório')
        .email('Nome: Valor Inválido'),
      password: Yup.string().min(10, 'Password: Deve ter 10 caracteres'),
    });

    await schemaValidation.validate(dataFromForm, { abortEarly: false });
  };

  const handleSubmit = useCallback(
    async (dataFromForm: FormData): Promise<void> => {
      try {
        await validationFormFromSchema(dataFromForm);

        const response = await api.post('/users', dataFromForm);

        if (response.status === 200 || response.status === 201) {
          addToast({
            type: 'success',
            title: 'Cadastro realizado',
          });

          history.push('/');
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          // eslint-disable-next-line no-unused-expressions
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao tentar realizar o cadastro!',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />
      <Content>
        <img src={logoImg} alt="GoBarber Logo" />

        <Form initialData={{}} onSubmit={handleSubmit} ref={formRef}>
          <h1>Faça seu cadastro</h1>

          <Input name="name" placeholder="Nome" icon={FiUser} />

          <Input name="email" placeholder="Email" icon={FiMail} />

          <Input
            name="password"
            placeholder="Senha"
            icon={FiLock}
            type="password"
          />

          <Button type="submit">Cadastrar</Button>
        </Form>

        <Link to="/">
          <FiArrowLeft />
          Voltar para Logon
        </Link>
      </Content>
    </Container>
  );
};

export default SignUp;
