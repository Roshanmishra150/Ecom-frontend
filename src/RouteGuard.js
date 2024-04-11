// RouteGuard.js

import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const allowedRoutes = ['/home', '/about', '/contact']; // List of allowed routes

const RouteGuard = ({ children }) => {
  const history = useHistory();

  // useEffect(() => {
  //   const currentRoute = history.location.pathname;

  //   if (!allowedRoutes.includes(currentRoute)) {
  //     // Redirect to the home page if the user tries to access a non-allowed route
  //     history.push('/home');
  //   }
  // }, [history]);

  return <>{children}</>;
};

export default RouteGuard;
