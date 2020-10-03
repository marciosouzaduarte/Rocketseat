import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import React, { useCallback, useRef } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.png';
import Button from '../../components/Button';
import Input from '../../components/Input';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import {
  BackToSignInButton,
  BackToSignInText,
  Container,
  Title
} from './styles';

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

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
          Alert.alert('Sucesso', 'Cadastro realizado');
          navigation.navigate('SignIn');
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
          'Ocorreu um erro ao tentar realizar o cadastro!',
        );
      }
    },
    [navigation],
  );

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
          <Image source={logoImg} />

          <View>
            <Title>Crie sua conta</Title>
          </View>

          <Form style={{ width: '100%' }} ref={formRef} onSubmit={handleSubmit}>
            <Input
              name="name"
              icon="user"
              placeholder="Nome"
              autoCapitalize="words"
            />

            <Input
              name="email"
              icon="mail"
              placeholder="E-mail"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Input
              name="password"
              icon="lock"
              placeholder="Senha"
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="send"
              onSubmitEditing={() => {
                formRef.current?.submitForm();
              }}
            />

            <Button
              onPress={() => {
                formRef.current?.submitForm();
              }}
            >
              Entrar
            </Button>
          </Form>
        </Container>

        <BackToSignInButton onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#ffffff" />
          <BackToSignInText>Voltar para Logon</BackToSignInText>
        </BackToSignInButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
