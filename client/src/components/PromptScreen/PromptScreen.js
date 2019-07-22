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

  React.useEffect(() => {
    let msgs = messages;
    socket.on('messageReceive', data => {
      msgs.push(data);
      setMessages(msgs);
    });
    return () => {
      socket.disconnect();
    };
  }, [messages]);

  React.useEffect(() => {
    let schd = setInterval(() => {
      let msg = messages;
      prompterRef.current.classList.remove('background-black');
      prompterRef.current.classList.add('background-red');
      messageRef.current.classList.remove('fadeIn');
        messageRef.current.classList.add('fadeOut');
      setShownMessage(msg[0]);
      messageRef.current.classList.remove('fadeOut');
      messageRef.current.classList.add('fadeIn');
      prompterRef.current.classList.remove('background-red');
      prompterRef.current.classList.add('background-black');
      msg.splice(0, 1);
      setMessages(msg);
    }, 10000);

    return () => clearInterval(schd);

  }, [messages])

  // React.useEffect(() => {
  //   let timer = setTimeout(() => {
  //     console.log(messages[0]);
  //     let msg = messages;
  //     setMessages(msg);
  //   }, 3000);
  // }, [messages]);


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
        <Icon name={fullScreen ? "compress" : "expand"} color={shownMessage && shownMessage.username ? "black" : "white"} size="big" />
      </div>
      {shownMessage && shownMessage.username && (
        <div className='sender-name-container'>
          <div className='sender-name'>
            <p>{shownMessage.username}</p>
            {/* <span>{moment(shownMessage.timestamp).fromNow()}</span> */}
          </div>
        </div>
      )}
      <div id='message-textfit' className='animated' ref={messageRef}>
        <Textfit
          mode="multi"
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
          {shownMessage && shownMessage.message !== undefined ? shownMessage.message : 'No Message'}
        </Textfit>
      </div>
    </div>
  );
};

export default Prompter;
