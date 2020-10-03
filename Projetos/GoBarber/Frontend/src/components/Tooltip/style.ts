import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  span {
    width: 15rem;
    background: var(--var-primary-color);
    color: #312e38;
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.4s;
    visibility: hidden;

    position: absolute;
    bottom: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);

    &::before {
      content: '';
      position: absolute;
      border-style: solid;
      border-color: var(--var-primary-color) transparent;
      border-width: 10px 10px 0 10px;
      top: 100%;
      left: 52%;
      transform: translateX(-50%);
    }
  }

  &:hover span {
    opacity: 1;
    visibility: visible;
  }
`;
