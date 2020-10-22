import React, { useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

// import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo/logo.svg';

import { Container, Content, Background } from './styles';
import api from '../../services/api';

interface FormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  // const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const formRef = useRef<FormHandles>(null);

  const validationFormFromSchema = async (dataFromForm: FormData) => {
    const schemaValidation = Yup.object().shape({
      email: Yup.string()
        .required('Email: Campo Obrigatório')
        .email('Email: Valor Inválido'),
    });

    await schemaValidation.validate(dataFromForm, { abortEarly: false });
  };

  const handleSubmit = useCallback(
    async (dataFromForm: FormData): Promise<void> => {
      try {
        setLoading(true);
        await validationFormFromSchema(dataFromForm);

        const { email } = dataFromForm;

        const retorno = await api.post('/password/forgot', { email });
        if (retorno.status === 204) {
          addToast({
            type: 'success',
            title: 'Email encaminhado',
            description: 'Email enviado para confirmar a recuperação de senha!',
          });
        }

        // history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          // eslint-disable-next-line no-unused-expressions
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na Recuperação de Senha',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha. Tente novamente!',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <img src={logoImg} alt="GoBarber Logo" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Recuperar Senha</h1>

          <Input name="email" placeholder="Email" icon={FiMail} />

          <Button loading={loading} type="submit">
            Recuperar
          </Button>
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

export default ForgotPassword;
