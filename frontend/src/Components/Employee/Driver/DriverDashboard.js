import React from 'react';
import { Input, Button } from 'semantic-ui-react'
import Dashboard from '../../Dashboard'

class DriverDashboard extends React.Component{
  renderCurrentTrip = () => {
    return (
      <div>
        Current Trip:
      </div>
    );
  }

  render = () => (
    <div>
      <Dashboard />
      {
        true ?
        this.renderCurrentTrip()
        : this.renderWaitingForTrip()
      }
    </div>
  )
}

export default DriverDashboard;