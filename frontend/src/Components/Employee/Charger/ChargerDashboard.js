import React from 'react';
import { Input } from 'semantic-ui-react'
import { Button } from 'semantic-ui-react'
import Dashboard from '../Dashboard'

class ChargerDashboard extends React.Component{
  constructor(props){
    super (props);
    percentage: ''
    vehicleId: ''
  }

  render = () => (
    <div>
      <Dashboard/>
      <Input focus placeholder='Enter Vehicle ID'
      onUpdate = {this.handleUpdateVehicleId} />
      <Input
        label={{ basic: true, content: '%' }}
        labelPosition='right'
        placeholder='Enter Percentage Charged'
        onUpdate = {this.handleUpdatePercentage}
      />
      <Button
      onClick = { this.submitCharge }>
        Enter
      </Button>
    </div>
    
  );

  submitCharge = () => {
    //todo
  }

  handleUpdateVehicleId = (event) => {
    this.setState({
      vehicleId: event.target.value
    })
  }

  handleUpdateVehicleId = (event) => {
    this.setState({
      percentage: event.target.value
    })
  }

}