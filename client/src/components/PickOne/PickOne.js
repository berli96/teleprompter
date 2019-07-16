import React from 'react';
import { Header } from 'semantic-ui-react';
import { navigate } from '@reach/router';

const PickOne = () => {

  const goToSignIn = role => {
    localStorage.setItem('role', role);
    navigate('/signin');
  };

  return (
    <div className='pick-one'>
      <Header as='h4' className='pick-header'>
        <span>Pick your side!</span>
      </Header>
      <button className='part one' tabIndex='0' onClick={() => goToSignIn('moderator')}>
        <Header as='h3'>Moderator</Header>
        <p className='description'>
          Someone who sends messages to the prompt screen
        </p>
      </button>
      <button
        className='part two'
        tabIndex='0'
        onClick={() => goToSignIn('prompt')}
      >
        <Header as='h3'>Prompt Screen</Header>
        <p className='description'>Shows the teleprompter screen</p>
      </button>
    </div>
  );
};

export default PickOne;
