import React from 'react';
import { Button, Divider, Rating } from 'semantic-ui-react';
import Dashboard from '../Dashboard';
import history from '../../history';
const axios = require('axios');

class CustomerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTripId: null,
      balance: -1,
      customerRating: 0
    }
  }
  componentDidMount() {
    axios.get('http://localhost:5000/api/getCustomerTripStatus', {
      params: {
        userId: localStorage.getItem('accountId')
      }
    }).then((response) => {
      if (response.data.success) {
        this.setState({
          currentTripId: response.data.tripId,
        });
      }
      axios.get('http://localhost:5000/api/getAccountBalance', {
        params: {
          accountId: localStorage.getItem('accountId')
        }
      }).then((response) => {
        if (response.data.success) {
          this.setState({
            balance: response.data.accountBalance
          })
        }
      }).catch((error) => {
        console.error(error);
      })
    }).catch((error) => {
      console.log(error);
    })
    axios.get('http://localhost:5000/api/getCustomerRating', {
      params: {
        userId: localStorage.getItem('accountId')
      }
    }).then((response) => {
      if (response.data.success) {
        this.setState({
          customerRating: response.data.rating          
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  render = () => (
    //  TODO: only let them book car trip/rent vehicle if not currently on a trip;
    //  only let them manage trip if on one (so we'll need to call to get data on componentdidmount)
    <div>
      <Dashboard />
      {
        this.state.currentTripId ?
          <Button 
            onClick={this.manageTrip}
            content='Manage Current Ryde'
            icon='setting'
          />            
          : <div>
            <Button
              onClick={this.bookCarTrip}
              content = 'Book Car Trip'
              icon = 'car'
            />
            <Button
              onClick={this.rentVehicle}
              content = 'Rent Vehicle'
              icon = 'bicycle'
            />
          </div>
      }
      <h6>  </h6>
      <Divider horizontal>Your Rating</Divider>
      <Rating 
        icon='star' 
        rating = {this.state.customerRating}
        maxRating={5} 
        disabled 
      />
      <h6>   </h6>
    </div>
  );
  bookCarTrip = () => {
    if (this.state.balance > 0) {
      history.push('/bookCarTrip');
    } else {
      alert('Your balance is currently at or below $0. Please add more to book a Ryde.');
    }
  }
  rentVehicle = () => {
    if (this.state.balance > 0) {
      history.push('/rentVehicle');
    } else {
      alert('Your balance is currently at or below $0. Please add more to book a Ryde.');
    }
  }
  manageTrip = () => {
    history.push('/manageCustomerTrip');
  }
}

export default CustomerDashboard;