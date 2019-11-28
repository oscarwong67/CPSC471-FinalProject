import React from 'react';
import { Input } from 'semantic-ui-react'
import { Button } from 'semantic-ui-react'
import Dashboard from '../Dashboard'

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
      {
        true ?
        renderCurrentTrip()
        : renderWaitingForTrip()
      }
    </div>
  )

}