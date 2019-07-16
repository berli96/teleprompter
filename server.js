const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const auth = require('basic-auth');
const compare = require('tsscmp');
const cors = require('cors');
const path = require('path');

app.use(cors({ origin: '*' }));
const users = [
  { username: 'synth', password: 'skycoinadmin' },
  { username: 'haroon', password: 'skycoinadmin' },
  { username: 'steve', password: 'skycoinadmin' },
];

const check = (name, pass) =>
  users.some(
    user => compare(user.username, name) && compare(user.password, pass)
  );

app.use(express.static(path.join(__dirname, 'client/build')));

app.post('/auth', (req, res) => {
  const cre = auth(req);
  console.log(cre);
  const isValid = check(cre.name, cre.pass);

  if (isValid) {
    return res.json({ success: true, username: cre.name });
  }

  return res.json({ success: false });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

io.on('connection', socket => {
  socket.on('message', message => {
    socket.broadcast.emit('messageReceive', message);
  });
});

http.listen(process.env.PORT || 8080, '192.168.1.14', () => {
  console.log('server is running');
});
