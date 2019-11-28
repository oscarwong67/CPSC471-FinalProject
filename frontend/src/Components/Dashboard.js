import React from 'react';
import { Button } from 'semantic-ui-react'

class Dashboard extends React.Component{

    render = () => (
        <div>
            <h2>You are now ready for a Ryde.</h2>
            <Button 
            icon = 'payment'
            width = '16' 
            size = 'massive' >
                Manage payment account
            </Button> 
        </div>
    );
}


export default Dashboard;