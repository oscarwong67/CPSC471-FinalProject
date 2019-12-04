import React from 'react';
import { Divider, Rating, Button } from 'semantic-ui-react'
import Dashboard from '../../Dashboard'
import TripPagePicker from './TripPagePicker'
import history from '../../../history'
const axios = require('axios');

class ViewDriverTrip extends React.Component{
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
  }
  render = () => (
    <div>
      <Button
        content = 'Back to Dashboard'
        icon = 'arrow left'
        onClick = {this.backToDashboard}
      />
      <TripPagePicker/>
      <h4></h4>
    </div>
  )
  backToDashboard = () => {
    history.push('/')
  }
}

export default ViewDriverTrip;