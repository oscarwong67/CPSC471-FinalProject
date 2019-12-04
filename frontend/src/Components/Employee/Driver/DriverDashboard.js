import React from 'react';
import { Input, Button } from 'semantic-ui-react'
import Dashboard from '../../Dashboard'
import DriverCurrentTrip from './DriverCurrentTrip'
import DriverTripEnded from './DriverTripEnded'
const axios = require('axios');

class DriverDashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentTripId: null
    }
  }
  componentDidMount() {
    axios.get('http://localhost:5000/api/getDriverTripStatus', {
      params: {
        userId: localStorage.getItem('accountId')
      }
    }).then((response) => {
      if (response.data.success) {
        this.setState({
          currentTripId: response.data.tripId
        });
      }
    }).catch((error) => {
      console.log(error);
    })
  }
  render = () => (
    <div>
      <Dashboard />
      <DriverTripEnded/>

      {/* {
        this.state.currentTripId ?
        this.renderCurrentTrip()
        : this.renderWaitingForTrip()
      } */}
      <h4></h4>
    </div>
  )
  renderCurrentTrip = () => (
    <DriverCurrentTrip />
  )
  renderWaitingForTrip = () => (
    <h1>Waiting for Ryde</h1>
  )
}

export default DriverDashboard;