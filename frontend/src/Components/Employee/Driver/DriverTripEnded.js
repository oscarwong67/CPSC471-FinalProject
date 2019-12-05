import React from 'react';
import { Button, Rating, Header } from 'semantic-ui-react';
import history from '../../../history'
const axios = require('axios');

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
  }
  backToDashboard = () => {
    history.push('/')
  }
  render = () => (
    <div>
      {
        (this.state.currentTrip)?
        <div>
          <Button
            content = 'Back to Dashboard'
            icon = 'arrow left'
            onClick = {this.backToDashboard}
          />
          <h6>   </h6>
          <Header as = 'h2'>END OF RYDE</Header>
          <h3>How was {this.state.currentTrip.fname} {this.state.currentTrip.lname}?</h3>
          <Rating 
            icon = 'star' 
            defaultRating = {3} 
            maxRating = {5} 
            onRate = {this.handleRate}
          />
          <h5>   </h5>
          <Button 
            content = 'Submit Rating!'
            size = 'large'
            onClick = {this.submitRating}
          />
        </div>
        : history.push('/')
      }
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
        window.location.reload();
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
  }
}

export default DriverTripEnded;