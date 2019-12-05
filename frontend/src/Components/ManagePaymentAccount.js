import React from 'react';
import { Divider, Label, Button, Container, Input, Segment, Grid, Header } from 'semantic-ui-react'
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
      hasCreditCard: false
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
          creditCard: response.data.credit_card,
          hasCreditCard: true
        })
      }
    }).catch((error) => {
      console.log(error)
    });
  }
  render = () => (
    <div>
      <Dashboard/>
      <Button
        content = 'Back to Dashboard'
        icon = 'arrow left'
        onClick = {this.backToDashboard}
      />
      <h4>   </h4>
      <Header as = 'h2'>PAYMENT ACCOUNT</Header>
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
      <h4>   </h4>

      {
        (localStorage.getItem('accountType') === 'Customer')  ?
        this.renderAddFunds()
        : this.renderWithdrawFunds()
      }
      <h4>   </h4>
    </div>
  )
  renderAddFunds = () => (
    <div>
      <Divider horizontal>Add Funds</Divider>
      {
        (this.state.hasCreditCard) ?
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
  addCreditCard = () => {
    if (this.state.creditCard === ''){
      alert('Please fill out all forms!');
    } else if(this.state.creditCard <= 0){
      alert('invalid credit card')
    } else {
      axios.post('http://localhost:5000/api/addCreditCard', {
        creditCard: this.state.creditCard,
        userId: localStorage.getItem('accountId')
      }).then((response) => {
        if(response.data.success){
          alert('successfully added credit card');
          // this.setState({ amount: ''})
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
  backToDashboard = () => {
    history.push('/')
  }
}

export default ManagePaymentAccount;