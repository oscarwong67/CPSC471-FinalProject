import React from 'react';
import './App.css';
import { Header } from 'semantic-ui-react'
import { Button } from 'semantic-ui-react'

function App() {

  return (
    <div className="App">
      <Header as='h1' color='pink' className="App-header">
        Welcome to Ryde
      </Header>

      <Button 
      onClick = {console.log("clicked")} >
       Login
       </Button>
      
      

    </div>
  );
}




export default App;
