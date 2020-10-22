import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './style';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  ...otherProps
}) => (
  <Container type="button" disabled={loading} {...otherProps}>
    {loading ? 'Carregando...' : children}
  </Container>
);

export default Button;
