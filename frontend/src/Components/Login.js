import React from 'react';
import { Button, Divider, Form, Grid, Segment, Radio } from 'semantic-ui-react';
import history from '../history';
import { validateInputs } from '../helper';
const axios = require('axios');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      accountType: '',
      carState: {}
    }
  }
  render = () => (
    <Segment placeholder>
      <Grid columns={2} relaxed='very' stackable>
        <Grid.Column>
          <Form>
            <Form.Input
              icon='at'
              iconPosition='left'
              label='Email'
              placeholder='Email'
              onChange={this.handleEmailChange}
              value={this.state.email}
            />

            <Form.Input
              icon='lock'
              iconPosition='left'
              label='Password'
              type='password'
              placeholder='Password'
              onChange={this.handlePasswordChange}
              value={this.state.password}
            />
            <Button content='Login' icon='sign-in' primary onClick={this.submitLogin} />
          </Form>
        </Grid.Column>

        <Grid.Column verticalAlign='middle'>
          <Form>
            <Form.Input
              label='First Name'
              placeholder='First Name'
              onChange={this.handleFNameChange}
              value={this.state.firstName}
            />
            <Form.Input
              label='Last Name'
              placeholder='Last Name'
              onChange={this.handleLNameChange}
              value={this.state.lastName}
            />
            <Form.Input
              label='Phone Number'
              placeholder='Phone Number'
              onChange={this.handlePhoneChange}
              value={this.state.phone}
            />
            <Form.Field>
              <Radio
                label='Charger'
                name='radioGroup'
                value='Charger'
                checked={this.state.accountType === 'Charger'}
                onChange={this.handleRadioChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label='Driver'
                name='radioGroup'
                value='Driver'
                checked={this.state.accountType === 'Driver'}
                onChange={this.handleRadioChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label='Customer'
                name='radioGroup'
                value='Customer'
                checked={this.state.accountType === 'Customer'}
                onChange={this.handleRadioChange}
              />
            </Form.Field>
            {
              this.state.accountType === 'Driver' ?
                <div>
                  <Form.Input
                    label='License Plate'
                    placeholder='License Plate'
                    onChange={this.handleLicensePlateChange}
                    value={this.state.carState.licensePlate}
                  />
                  <Form.Input
                    label='Num Seats'
                    placeholder='Num Seats'
                    onChange={this.handleSeatChange}
                    value={this.state.carState.seats}
                  />
                  <Form.Input
                    label='Make'
                    placeholder='Make'
                    onChange={this.handleMakeChange}
                    value={this.state.carState.make}
                  />
                  <Form.Input
                    label='Color'
                    placeholder='Color'
                    onChange={this.handleColorChange}
                    value={this.state.carState.color}
                  />
                </div>
                : null
            }
            <Button content='Sign Up' icon='signup' onClick={this.submitSignup} />
          </Form>
        </Grid.Column>
      </Grid>
      <Divider vertical>Or</Divider>
    </Segment>
  )

  submitLogin = () => {
    if (!validateInputs([this.state.email, this.state.password])) {
      alert('Please enter an email/password.');
      return;
    }
    axios.post('http://localhost:5000/api/login', {
      email: this.state.email,
      password: this.state.password
    }).then((response) => {
      this.handleAuthSuccess(response);
    }).catch((error) => {
      alert('Login Failed! Invalid username or password');
    })
  }

  submitSignup = () => {
    if (!validateInputs([this.state.email, this.state.password, this.state.firstName,
    this.state.lastName, this.state.phone, this.state.accountType]) ||
      (this.state.accountType === 'Driver' &&
        !validateInputs([this.state.carState.licensePlate, this.state.carState.seats,
        this.state.carState.make, this.state.carState.color]))) {

      alert('Please fill out all the forms.');
      return;
    }

    axios.post('http://localhost:5000/api/signup', {
      ...this.state, ...this.state.carState
    }).then((response) => {
      this.handleAuthSuccess(response);
    }).catch((error) => {
      alert('Signup failed! Something went wrong.');
    })
  }

  handleAuthSuccess = (response) => {
    localStorage.setItem('accountId', response.data.accountId);
    localStorage.setItem('accountType', response.data.accountType);
    history.push('/');
  }

  handleRadioChange = (event, { value }) => {
    this.setState({
      accountType: value
    })
  }

  handleLicensePlateChange = (event, { value }) => {
    const carState = this.state.carState;
    carState.licensePlate = value;
    this.setState({
      carState
    })
  }

  handleSeatChange = (event, { value }) => {
    const carState = this.state.carState;
    carState.seats = value;
    this.setState({
      carState
    })
  }

  handleMakeChange = (event, { value }) => {
    const carState = this.state.carState;
    carState.make = value;
    this.setState({
      carState
    })
  }

  handleColorChange = (event, { value }) => {
    const carState = this.state.carState;
    carState.color = value;
    this.setState({
      carState
    })
  }

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value
    })
  }

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value
    });
  }

  handleFNameChange = (event) => {
    this.setState({
      firstName: event.target.value
    })
  }

  handleLNameChange = (event) => {
    this.setState({
      lastName: event.target.value
    });
  }

  handlePhoneChange = (event) => {
    this.setState({
      phone: event.target.value
    });
  }
}



export default Login;