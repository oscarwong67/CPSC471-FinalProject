import React from 'react';
import { Grid, Header, Label, Icon, Button } from 'semantic-ui-react';
import ReactMapGL, { Marker } from "react-map-gl";
import '../../Styles/MapStyle.css';

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
          <Label className="location-marker-label" pointing='below'>This is where you're going!</Label>
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
        <Label className="location-marker-label" pointing='below'>This is where you are!</Label>
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
      <Header as="h3">Current Ride Info: </Header>
      <Button content="End Ryde" onClick={this.endCustomerTrip} />
    </Grid>
  );
}

export default ManageCustomerTrip;