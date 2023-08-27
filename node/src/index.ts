const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
io.on('connection', (socket: any) => {
  console.log('connection');
  socket.broadcast.emit('name', { fff: 666 });
  socket.on('join', (name: string) => {
    socket.nickname = name;
    console.log("joinkname:" + name)
    // console.log(socket.broadcast.RequestHeaders);
    socket.broadcast.emit('announcement', name + 'join the chat');
    // socket.emit('announcement',name+'join the chat');
  })
  console.log("someone connected")


  // socket.on('message', (data: any) => {
  //   socket.broadcast.emit('push message', data);
  //   console.log(data);
  // })
});

server.listen(3000);