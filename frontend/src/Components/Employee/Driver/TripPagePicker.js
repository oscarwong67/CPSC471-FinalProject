import React from 'react';
import DriverCurrentTrip from './DriverCurrentTrip'
import DriverTripEnded from './DriverTripEnded'
const axios = require('axios');

class TripPagePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tripStatus: null
    }
  }
  componentDidMount(){
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
    })
  }
  render = () => (
    <div>
      {
        (this.state.tripStatus === 'ACTIVE') ? 
          <DriverCurrentTrip /> 
          : <DriverTripEnded />
      }
    </div>
    
  )
}

export default TripPagePicker;