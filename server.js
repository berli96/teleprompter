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
  { username: 'admin', password: 'admin' },
  { username: 'jhon', password: 'doe' },
  { username: 'chad', password: 'bob' },
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

io.on('connection', socket => {
  socket.on('message', message => {
    socket.broadcast.emit('messageReceive', message);
  });
});

http.listen(process.port || 8080, () => {
  console.log('server is running');
});
