import React from 'react';
import { Divider, Label, Button, Container, Input, Segment, Grid } from 'semantic-ui-react'
import history from '../history';
import Dashboard from './Dashboard';
const axios = require('axios');

class ManagePaymentAccount extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      amount: '',
      balance: 0,
      creditCard: '',
      // hasCreditCard: null
    }
  }
  componentDidMount() {
    axios.get('http://localhost:5000/api/getAccountBalance', {
      params: {
        accountId: localStorage.getItem('accountId')
      }
    }).then((response) => {
      if(response.data.success){
        this.setState({ 
          balance: response.data.accountBalance
        })
      }
    }).catch((error) => {
      console.log(error)
    });
    axios.get('http://localhost:5000/api/getCustomerCreditCard', {
      params : {
        accountId: localStorage.getItem('accountId')
      }
    }).then((response) => {
      if (response.data.success){
        this.setState({
          creditCard: response.data.credit_card
        })
      }
    }).catch((error) => {
      console.log(error)
    });
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
            <Container>$ {this.state.balance}</Container>
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
        (this.state.creditCard !== '') ?
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
      <Divider horizontal>Withdraw Funds</Divider>
      <Button
        content = 'Withdraw'
        size = 'large'
        onClick = {this.withdrawFunds}
      />
    </div>
  )
  addFunds = () => {
    if (this.state.amount === ''){
      alert('Please fill out all forms!');
    } else if(this.state.amount <= 0){
      alert('invalid amount. Please enter a positive value!')
    } else {
      axios.post('http://localhost:5000/api/addFunds', {
        amount: this.state.amount,
        userId: localStorage.getItem('accountId')
      }).then((response) => {
        if(response.data.success){
          alert('successfully added funds');
          this.setState({ amount: ''})
          window.location.reload();
        } else {
          alert('failed to add funds. Please try again later.');
        }
      })
    }
  }
  withdrawFunds = () => {
    axios.post('http://localhost:5000/api/withdrawFunds', {
      userId: localStorage.getItem('accountId')
    }).then((response) => {
      if(response.data.success){
        alert('successfully withdrew account balance');
        this.setState({ balance: 0 })
      } else {
        alert('failed to withdraw account balance. Please try again later.');
      }
    })
  }
}

export default ManagePaymentAccount;