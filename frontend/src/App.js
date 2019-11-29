import React from 'react';
import './App.css';
import { Header } from 'semantic-ui-react';
import { Router, Route, Switch } from 'react-router';
import PrivateRoute from './Components/PrivateRoute';
import Login from './Components/Login';
import DashboardPicker from './Components/DashboardPicker';
import BookCarTrip from './Components/Customer/BookCarTrip';
import SignoutButton from './Components/SignoutButton';
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
            <PrivateRoute exact path="/" component={DashboardPicker} />
          </Switch>
        </Route>
        <PrivateRoute path="/bookCarTrip" component={BookCarTrip} />
        <PrivateRoute path="/" component={SignoutButton} />
      </Router>
    </div>
  );
}




export default App;
