import React from 'react';
import { Button } from 'semantic-ui-react';
import history from '../history';

function signOut() {
    localStorage.removeItem('accountId');
    history.push('/');
}

const SignoutButton = () => (
    <Button 
        size='large' 
        icon = 'sign-out'
        onClick={signOut}
        content = 'Sign Out!'
    />

)

export default SignoutButton;