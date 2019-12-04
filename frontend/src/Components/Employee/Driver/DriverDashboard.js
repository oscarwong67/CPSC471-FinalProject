import React from 'react';
import { Divider, Rating } from 'semantic-ui-react'
import Dashboard from '../../Dashboard'
import TripPagePicker from './TripPagePicker'
const axios = require('axios');

class DriverDashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentTrip: null,
      rating: 0
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
    axios.post('http://localhost:5000/api/getDriverRating', {
      userId: localStorage.getItem('accountId')
    }).then((response) => {
      if (response.data.success) {
        console.log(response.data.rating);
        this.setState({
          rating: response.data.rating.driver_rating
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
      <Rating disabled icon='star' defaultRating = {this.state.rating} maxRating={5} />
    </div>
    
  )
}

export default DriverDashboard;