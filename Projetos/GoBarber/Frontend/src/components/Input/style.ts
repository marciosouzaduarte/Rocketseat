import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  hasError: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #232129;
  border-radius: 10px;
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  border: 2px solid #232129;
  color: #666360;

  & + div {
    margin-top: 8px;
  }

  ${props =>
    props.hasError &&
    css`
      border-color: var(--var-primary-color-error);
    `}

  ${props =>
    props.isFocused &&
    css`
      color: #ff9000;
      border-color: #ff9000;
    `}

  ${props =>
    props.isFilled &&
    css`
      color: #ff9000;
    `}

  input {
    flex: 1;
    border: 0;
    background: transparent;
    color: #f4ede8;
    transition: background-color 0.2s;

    &::placeholder {
      color: #666360;
    }
  }

  svg {
    margin-right: 8px;
  }
`;

export const ErrorIcon = styled(Tooltip)`
  height: 20px;
  margin-left: 8px;

  svg {
    margin-right: -8px;
  }

  span {
    background: var(--var-primary-color-error);
    color: #fff;

    &::before {
      border-color: var(--var-primary-color-error) transparent;
    }
  }
`;
