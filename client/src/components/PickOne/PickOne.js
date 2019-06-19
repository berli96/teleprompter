import React from 'react';
import { Header } from 'semantic-ui-react';
import { navigate } from '@reach/router';

const PickOne = () => {
  const goTo = url => {
    navigate(url);
  };

  return (
    <div className='pick-one'>
      <Header as='h2' className='pick-header'>
        Pick your side!
      </Header>
      <button className='part one' tabIndex='0' onClick={() => goTo('/signin')}>
        <Header as='h3'>Moderator</Header>
        <p className='description'>
          Someone who sends messages to the prompt screen
        </p>
      </button>
      <button
        className='part two'
        tabIndex='0'
        onClick={() => goTo('/prompter')}
      >
        <Header as='h3'>Prompt Screen</Header>
        <p className='description'>Shows the teleprompter screen</p>
      </button>
    </div>
  );
};

export default PickOne;
