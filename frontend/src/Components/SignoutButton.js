import React from 'react';
import { Button } from 'semantic-ui-react';
import history from '../history';

function signOut() {
    localStorage.removeItem('accountId');
    history.push('/');
}

const SignoutButton = () => (
    <Button fluid onClick={signOut}>Sign Out!</Button>
)

export default SignoutButton;