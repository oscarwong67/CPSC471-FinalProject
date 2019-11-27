import React from 'react';
import './App.css';
import { Header } from 'semantic-ui-react';
import { Router, Route, Switch } from 'react-router';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import PrivateRoute from './Components/PrivateRoute';
import history from './history';

function App() {

  return (
    <div className="App">
      <Header as='h1' color='pink' className="App-header">
        Welcome to Ryde
      </Header>
      <Router history={history}>
        <Route>
          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute exact path='/' component={Dashboard} />
          </Switch>
        </Route>
      </Router>
    </div>
  );
}




export default App;
