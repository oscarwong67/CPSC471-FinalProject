import React from 'react';
import { Button } from 'semantic-ui-react'
import { Image } from 'semantic-ui-react'
import Dashboard from '../Dashboard'

class CustomerDashboard extends React.Component{
  render = () =>(
    <div>
      <Dashboard />
      <Button.Group 
      widths = 'sixteen'>
        <Button
        icon = 'car'>
          Book Car Ride
        </Button>
        <Button
        icon = 'bicycle'>
          Rent Vehicle
        </Button>
        <Image src='../../../public/map' fluid />
      </Button.Group>

    </div>
  );
}