import React from 'react';
import { Button, Image } from 'semantic-ui-react';
import Dashboard from '../Dashboard';
import mapImg from './../../images/map.png';
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
    }).then((error) => {
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
          <Button>
            Manage Current Ryde
          </Button> 
          : <div>
            <Button
              icon='car'
              onClick={this.bookCarTrip}>
              Book Car Trip
            </Button>
            <Button
              icon='bicycle'
              onClick={this.rentVehicle}>
              Rent Vehicle
            </Button>
          </div>
      }
      <Image src={mapImg} size='massive' centered bordered />
    </div>
  );

  bookCarTrip = () => {
    history.push('/bookCarTrip');
  }

  rentVehicle = () => {
    //todo
  }

}

export default CustomerDashboard;