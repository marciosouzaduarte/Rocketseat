import styled, { css } from 'styled-components';
import { animated } from 'react-spring';

interface ToastProps {
  type?: 'success' | 'error' | 'default';
  hasdescription: number;
}

const toastVariations = {
  default: css`
    background: #ebf8ff;
    color: #3172b7;
  `,
  success: css`
    background: #c4ffd8;
    color: #2e656a;
  `,
  error: css`
    background: #ffdded;
    color: #f53030;
  `,
};

export const Container = styled(animated.div)<ToastProps>`
  display: flex;
  width: 360px;
  position: relative;
  padding: 16px 32px 16px 16px;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);

  ${props => toastVariations[props.type || 'default']}

  & + div {
    margin-top: 4px;
  }

  > svg {
    margin: 2px 12px 0 0;
  }

  div {
    flex: 1;

    p {
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.8;
      line-height: 20px;
    }
  }

  button {
    position: absolute;
    right: 4px;
    top: 4px;
    opacity: 0.6;
    border: 0;
    background: transparent;
    color: inherit;
  }

  ${props =>
    !props.hasdescription &&
    css`
      align-items: center;

      > svg {
        margin-top: 0;
      }
    `}
`;
