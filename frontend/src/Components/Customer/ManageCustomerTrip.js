import React from 'react';
import { Grid, Header, Label, Icon, Button, Container, List } from 'semantic-ui-react';
import ReactMapGL, { Marker } from "react-map-gl";
import '../../Styles/MapStyle.css';
const axios = require('axios');
const moment = require('moment');

const defaultWidth = '80vw';
const defaultHeight = '40vh';
const defaultZoom = 12;
class ManageCustomerTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTrip: {},
      viewport: {
        width: defaultWidth,
        height: defaultHeight,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: defaultZoom
      },
      latitude: 51.0776,
      longitude: -114.1407,
    }
  }
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.updatePosition)
    }
    axios.get('http://localhost:5000/api/getCustomerTrip', {
      params: {
        userId: localStorage.getItem('accountId')
      }
    }).then((response) => {
      console.log(response.data);
      if (response.data.success) {
        this.setState({
          currentTrip: response.data.trip
        })
      } else {
        console.error(response);
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  endCustomerTrip = () => {

  }
  updatePosition = (position) => {
    const viewport = this.state.viewport;
    viewport.latitude = position.coords.latitude;
    viewport.longitude = position.coords.longitude;

    this.setState({
      viewport,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })
  }
  handleViewportChange = (viewport) => {
    viewport.width = defaultWidth;
    viewport.height = defaultHeight;
    viewport.zoom = defaultZoom;
    this.setState({
      viewport
    })
  }
  renderCarTripInfo = () => {
    return (
      <div>
        <br/> 
        <List>
          <List.Item><strong>Driver:</strong> {this.state.currentTrip.fname + " " + this.state.currentTrip.lname}</List.Item>
          <List.Item><strong>Driver Phone#:</strong> {this.state.currentTrip.phone_no}</List.Item>
          <List.Item><strong>Car:</strong> {`${this.state.currentTrip.color} ${this.state.currentTrip.make}`}</List.Item>
          <List.Item><strong>License Plate:</strong> {this.state.currentTrip.license_plate}</List.Item>
        </List>
      </div>
    );
  }
  renderTripInfo = () => {
    if (Object.entries(this.state.currentTrip).length !== 0) {
      let extraTripInfo = null;
      if (this.state.currentTrip.type === "carTrip") {
        extraTripInfo = this.renderCarTripInfo();
      }
      const startDate = moment(this.state.currentTrip.date).format("dddd, MMMM Do YYYY");
      const startTime = moment(this.state.currentTrip.start_time.slice(0, 5), 'hh:mm').format('h:mm a');
      const currentTime = moment().format("h:mm a");
      const currentDate = moment().format("dddd, MMMM, Do YYYY");
      return (
        <List>
          <List.Item><strong>Start Date & Time:</strong> {startDate} {startTime}</List.Item>
          <List.Item><strong>Current Date & Time:</strong> {currentDate} {currentTime}</List.Item>
          {extraTripInfo}
        </List>
      );
    }
  }
  renderCarTripMarkers = () => {
    return (
      this.state.currentTrip.type === "carTrip" &&
      (<div>
        <Marker className="location-marker"
          latitude={this.state.currentTrip.dest_latitude}
          longitude={this.state.currentTrip.dest_longitude}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <Label className="location-marker-label" pointing='below' color='red'>This is where you're going!</Label>
          <Icon className="location-marker-icon" name="map marker" color='green' size='big' />
        </Marker>
        <Marker className="location-marker"
          latitude={this.state.currentTrip.pickup_latitude}
          longitude={this.state.currentTrip.pickup_longitude}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <Label className="location-marker-label" pointing='below'>This is where you started!</Label>
          <Icon className="location-marker-icon" name="map marker" color='red' size='big' />
        </Marker>
      </div>)
    );
  }
  renderEVCurrentLocationMarker = () => {
    return (
      this.state.currentTrip.type === "electricVehicleTrip" &&
      (<Marker className="location-marker"
        latitude={this.state.latitude}
        longitude={this.state.longitude}
        offsetLeft={-20}
        offsetTop={-10}
      >
        <Label className="location-marker-label" pointing='below' color='red'>This is where you are!</Label>
        <Icon className="location-marker-icon" name="map marker" color='green' size='big' />
      </Marker>)
    );
  }
  render = () => (
    <Grid padded="vertically" relaxed stretched centered container verticalAlign="middle">
      <Header as="h2">Your Current Ryde</Header>
      <ReactMapGL
        {...this.state.viewport}
        mapboxApiAccessToken="pk.eyJ1Ijoib3NjYXJ3b25nNjciLCJhIjoiY2l2b211cW1mMDFoZjJ5cDUyZ24zNHluYiJ9.gMJv27QqmwIhA8eacn5Qtg"
        mapStyle="mapbox://styles/mapbox/streets-v10"
        children={this.props.children}
        onViewportChange={this.handleViewportChange}
      >
        {this.renderEVCurrentLocationMarker()}
        {this.renderCarTripMarkers()}
      </ReactMapGL>
      <Container>
        <Header as="h3">Current Ride Info: </Header>
        {this.renderTripInfo()}
      </Container>
      <Button content="End Ryde" onClick={this.endCustomerTrip} />
    </Grid>
  );
}

export default ManageCustomerTrip;