import React from 'react';
import { Button, Divider, Form, Grid, Segment } from 'semantic-ui-react';
import history from '../history';
const axios = require('axios');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
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
            <Button content='Login' primary onClick={this.submitLogin} />
          </Form>
        </Grid.Column>

        <Grid.Column verticalAlign='middle'>
          <Button content='Sign up' icon='signup' size='big' />
        </Grid.Column>
      </Grid>
      <Divider vertical>Or</Divider>
    </Segment>
  )

  submitLogin = () => {
    axios.post('http://localhost:5000/api/login', {
      email: this.state.email,
      password: this.state.password
    }).then((response) => {
      localStorage.setItem('accountId', response.data.accountId);
      history.push('/');
    }).catch((error) => {
      alert('Login Failed! Invalid username or password');
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
}



export default Login;