import React from 'react';
import { Button } from 'semantic-ui-react';
import Dashboard from '../Dashboard';
import history from '../../history';
const axios = require('axios');

class CustomerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTripId: null
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
          currentTripId: response.data.tripId
        });
      }
    }).catch((error) => {
      console.log(error);
    })
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
    </div>
  );

  bookCarTrip = () => {
    history.push('/bookCarTrip');
  }

  rentVehicle = () => {
    history.push('/rentVehicle');
  }

  manageTrip = () => {
    history.push('/manageCustomerTrip');
  }
}

export default CustomerDashboard;