import React from 'react';
import { Button, Image } from 'semantic-ui-react';
import Dashboard from '../Dashboard';
import mapImg from './../../images/map.png';

class CustomerDashboard extends React.Component {
  render = () => (
    <div>
      <Dashboard />
        <Button
          icon='car'>
          Book Car Ride
        </Button>
        <Button
          icon='bicycle'>
          Rent Vehicle
        </Button>        
      <Image src={mapImg} size='massive' centered bordered />
    </div>
  );
}

export default CustomerDashboard;