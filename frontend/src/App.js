import React from 'react';
import './App.css';
import { Header } from 'semantic-ui-react';
import { Router, Route, Switch } from 'react-router';
import PrivateRoute from './Components/PrivateRoute';
import Login from './Components/Login';
import DashboardPicker from './Components/DashboardPicker';
import BookCarTrip from './Components/Customer/BookCarTrip';
import ManageCustomerTrip from './Components/Customer/ManageCustomerTrip';
import RentEV from './Components/Customer/RentEV';
import SignoutButton from './Components/SignoutButton';
import ManagePaymentAccount from './Components/ManagePaymentAccount';
import history from './history';
import DriverCurrentTrip from './Components/Employee/Driver/DriverCurrentTrip';
import DriverTripEnded from './Components/Employee/Driver/DriverTripEnded';

function App() {

  return (
    <div className="App">
      <h1>   </h1>
      <Header as='h1' color='pink' className="App-header">
        WELCOME TO RYDE!
      </Header>
      <h3>   </h3>
      <Router history={history}>
        <Route>
          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute exact path="/" component={DashboardPicker} />
          </Switch>
        </Route>
        <PrivateRoute path="/bookCarTrip" component={BookCarTrip} />
        <PrivateRoute path="/manageCustomerTrip" component={ManageCustomerTrip} />
        <PrivateRoute path="/rentVehicle" component={RentEV} />
        <PrivateRoute path="/currentDriverTrip" component={DriverCurrentTrip} />
        <PrivateRoute path="/endDriverTrip" component={DriverTripEnded} />
        <PrivateRoute path="/managePaymentAccount" component={ManagePaymentAccount} />
        <PrivateRoute path="/" component={SignoutButton} />
      </Router>
    </div>
  );
}




export default App;
