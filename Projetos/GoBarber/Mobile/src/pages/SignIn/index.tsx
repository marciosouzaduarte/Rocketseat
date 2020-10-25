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
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.png';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/auth';
import getValidationErrors from '../../utils/getValidationErrors';
import {
  Container,
  CreateAccountButton,
  CreateAccountText,
  ForgotPasswordButton,
  ForgotPasswordText,
  Title,
} from './styles';

interface FormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const { signIn, user } = useAuth();

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

        // history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          // eslint-disable-next-line no-unused-expressions
          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert(
          'Erro na Autenticação',
          'Ocorreu um erro ao tentar realizar o login. Verifique Email e Senha informados!',
        );
      }
    },
    [signIn],
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
            <Title>Faça seu logon</Title>
          </View>

          <Form style={{ width: '100%' }} ref={formRef} onSubmit={handleSubmit}>
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

          <ForgotPasswordButton onPress={() => {}}>
            <ForgotPasswordText>Esqueci minha Senha</ForgotPasswordText>
          </ForgotPasswordButton>
        </Container>

        <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
          <Icon name="log-in" size={20} color="#ff9000" />
          <CreateAccountText>Criar uma Conta</CreateAccountText>
        </CreateAccountButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
