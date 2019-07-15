import React from 'react';
import io from 'socket.io-client';
import { Textfit } from 'react-textfit';
import { Icon } from 'semantic-ui-react';
import { navigate } from '@reach/router';

import config from '../../globals/config';

const socket = io(`${config.SERVER_URL}`);

const Prompter = () => {
  const [messages, setMessages] = React.useState([]);
  const [fullScreen, setFullScreen] = React.useState(false);

  const [shownMessage, setShownMessage] = React.useState('');
  let messageRef = React.useRef();
  let prompterRef = React.useRef();

  React.useEffect(() => {
    let username = localStorage.getItem('username');
    if (!username) {
      navigate('/');
    }
  }, []);

  React.useEffect(() => {
    socket.on('messageReceive', data => {
      let msgs = messages;
      msgs.unshift(data);
      setMessages(msgs);
      if (msgs.length === 0) {
        setShownMessage('No message for now');
      } else {
        setTimeout(() => {
          messageRef.current.classList.add('fadeIn');
          setShownMessage(messages[messages.length - 1]);
          msgs.splice(msgs.length - 1, 1);
          setMessages(msgs);
        }, 4000 * msgs.length);
        if (msgs.length > 1) {
          setTimeout(() => {
            messageRef.current.classList.remove('fadeIn');
          }, 3900 * msgs.length);
        }
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [messages]);

  React.useEffect(() => {
    let interval = setInterval(() => {
      console.log(messages.length);
      if(!messages.length) {
        setShownMessage('');
      } else {
        clearInterval(interval);
      }
    }, 5000);
  }, [messages]);

  const toggleFullScreen = () => {
    console.log(messages);
    let elem = document.documentElement;

    // if(!fullScreen) {
    //   if (elem.requestFullscreen) {
    //     elem.requestFullscreen();
    //   } else if (elem.mozRequestFullScreen) { /* Firefox */
    //     elem.mozRequestFullScreen();
    //   } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    //     elem.webkitRequestFullscreen();
    //   } else if (elem.msRequestFullscreen) { /* IE/Edge */
    //     elem.msRequestFullscreen();
    //   }
    //   setFullScreen(true);
    // } else {
    //   if (document.exitFullscreen) {
    //     document.exitFullscreen();
    //   } else if (document.mozCancelFullScreen) { /* Firefox */
    //     document.mozCancelFullScreen();
    //   } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    //     document.webkitExitFullscreen();
    //   } else if (document.msExitFullscreen) { /* IE/Edge */
    //     document.msExitFullscreen();
    //   }
    //   setFullScreen(false);
    // }
  }

  return (
    <div className='prompter-container' ref={prompterRef}>
      <div className="fullscreen" onClick={toggleFullScreen} title={fullScreen ? "Close Fullscreen" : "Fullscreen"}>
        <Icon name={fullScreen ? "compress" : "expand"} color={shownMessage.username ? "black" : "white"} size="big" />
      </div>
      {shownMessage.username && (
        <div className='sender-name-container'>
          <div className='sender-name'>
            <p>{shownMessage.username}</p>
            {/* <span>{moment(shownMessage.timestamp).fromNow()}</span> */}
          </div>
        </div>
      )}
      <div id='message-textfit' className='animated' ref={messageRef}>
        <Textfit
          mode={shownMessage.message ? 'multi' : 'multi'}
          style={{
            height: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1',
            width: '90%',
            margin: 'auto',
          }}
          max={200}
        >
          {shownMessage.message ? shownMessage.message : 'No Message'}
        </Textfit>
      </div>
    </div>
  );
};

export default Prompter;
