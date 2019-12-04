import React from 'react';
import { Button } from 'semantic-ui-react'
import '../Styles/Dashboard.css'
import history from '../history';

class Dashboard extends React.Component{
  render = () => (
    <div className='dashboard'>
      <h2>You are now ready for a Ryde.</h2>
      <Button 
        content = 'Manage payment account'
        icon = 'payment'
        width = '16' 
        size = 'massive' 
        onClick = {this.managePaymentAccount}
      />
    </div>
  );
  managePaymentAccount = () => {
    history.push('/managePaymentAccount');
  }
}

export default Dashboard;