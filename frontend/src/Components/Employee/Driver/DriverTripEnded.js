import React from 'react';
import { Grid, Header, Label, Icon, Button, Container, Divider, Rating } from 'semantic-ui-react';
import history from '../../../history'
const axios = require('axios');
const moment = require('moment');

class DriverTripEnded extends React.Component{
  constructor(props) {
    super(props)
    this.state= {
      currentTrip: {},
      customerRating: 3
    }
  }
  componentDidMount(){
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
    axios.get('http://localhost:5000/api/payDriver', {
      params: {
        userId: localStorage.getItem('accountId'),
        fare: this.state.currentTrip.fare
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
  }
  render = () => (
    <div>
      <h2>Ryde has ended</h2>
      <h3>How was {this.state.currentTrip.fname} {this.state.currentTrip.lname}?</h3>
      <Rating 
        icon = 'star' 
        defaultRating = {3} 
        maxRating = {5} 
        onRate = {this.handleRate}
      />
      <h5></h5>
      <Button 
        content = 'Submit Rating!'
        size = 'large'
        onClick = {this.submitRating}
      />
    </div>
  )
  handleRate = (event, {rating}) => {
    this.setState({ customerRating: rating })
  }
  submitRating = () => {
    console.log(this.state.currentTrip.user_id)
    console.log(this.state.customerRating)
    axios.post('http://localhost:5000/api/rateCustomer', {
        customerId: this.state.currentTrip.user_id,
        customerRating: this.state.customerRating
    }).then((response) => {
      if (response.data.success) {
        alert('redirecting to dashboard');
        history.pushState('/')
      } else {
        console.error(response);
      }
    }).catch((error) => {
      console.error(error);
    });
    
  }
}

export default DriverTripEnded;