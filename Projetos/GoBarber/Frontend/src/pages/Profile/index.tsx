import React, { ChangeEvent, useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/auth';

interface FormularioData {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const { user, updateUser } = useAuth();

  const formRef = useRef<FormHandles>(null);

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const sendFile = async (data: FormData) => {
        const response = await api.patch('/users/avatar', data);
        if (response.status === 200) {
          updateUser(response.data);

          addToast({
            type: 'success',
            title: 'Avatar Atualizado',
          });
        }
      };

      if (e.target.files) {
        const data = new FormData();
        data.append('avatar', e.target.files[0]);
        sendFile(data);
      }
    },
    [addToast, updateUser],
  );

  const validationFormFromSchema = async (dataFromForm: FormularioData) => {
    const schemaValidation = Yup.object().shape({
      name: Yup.string().required('Campo Obrigatório'),
      email: Yup.string()
        .required('Email: Campo Obrigatório')
        .email('Nome: Valor Inválido'),
      old_password: Yup.string(),
      password: Yup.string().when('old_password', {
        is: val => !!val.length,
        then: Yup.string().required('Campo Obrigatório'),
        otherwise: Yup.string(),
      }),
      password_confirmation: Yup.string()
        .when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo Obrigatório'),
          otherwise: Yup.string(),
        })
        .oneOf([Yup.ref('password'), undefined], 'As senhas devem ser iguais'),
    });

    await schemaValidation.validate(dataFromForm, { abortEarly: false });
  };

  const handleSubmit = useCallback(
    async (dataFromForm: FormularioData): Promise<void> => {
      try {
        await validationFormFromSchema(dataFromForm);

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = dataFromForm;

        const formdata = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formdata);

        if (response.status === 200 || response.status === 201) {
          updateUser(response.data.user);

          addToast({
            type: 'success',
            title: 'Cadastro atualizado',
          });

          history.push('/dashboard');
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
          description: 'Ocorreu um erro ao tentar atualizar o cadastro!',
        });
      }
    },
    [addToast, history, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
          ref={formRef}>
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input name="name" placeholder="Nome" icon={FiUser} />

          <Input name="email" placeholder="Email" icon={FiMail} />

          <br />
          <br />

          <Input
            name="old_password"
            placeholder="Senha Atual"
            icon={FiLock}
            type="password"
          />

          <Input
            name="password"
            placeholder="Nova Senha"
            icon={FiLock}
            type="password"
          />

          <Input
            name="password_confirmation"
            placeholder="Confirmar Senha"
            icon={FiLock}
            type="password"
          />
          <Button type="submit">Confirmar mudança</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
