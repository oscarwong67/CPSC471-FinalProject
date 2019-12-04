import React from 'react';
import { Divider, Rating, Button } from 'semantic-ui-react'
import Dashboard from '../../Dashboard'
import TripPagePicker from './TripPagePicker'
import history from '../../../history'
const axios = require('axios');

class DriverDashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentTripId: null,
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
          currentTripId: response.data.trip.trip_id
        });
      }
    }).catch((error) => {
      console.log(error);
    });
    axios.get('http://localhost:5000/api/getDriverRating', {
      params:{
        userId: localStorage.getItem('accountId')
      }
    }).then((response) => {
      if (response.data.success) {
        this.setState({
          rating: response.data.rating.driver_rating
          
        });
        console.log(this.state.rating);
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  render = () => (
    <div>
      <Dashboard />
      {
        this.state.currentTripId ?
          <Button 
            onClick={this.viewCurrentTrip}
            content='View Current Ryde'
            icon='car'
          />            
          : 
          <div>
            <h1>Waiting for Ryde</h1>
            <Divider horizontal>Your Rating</Divider>
            <Rating disabled icon='star' defaultRating = {this.state.rating} maxRating={5} />
          </div>  
      }
    </div>
  )
  viewCurrentTrip = () => {
    history.push('/viewDriverTrip');
  }
}

export default DriverDashboard;