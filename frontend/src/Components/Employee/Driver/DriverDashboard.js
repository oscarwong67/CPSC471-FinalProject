import React from 'react';
import { Divider } from 'semantic-ui-react'
import Dashboard from '../../Dashboard'
import TripPagePicker from './TripPagePicker'
const axios = require('axios');

class DriverDashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentTrip: null
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
    })
  }
  render = () => (
    <div>
      <Dashboard />
      {
        this.state.currentTrip ?
        this.renderCurrentTrip()
        : this.renderWaitingForTrip()
      }
      <h4></h4>
    </div>
  )
  renderCurrentTrip = () => (
    <TripPagePicker/>
  )
  renderWaitingForTrip = () => (
    <div>
      <h1>Waiting for Ryde</h1>
      <Divider horizontal>Your Rating</Divider>
    </div>
    
  )
}

export default DriverDashboard;