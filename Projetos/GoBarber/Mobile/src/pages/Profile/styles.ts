import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { FontFamily } from '../../styles/GlobalStyle';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 50 : 50}px;
`;

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
`;

export const Title = styled.Text`
  font-size: 18px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0 24px;
`;

export const ForgotPasswordButton = styled.TouchableOpacity`
  margin-top: 24px;
`;

export const ForgotPasswordText = styled.Text`
  font-size: 16px;
  color: #f4ede8;
  font-family: '${FontFamily}-Regular';
`;

export const UserAvatarButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  margin-top: 64px;
  align-self: center;
  border: 1px;
  border-color: #000000;
`;
