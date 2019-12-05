import React from 'react';
import { Button, Rating } from 'semantic-ui-react'
// import TripPagePicker from './TripPagePicker'
import DriverCurrentTrip from './DriverCurrentTrip'
// import DriverTripEnded from './DriverTripEnded'
import history from '../../../history'
const axios = require('axios');

class ViewDriverTrip extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentTrip: {},
      tripStatus: null,
      customerRating: 3
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
    axios.get('http://localhost:5000/api/getDriverTripStatus', {
      params: {
        userId: localStorage.getItem('accountId')
      }
    }).then((response) => {
      if (response.data.success) {
        this.setState({
          tripStatus: response.data.status
        })
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  render = () => (
    <div>
      <Button
        content = 'Back to Dashboard'
        icon = 'arrow left'
        onClick = {this.backToDashboard}
      />
      {
        (this.state.tripStatus === 'ACTIVE') ? 
          <DriverCurrentTrip /> 
          : this.renderTripEnded
      }
      <h4></h4>
    </div>
  )
  renderTripEnded = () => (
    <div>
    {
      this.state.currentTrip ? 
      <div>
      <h2>Ryde has ended</h2>
      <h3>How was {this.state.currentTrip.fname} {this.state.currentTrip.lname}?</h3>
      <Rating 
        icon = 'star' 
        defaultRating = {3} 
        maxRating = {5} 
        onRate = {this.handleRating}
      />
      <h5></h5>
      <Button 
        content = 'Submit Rating!'
        size = 'large'
        onClick = {this.submitRating}
      />
    </div> 
    : <p>error</p>
    }
    </div>
  )
  handleRating = (event, {rating}) => {
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
        axios.post('http://localhost:5000/api/setDriverEnded', {
          driver_id: localStorage.getItem('accountId')
        }).then((response) => {
          if (response.data.success) {
            this.setState({
              currentTrip: {}
            })
          }
        }).catch((error) => {
          console.error(error);
        });
        alert('Trip has ended! Redirecting to dashboard');
        history.push('/');
      } else {
        console.error(response);
      }
    }).catch((error) => {
      console.error(error);
    });
    console.log(this.state.currentTrip.fare);
    axios.post('http://localhost:5000/api/payDriver', {
      userId: localStorage.getItem('accountId'),
      fare: this.state.currentTrip.fare
    }).then((response) => {
      if (response.data.success) {
        this.setState({
          currentTrip: response.data.trip
        });
      }
    }).catch((error) => {
      console.log(error);
    });
    this.setState({currentTrip: {}, tripStatus: null});
    history.push('/');
  }
}

export default ViewDriverTrip;