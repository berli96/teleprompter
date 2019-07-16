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

  const [shownMessage, setShownMessage] = React.useState({});
  let messageRef = React.useRef();
  let prompterRef = React.useRef();
  

  React.useEffect(() => {
    let username = localStorage.getItem('username');
    if (!username) {
      navigate('/');
    }
  }, []);

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  React.useEffect(() => {
    socket.on('messageReceive', data => {
      let msgs = messages;
      msgs.push(data);
      setMessages(msgs);
      setTimeout(async function() {
        setShownMessage({message: ''});
        messageRef.current.classList.remove('fadeOut');
        prompterRef.current.classList.add('backgound-red');
        messageRef.current.classList.add('fadeIn');
        setShownMessage(messages[0]);
        await wait(500);
        prompterRef.current.classList.remove('backgound-red');
        prompterRef.current.classList.add('backgound-black');
        setMessages(msgs);
      }, 10000 * (messages.length - 1) - 1000);

      setTimeout(function() {
        msgs.splice(0, 1);
        setMessages(msgs);
        messageRef.current.classList.remove('fadeIn');
        prompterRef.current.classList.remove('backgound-black');
        if(messages.length > 0 ) {
          messageRef.current.classList.add('fadeOut');
        }
      }, (10000 * messages.length - 1));

    });
    return () => {
      socket.disconnect();
    };
  }, [messages]);


  const toggleFullScreen = () => {
    let elem = document.documentElement;

    if(!fullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
      }
      setFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
      }
      setFullScreen(false);
    }
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
          {shownMessage.message !== undefined ? shownMessage.message : 'No Message'}
        </Textfit>
      </div>
    </div>
  );
};

export default Prompter;
