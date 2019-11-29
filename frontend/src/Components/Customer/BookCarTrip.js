import React from 'react';
import ReactMapGL, { GeolocateControl } from "react-map-gl";
import {Grid} from 'semantic-ui-react'

//  thanks uber https://uber.github.io/react-map-gl/#/Examples/dynamic-styling

const defaultWidth = '80vw';
const defaultHeight = '60vh';

class BookCarTrip extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      viewport: {
        width: defaultWidth,
        height: defaultHeight,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 12
      }
    }
  }
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.updatePosition)
    } 
  }
  updatePosition = (position) => {
    const viewport = this.state.viewport;
    viewport.latitude = position.coords.latitude;
    viewport.longitude = position.coords.longitude;
    this.setState({
      viewport
    })
  }
  handleViewportChange = (viewport) => {
    viewport.width = defaultWidth;
    viewport.height = defaultHeight;
    this.setState({
      viewport
    })
  }
  render = () => (
    <Grid className="book-car-trip" padded="vertically" relaxed stretched centered container verticalAlign="middle">
      <ReactMapGL
        {...this.state.viewport}
        onViewportChange={this.handleViewportChange}
        mapboxApiAccessToken="pk.eyJ1Ijoib3NjYXJ3b25nNjciLCJhIjoiY2l2b211cW1mMDFoZjJ5cDUyZ24zNHluYiJ9.gMJv27QqmwIhA8eacn5Qtg"
        mapStyle="mapbox://styles/mapbox/streets-v10"
        >
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
      </ReactMapGL>
    </Grid>
  );
}

export default BookCarTrip;