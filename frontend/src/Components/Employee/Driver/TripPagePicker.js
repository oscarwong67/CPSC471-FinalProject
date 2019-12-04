import React from 'react';
import DriverCurrentTrip from './DriverCurrentTrip'
import DriverTripEnded from './DriverTripEnded'
const axios = require('axios');

function chooseDashboard() {
  const accountType = axios.post();
  switch (accountType) {
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

const DashboardPicker = () => chooseDashboard();

export default DashboardPicker;