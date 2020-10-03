import React, { createContext, useContext, useCallback, useState } from 'react';
import { v4 } from 'uuid';

import { ToastMessage } from '../interfaces/Toast';

import ToastContainer from '../components/ToastContainer';

interface ToastContextData {
  addToast(messages: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
      const id = v4();

      const newToast = {
        id,
        type,
        title,
        description,
      };

      setMessages([...messages, newToast]);
    },
    [messages],
  );

  const removeToast = useCallback((id: string) => {
    setMessages(state => state.filter(message => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

const useToast = (): ToastContextData => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast deve ser usado com um ToastProvider');
  }

  return context;
};

export { ToastProvider, useToast };
