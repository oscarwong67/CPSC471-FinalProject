import React from 'react';
import { Route, Redirect } from 'react-router';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      localStorage.getItem('authenticated') != null
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
)

export default PrivateRoute;
