import React from 'react';
import { TextArea, Button, Header } from 'semantic-ui-react';
import { Picker, Emoji } from 'emoji-mart';
import io from 'socket.io-client';
import { navigate } from '@reach/router';
import moment from 'moment';
import config from '../../globals/config';

const socket = io(`${config.SERVER_URL}`);

const Savior = () => {
  const [emojiOpen, setEmojiOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [presetMessages] = React.useState(config.PRESET_MESSAGES);
  let textAreaRef = React.useRef();

  React.useEffect(() => {
    let username = localStorage.getItem('username');
    if (!username) {
      navigate('/');
    }
  }, []);

  const messageOnChange = e => {
    setMessage(e.target.value);
    if (emojiOpen) setEmojiOpen(false);
  };

  const messageOnSubmit = e => {
    e.preventDefault();
    const msgData = {
      username: localStorage.getItem('username'),
      message,
      timestamp: Date.now(),
    };
    let msgs = messages;
    socket.emit('message', msgData);
    setMessage('');
    msgs.unshift(msgData);
    setMessages(msgs);
  };

  const emojiOnClick = emoji => {
    setMessage(message + emoji.native);
    textAreaRef.current.focus();
  };

  const presetOnClick = text => {
    textAreaRef.current.focus();
    textAreaRef.current.ref.current.value = message + text + ' ';
    setMessage(message + text + ' ');
  };

  const toggleOmoji = () => {
    setEmojiOpen(!emojiOpen);
  };

  return (
    <div className='savior-container'>
      <form className='message-container' onSubmit={messageOnSubmit}>
        <TextArea
          ref={textAreaRef}
          type='text'
          placeholder='Type your message here...'
          className='message-input'
          value={message}
          onChange={messageOnChange}
          maxLength='140'
          rows='5'
        />
        <div className='preset-messages'>
          {presetMessages.map((pre, i) => (
            <Button
              key={i}
              content={pre.text}
              className='preset-message'
              onClick={() => presetOnClick(pre.text)}
              type='button'
            />
          ))}
        </div>
        <div className='message-footer'>
          <div className='left'>
            <p className='chars_left'>{message.length} / 140</p>
            <Emoji
              emoji={{ id: 'slightly_smiling_face', skin: 4 }}
              size={24}
              native={true}
              onClick={toggleOmoji}
            />
          </div>
          <div className='right'>
            <Button content='Send' disabled={!message.length} primary />
          </div>
        </div>
        {emojiOpen && (
          <div className='emoji-picker'>
            <Picker
              set='emojione'
              showPreview={false}
              title=''
              showSkinTones={false}
              emoji=''
              color='#313131'
              onClick={emojiOnClick}
              native={true}
            />
          </div>
        )}
      </form>
      <div className='message-history'>
        <Header as='h4' content='History' />
        <div className='history-box'>
          <ul>
            {messages.map((msg, id) => (
              <li key={id}>
                <p>{msg.message}</p>
                <span>{moment(msg.timestamp).fromNow()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Savior;
