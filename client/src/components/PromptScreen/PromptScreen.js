import React from 'react';
import io from 'socket.io-client';
import { Textfit } from 'react-textfit';
// import moment from 'moment';
import config from '../../globals/config';

const socket = io(`${config.SERVER_URL}`);

const Prompter = () => {
  const [messages, setMessages] = React.useState([]);

  const [shownMessage, setShownMessage] = React.useState('');
  let messageRef = React.useRef();

  React.useEffect(() => {
    socket.on('messageReceive', async data => {
      let msgs = messages;
      msgs.unshift(data);
      setMessages(msgs);
      if (messages.length === 0) {
        setShownMessage('No message for now');
      } else {
        setTimeout(() => {
          messageRef.current.classList.add('fadeIn');
          setShownMessage(messages[messages.length - 1]);
          msgs.splice(messages.length - 1, 1);
          setMessages(msgs);
        }, 4000 * messages.length);
        if (messages.length > 1) {
          setTimeout(() => {
            messageRef.current.classList.remove('fadeIn');
          }, 3900 * messages.length);
        }
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [messages]);

  return (
    <div className='prompter-container'>
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
