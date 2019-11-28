import React from 'react';
import { Input, Button } from 'semantic-ui-react'
import Dashboard from '../../Dashboard'

class ChargerDashboard extends React.Component{

  render = () => (
    <div>
      <Dashboard/>
      <Input focus placeholder='Enter Vehicle ID' />
      <Input
        label={{ basic: true, content: '%' }}
        labelPosition='right'
        placeholder='Enter Percentage Charged'
      />
      <Button>
        Enter
      </Button>
    </div>
    
  );
}

export default ChargerDashboard;