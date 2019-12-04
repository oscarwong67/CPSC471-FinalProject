import React from 'react';
import DriverCurrentTrip from './DriverCurrentTrip'
import DriverTripEnded from './DriverTripEnded'
const axios = require('axios');

function chooseDriverTripsPage() {
  const TripStatus = null;
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
  switch (TripStatus) {
      case 'idk1':
          return <DriverCurrentTrip />;
      case 'idk2':
          return <DriverTripEnded />;
      default:
          return (
              <div>
                  Error!
              </div>
          );
  }
}

const TripPagePicker = () => chooseDriverTripsPage();

export default TripPagePicker;