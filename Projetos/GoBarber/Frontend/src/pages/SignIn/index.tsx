import React, { useRef, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo/logo.svg';

import { Container, Content, Background } from './styles';

interface FormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const history = useHistory();
  const { signIn } = useAuth();
  const { addToast } = useToast();

  const formRef = useRef<FormHandles>(null);

  const validationFormFromSchema = async (dataFromForm: FormData) => {
    const schemaValidation = Yup.object().shape({
      email: Yup.string()
        .required('Email: Campo Obrigatório')
        .email('Email: Valor Inválido'),
      password: Yup.string().required('Senha: Campo Obrigatório'),
    });

    await schemaValidation.validate(dataFromForm, { abortEarly: false });
  };

  const handleSubmit = useCallback(
    async (dataFromForm: FormData): Promise<void> => {
      try {
        await validationFormFromSchema(dataFromForm);

        const { email, password } = dataFromForm;
        await signIn({ email, password });

        history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          // eslint-disable-next-line no-unused-expressions
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na Autenticação',
          description:
            'Ocorreu um erro ao tentar realizar o login. Verifique Email e Senha informados!',
        });
      }
    },
    [signIn, addToast, history],
  );

  return (
    <Container>
      <Content>
        <img src={logoImg} alt="GoBarber Logo" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu logon</h1>

          <Input name="email" placeholder="Email" icon={FiMail} />

          <Input
            name="password"
            placeholder="Senha"
            icon={FiLock}
            type="password"
          />

          <Button type="submit">Entrar</Button>

          <a href="forgot">Esqueci minha senha</a>
        </Form>

        <Link to="/signup">
          <FiLogIn />
          Criar conta
        </Link>
      </Content>

      <Background />
    </Container>
  );
};

export default SignIn;
