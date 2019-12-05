import React from 'react';
import { Divider, Rating, Button } from 'semantic-ui-react'
import Dashboard from '../../Dashboard'
import history from '../../../history'
const axios = require('axios');

class DriverDashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentTrip: null,
      driverRating: 0
    }
  }
  componentDidMount() {
    axios.get('http://localhost:5000/api/getDriverTrip', {
      params: {
        userId: localStorage.getItem('accountId')
      }
    }).then((response) => {
      if (response.data.success) {
        this.setState({
          currentTrip: response.data.trip
        });
      }
    }).catch((error) => {
      console.log(error);
    });

    axios.get('http://localhost:5000/api/getDriverRating', {
      params: {
        userId: localStorage.getItem('accountId')
      }
    }).then((response) => {
      if (response.data.success) {
        this.setState({
          driverRating: response.data.rating          
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  render = () => (
    <div>
      <Dashboard />
      {
        this.state.currentTrip ?
          <Button 
            onClick={this.viewCurrentTrip}
            content='View Current Ryde'
            icon='car'
          />            
          : 
          null
      }

      <Divider horizontal>Your Rating</Divider>
      <Rating 
        icon='star' 
        rating = {this.state.driverRating}
        maxRating={5} 
        disabled />
    </div>
  )
  viewCurrentTrip = () => {
    this.setState({currentTrip: null})
    history.push('/viewDriverTrip');
  }
}

export default DriverDashboard;