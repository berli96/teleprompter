import React from 'react';
import { Input, Button, Header } from 'semantic-ui-react';
import { navigate } from '@reach/router';
import axios from 'axios';
import config from '../../globals/config';

const Auth = () => {
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');

  function handleInputOnChange(e) {
    if (e.target.name === 'username') {
      setUsername(e.target.value);
      return;
    }
    setPassword(e.target.value);
  }

  function signIn(e) {
    e.preventDefault();
    axios
      .post(
        `${config.SERVER_URL}/auth`,
        {},
        {
          auth: {
            username,
            password,
          },
        }
      )
      .then(res => {
        if (res.data.success) {
          localStorage.setItem('username', res.data.username);
          navigate('/savior');
        }
      });
  }

  return (
    <div className='signin-container'>
      <div className='form-container'>
        <div>
          <img
            src='https://media.giphy.com/media/KAq7hfwvKFZnoip8TO/200w_d.gif'
            alt='savior-gif'
          />
          <Header
            as='h4'
            content='Sign in first'
            style={{ marginTop: 0, marginBottom: '1em' }}
            textAlign='center'
          />
        </div>
        <form onSubmit={signIn}>
          <div className='form-item'>
            <Input
              placeholder='Username'
              name='username'
              type='text'
              value={username}
              className='savior-input'
              onChange={handleInputOnChange}
            />
          </div>
          <div className='form-item'>
            <Input
              placeholder='Password'
              name='password'
              type='password'
              value={password}
              className='savior-input'
              onChange={handleInputOnChange}
            />
          </div>
          <div className='form-item'>
            <Button content='Sign In' fluid type='submit' />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
