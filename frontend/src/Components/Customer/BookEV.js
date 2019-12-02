import React from 'react';
import ReactMapGL, { GeolocateControl, Marker } from "react-map-gl";
import { Grid, Icon, Label, Button } from 'semantic-ui-react';
import '../../Styles/BookEV.css'
import history from '../../history';
const axios = require('axios');

//  thanks uber https://uber.github.io/react-map-gl/#/Examples/dynamic-styling
//  TODO: add button to add other users to the trip so you can split fare
const defaultWidth = '80vw';
const defaultHeight = '60vh';
const defaultZoom = 12;

class BookEV extends React.Component {
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
      vehicleSelected: false
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
  renderMarkers = () => {
    const markers = [];
    for (const scooter of this.state.scooters) {
      // console.log(scooter);
      markers.push(
        <Marker className="location-marker" latitude={scooter.loc_latitude} longitude={scooter.loc_longitude} offsetLeft={-20} offsetTop={-10} key={scooter.vehicle_id}>
          <Label className="location-marker-label" pointing='below' color='red'>{scooter.scooter_model} Scooter</Label>
          <Icon className="location-marker-icon" name="map marker" color='green' size='big' />
        </Marker>
      );
    }

    for (const bike of this.state.bikes) {
      // console.log(bike);
      markers.push(
        <Marker className="location-marker" latitude={bike.loc_latitude} longitude={bike.loc_longitude} offsetLeft={-20} offsetTop={-10} key={bike.vehicle_id}>
          <Label className="location-marker-label" pointing='below' color='red'>Bike {bike.has_basket ? 'with' : 'without'} basket</Label>
          <Icon className="location-marker-icon" name="map marker alternate" color='green' size='big' />
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
  render = () => (
    <Grid padded="vertically" relaxed stretched centered container verticalAlign="middle">
      <ReactMapGL
        {...this.state.viewport}
        onViewportChange={this.handleViewportChange}
        mapboxApiAccessToken="pk.eyJ1Ijoib3NjYXJ3b25nNjciLCJhIjoiY2l2b211cW1mMDFoZjJ5cDUyZ24zNHluYiJ9.gMJv27QqmwIhA8eacn5Qtg"
        mapStyle="mapbox://styles/mapbox/streets-v10"
        children={this.props.children}
      >
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
        {this.renderMarkers()}
      </ReactMapGL>
      <Button onClick={this.submitCarTripRequest}>
        Book your Ryde!
      </Button>
    </Grid>
  );
}

export default BookEV;