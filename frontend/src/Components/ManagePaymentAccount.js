import React from 'react';
import { Divider, Label, Button, Container, Input, Segment, Grid } from 'semantic-ui-react'
import history from '../history';
import Dashboard from './Dashboard';
const axios = require('axios');

class ManagePaymentAccount extends React.Component{
  constructor(props){
    super(props);
    const hasCreditCard = checkHasCreditCard();
    this.state = {
      amount: '',
      balance: null,
      creditCard: ''
    }

  }
  
  render = () => (
    <div>
      <Dashboard/>
      <Grid columns={5}>
        <Grid.Column></Grid.Column>
        <Grid.Column></Grid.Column>
        <Grid.Column>
          <Segment>
            <Label 
              content = 'Account Balance'
              attached = 'top'
              size = 'large'/>
            <Container>$ {this.state.amount}</Container>
          </Segment>
        </Grid.Column>
        <Grid.Column></Grid.Column>
        <Grid.Column></Grid.Column>
      </Grid>
      
      {
        (localStorage.getItem('accountType') === 'Customer')  ?
        this.renderAddFunds()
        : this.renderWithdrawFunds()
      }

    </div>
  )
  renderAddFunds = () => (
    <div>
      <Divider horizontal>Add Funds</Divider>
      
      {
        (this.hasCreditCard === true) ?
        this.renderHasCreditCard()
        : this.renderAddCreditCard()
      }
      
    </div>
  )
  renderHasCreditCard = () =>(
    <div>
      <Input 
        icon = 'dollar sign'
        iconPosition = 'left'
        placeholder = 'Amount'
        onChange = {this.handleUpdateAmount} 
      />
      <Button
        content = 'Add Funds'
        size = 'large'
        onClick = {this.addFunds}
      />
    </div>
  )
  renderAddCreditCard = () =>(
    <div>
      <Input 
        icon = 'credit card outline'
        iconPosition = 'left'
        placeholder = 'Credit Card'
        onChange = {this.handleUpdateCreditCard} 
      />
      <Button
        content = 'Add Credit Card'
        size = 'large'
        onClick = {this.addCreditCard}
      />
    </div>
  )
  handleUpdateAmount = (event) => {
    this.setState({ amount: event.target.value })
  }
  handleUpdateCreditCard = (event) => {
    this.setState({ creditCard: event.target.value })
  }
  renderWithdrawFunds = () => (
    <div>
      {/* todo */}
    </div>
  )
  addFunds = () => {
    //TODO
  }
}

function checkHasCreditCard () {
  axios.post('http://localhost:5000/api/getCustomerCreditCard', {
    userId: localStorage.getItem('accountId')
  }).then((response) => {
    if (response.data.success) {
      return true;
    } else {
      return false;
    }
  }).catch((error) => {
    alert('Failed to check for credit card');
    console.error(error);
  });
}

export default ManagePaymentAccount;