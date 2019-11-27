import React from 'react'
import { Button, Divider, Form, Grid, Segment } from 'semantic-ui-react'

class Login extends Component{
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
              onChange= {this.handleEmailChange}
            />

            <Form.Input
              icon='lock'
              iconPosition='left'
              label='Password'
              type='password'
              onChange= {this.handlePasswordChange}
            />

            <Button 
            content='Login' 
            icon = 'sign-in'
            onClick= {} //TODO later
            primary />
          </Form>
        </Grid.Column>

        <Grid.Column verticalAlign='middle'>
          <Button 
          content='Sign up' 
          icon='signup' 
          size='big' /> 
        </Grid.Column>

      </Grid>

      <Divider vertical>Or</Divider>
    </Segment>
  )

  handleEmailChange(event){
    //set state
  }

  handlePasswordChange(event){
    //set state
  }
}



export default DividerExampleVerticalForm