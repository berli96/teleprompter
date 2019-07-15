import React from 'react';
import { Input, Button, Header } from 'semantic-ui-react';
import { navigate } from '@reach/router';
import axios from 'axios';
import config from '../../globals/config';

const Auth = () => {
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');

  // React.useEffect(() => {
  //   let username = localStorage.getItem('username');
  //   let role = localStorage.getItem('role');
  
  //   if(username && role === "moderator"){
  //     navigate('/savior')
  //   } else if(username && role === "prompt") {
  //     navigate('/prompter')
  //   }

  // }, [])

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
          let role = localStorage.getItem('role');
          if(role === "moderator"){
            navigate('/savior');
          } else {
            navigate('/prompter');
          }
        }
      });
  }

  return (
    <div className='signin-container'>
      <div className='form-container'>
        <div>
          <div className="logo-container">
            <img
              src='./images/Skycoin-Cloud-BB-Vertical.png'
              alt='savior-gif'
            />
          </div>
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
