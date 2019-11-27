import React from 'react';
import './App.css';
import { Header, Button } from 'semantic-ui-react'
import Login from './Components/Login';

function App() {

  return (
    <div className="App">
      <Header as='h1' color='pink' className="App-header">
        Welcome to Ryde
      </Header>
      <Login />
    </div>
  );
}




export default App;
