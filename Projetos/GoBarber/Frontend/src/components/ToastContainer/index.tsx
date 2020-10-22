import React from 'react';
import { useTransition } from 'react-spring';

import { Container } from './style';

import { ToastMessage } from '../../interfaces/Toast';

import Toast from './Toast';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const messageWithTransition = useTransition(messages, message => message.id, {
    from: { right: '-120%', opacity: 0 },
    enter: { right: '-30%', opacity: 1 },
    leave: { right: '-120%', opacity: 0 },
  });

  return (
    <Container>
      {messageWithTransition.map(({ key, item, props }) => (
        <Toast key={key} message={item} style={props} />
      ))}
    </Container>
  );
};

export default ToastContainer;
