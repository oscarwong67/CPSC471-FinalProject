import React from 'react';
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Grid, Icon, Label, Button, Header } from 'semantic-ui-react';
import '../../Styles/MapStyle.css'
import history from '../../history';
const axios = require('axios');

//  thanks uber https://uber.github.io/react-map-gl/#/Examples/dynamic-styling
//  TODO: add button to add other users to the trip so you can split fare
const defaultWidth = '80vw';
const defaultHeight = '60vh';
const defaultZoom = 12;

class RentEV extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: defaultWidth,
        height: defaultHeight,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: defaultZoom
      },
      markers: [],
      scooters: [],
      bikes: [],
      vehicleSelected: false,
      popupInfo: {},
      selectedVehicleId: -1
    }
  }
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.updatePosition)
    }
    axios.get('http://localhost:5000/api/getAvailableElectricVehicles')
      .then((response) => {
        if (response.data.success) {
          const scooters = response.data.scooters;
          const bikes = response.data.bikes;
          // console.log(scooters);
          this.setState({
            scooters,
            bikes
          })
        } else {
          alert('No electric vehicles currently available, sorry!');
        }
      })
      .catch((error) => {
        alert('No electric vehicles currently available, sorry!');
      })
  }
  updatePosition = (position) => {
    const viewport = this.state.viewport;
    viewport.latitude = position.coords.latitude;
    viewport.longitude = position.coords.longitude;

    this.setState({
      viewport,
    })
  }
  submitRentEVRequest = () => {
    if (this.state.vehicleSelected) {
      axios.post('http://localhost:5000/api/rentElectricVehicle', {
        accountId: localStorage.getItem('accountId'),
        electricVehicleId: this.state.selectedVehicleId
      })
      .then((response) => {
        if (response.data.success) {
          alert('Successfully rented electric vehicle! Redirecting you to your dashboard. Ride safe!');
          history.push('/');
        } else {
          alert('Failed to book trip. Vehicle is unavailable at this time. Try again later.');
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Failed to book trip. Vehicle is unavailable at this time. Try again later.');
      });
    }
  }
  handleMarkerClick = (latitude, longitude, selectedVehicleId) => {
    const popupInfo = { latitude, longitude };
    this.setState({
      popupInfo,
      vehicleSelected: true,
      selectedVehicleId
    });
  }
  renderPopup = () => {
    return (
      this.state.vehicleSelected && (<Popup
        tipSize={8}
        anchor="bottom"
        longitude={this.state.popupInfo.longitude}
        latitude={this.state.popupInfo.latitude}
        closeOnClick={false}
      >Selected!</Popup>)
    );
  };
  renderMarkers = () => {
    const markers = [];
    for (const scooter of this.state.scooters) {
      // console.log(scooter);
      markers.push(
        <Marker className="location-marker"
          latitude={scooter.loc_latitude}
          longitude={scooter.loc_longitude}
          offsetLeft={-20}
          offsetTop={-10}
          key={scooter.vehicle_id}
        >
          <Label className="location-marker-label" pointing='below' color='red'>{scooter.scooter_model} Scooter</Label>
          <Icon className="location-marker-icon"
            name="map marker"
            color='green'
            size='big'
            onClick={() => this.handleMarkerClick(scooter.loc_latitude, scooter.loc_longitude, scooter.vehicle_id)} />
        </Marker>
      );
    }

    for (const bike of this.state.bikes) {
      // console.log(bike);
      markers.push(
        <Marker className="location-marker"
          latitude={bike.loc_latitude}
          longitude={bike.loc_longitude}
          offsetLeft={-20}
          offsetTop={-10}
          key={bike.vehicle_id}
        >
          <Label className="location-marker-label" pointing='below' color='red'>Bike {bike.has_basket ? 'with' : 'without'} basket</Label>
          <Icon className="location-marker-icon"
            name="map marker"
            color='green'
            size='big'
            onClick={() => this.handleMarkerClick(bike.loc_latitude, bike.loc_longitude, bike.vehicle_id)} />
        </Marker>
      );
    }
    return markers;
  }
  handleViewportChange = (viewport) => {
    viewport.width = defaultWidth;
    viewport.height = defaultHeight;
    viewport.zoom = defaultZoom;
    this.setState({
      viewport
    })
  }
  backToDashboard = () => {
    history.push('/')
  }
  render = () => (
    <div>
      <Button
        content = 'Back to Dashboard'
        icon = 'arrow left'
        onClick = {this.backToDashboard}
      />
      <h6>   </h6>
      <Header as = 'h2'>ELECTRIC VEHICLE RYDE</Header>
      <Grid padded="vertically" relaxed stretched centered container verticalAlign="middle">
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={this.handleViewportChange}
          mapboxApiAccessToken="pk.eyJ1Ijoib3NjYXJ3b25nNjciLCJhIjoiY2l2b211cW1mMDFoZjJ5cDUyZ24zNHluYiJ9.gMJv27QqmwIhA8eacn5Qtg"
          mapStyle="mapbox://styles/mapbox/streets-v10"
          children={this.props.children}
        >
          {this.renderMarkers()}
          {this.renderPopup()}
        </ReactMapGL>
      </Grid>
      <h6>   </h6>
      <Button 
        onClick={this.submitRentEVRequest}
        content = 'Book your Ryde!'
      />
    </div>
  );
}

export default RentEV;