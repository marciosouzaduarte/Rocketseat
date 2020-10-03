import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { Container, ButtonText } from './styles';

interface ButtonProps extends RectButtonProperties {
  children: string;
}

const Button: React.FC<ButtonProps> = ({ children, ...anotherProps }) => (
  <Container {...anotherProps}>
    <ButtonText>{children}</ButtonText>
  </Container>
);

export default Button;
