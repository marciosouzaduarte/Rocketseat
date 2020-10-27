import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import React, { useCallback, useRef } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import Breakline from '../../components/Breakline';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import {
  BackButton,
  Container,
  Title,
  UserAvatar,
  UserAvatarButton,
} from './styles';

interface FormularioData {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { goBack } = useNavigation();
  const { user, updateUser } = useAuth();

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

          Alert.alert('Sucesso', 'Cadastro atualizado');
          goBack();
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          // eslint-disable-next-line no-unused-expressions
          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert(
          'Erro na Autenticação',
          'Ocorreu um erro ao tentar atualizar o cadastro!',
        );
      }
    },
    [goBack, updateUser],
  );

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar câmera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert(`Erro ao tentar atualizar o avatar${response.error}`);
          return;
        }

        const data = new FormData();

        data.append('avatar', {
          uri: response.uri,
          type: 'image/jpeg',
          name: `${user.name}.jpg`,
        });

        const atualizarAvatar = async (imageData: FormData) => {
          const resposta = await api.patch('/users/avatar', imageData);
          console.log('resposta :>> ', resposta);
          if (resposta.status === 200) {
            updateUser(resposta.data);

            Alert.alert('Avatar atualizado');
          }
        };

        atualizarAvatar(data);
      },
    );
  }, [updateUser, user]);

  const handleGoBack = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <KeyboardAvoidingView
      style={{ flexGrow: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Container>
          <BackButton onPress={handleGoBack}>
            <Icon name="chevron-left" size={28} color="#999591" />
          </BackButton>

          <UserAvatarButton onPress={handleUpdateAvatar}>
            <UserAvatar source={{ uri: user.avatar_url }} />
          </UserAvatarButton>

          <View>
            <Title>Meu perfil</Title>
          </View>

          <Form
            style={{ width: '100%' }}
            ref={formRef}
            onSubmit={handleSubmit}
            initialData={{ name: user.name, email: user.email }}
          >
            <Input
              name="name"
              icon="user"
              placeholder="Nome"
              autoCapitalize="words"
              returnKeyType="next"
            />

            <Input
              name="email"
              icon="mail"
              placeholder="E-mail"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />

            <Breakline />

            <Input
              name="old_password"
              icon="lock"
              placeholder="Senha atual"
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="next"
            />

            <Input
              name="password"
              icon="lock"
              placeholder="Nova senha"
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="next"
            />

            <Input
              name="password_confirmation"
              icon="lock"
              placeholder="Confirmar senha"
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="send"
              onSubmitEditing={() => formRef.current?.submitForm()}
            />

            <Button onPress={() => formRef.current?.submitForm()}>
              Confirmar mudanças
            </Button>
          </Form>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Profile;
