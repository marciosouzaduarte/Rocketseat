import React from 'react';
import {
  Route as ReactRouteDom,
  RouteProps as ReactRouteDomProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactRouteDomProps {
  needAuth?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  needAuth = false,
  component: Component,
  ...otherProps
}) => {
  const { user } = useAuth();

  return (
    <ReactRouteDom
      {...otherProps}
      render={() => {
        return needAuth === !!user ? (
          <Component />
        ) : (
            <Redirect to={{ pathname: needAuth ? '/' : '/dashboard' }} />
          );
      }}
    />
  );
};

export default Route;
