import React from 'react';
import { Button, Image } from 'semantic-ui-react';
import Dashboard from '../Dashboard';
import mapImg from './../../images/map.png';

class CustomerDashboard extends React.Component {
  render = () => (
    <div>
      <Dashboard />
        <Button
        icon = 'car'
        onClick = {this.bookCarTrip}>
          Book Car Trip
        </Button>
        <Button
        icon = 'bicycle'
        onClick = {this.rentVehicle}>
          Rent Vehicle
        </Button>        
      <Image src={mapImg} size='massive' centered bordered />
    </div>
  );

  bookCarTrip = () =>{
    //todo
  }

  rentVehicle = () => {
    //todo
  }

}
