import React from 'react';
import { Button, Form, Grid } from 'semantic-ui-react'
import Dashboard from '../../Dashboard'
import history from '../../../history';
const axios = require('axios');

class ChargerDashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      vehicleId: '',
      percentage: ''
    }
  }
  render = () => (
    <div>
      <Dashboard/>
      <Grid columns = {3}>
        <Grid.Column></Grid.Column>
          <Grid.Column>
            <Form>
              <Form.Group widths='equal'>
                <Form.Input
                  label = 'vehicle id'
                  placeholder = 'vehicle id'
                  value = {this.state.vehicleId}
                  onChange = {this.handleUpdateVehicleId}
                />
                <Form.Input
                  label ='percentage'
                  icon = 'percent'
                  placeholder ='percentage'
                  value = {this.state.percentage}
                  onChange = {this.handleUpdatePercentage}
                />
              </Form.Group>
            </Form>
          </Grid.Column>
        <Grid.Column></Grid.Column>
      </Grid>
        <Button
        size = 'large'
        onClick = {this.chargeElectricVehicle}
        content = 'Enter'
        />
    </div>    
  );
  chargeElectricVehicle = () => {
    if (this.state.vehicleId === '' || this.state.percentage === ''){
      alert('Please fill out all forms!');
    } else if(this.state.percentage <= 0){
      alert('invalid charge percentage')
    } else {
      axios.post('http://localhost:5000/api/chargeElectricVehicle', {
        vehicle_id: this.state.vehicleId,
        percentage: this.state.percentage,
        userId: localStorage.getItem('accountId')
      }).then((response) => {
        if(response.data.success){
          alert('successfully charged');
          this.setState({vehicleId: '', percentage: ''})
        } else {
          alert('failed to charge. Please try again.');
        }
      })
    }
  }
  handleUpdateVehicleId = (event) => {
    this.setState({ vehicleId: event.target.value });
  }
  handleUpdatePercentage = (event) => {
    this.setState({ percentage: event.target.value });
  }
}

export default ChargerDashboard;