import React from 'react';
import { Button, Image } from 'semantic-ui-react';
import Dashboard from '../Dashboard';
import mapImg from './../../images/map.png';
import history from '../../history';

class CustomerDashboard extends React.Component {
  render = () => (
    //  TODO: only let them book car trip/rent vehicle if not currently on a trip;
    //  only let them manage trip if on one (so we'll need to call to get data on componentdidmount)
    <div>
      <Dashboard />
      <Button
        icon='car'
        onClick={this.bookCarTrip}>
        Book Car Trip
        </Button>
      <Button
        icon='bicycle'
        onClick={this.rentVehicle}>
        Rent Vehicle
        </Button>
      <Button>
        Manage Current Ryde
      </Button>
      <Image src={mapImg} size='massive' centered bordered />
    </div>
  );

  bookCarTrip = () => {
    history.push('/bookCarTrip');
  }

  rentVehicle = () => {
    //todo
  }

}

export default CustomerDashboard;