const net = require('net'),
      PubSub = require('./pub-sub');

const hostname = '127.0.0.1';
const service_port = 9090;
const client_port = 9099;

const pubSub = new PubSub();

/*
  Connects to the service on 9090. Get events from it and pass them to the pubsub
*/
console.log('Creating server listener on ' + service_port);
let serverConnection = net.createServer((sock) => {
  
  // Add a 'data' event handler to this instance of socket
  sock.on('data', function(data) {
    // Add to the pub sub, type coercion of data to string
    pubSub.publish('' + data);
  });
  
  // Add a 'close' event handler to this instance of socket
  sock.on('close', function(data) {
    console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
  });
})
.listen(service_port, hostname)
.on('error', (err) => {
  console.log('Server error ' + err)
});


/*
The many *user clients* will **connect on port 9099**. As soon
as the connection is accepted, they will send to the server the ID of
the represented user, so that the server knows which events to
inform them of. For example, once connected a *user client* may send down:
`2932\r\n`, indicating that they are representing user 2932.

After the identification is sent, the *user client* starts waiting for
events to be sent to them. Events coming from *event source* should be
sent to relevant *user clients* exactly like read, no modification is
required or allowed.
*/
console.log('Creating client listener on ' + client_port);
let clientConnection = net.createServer((sock) => {
  console.log('Connected to CLIENT port: ' + sock.remoteAddress + ':' + sock.remotePort);
  
  sock.on('data', function(data) {
    const userId = (''+data).trim(); // A little type coercion again
    pubSub.subscribe(userId, sock);
  });
  
  sock.on('close', function(data) {
    console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
  });

  sock.on('timeout', (data) => {
    console.log('Client Timeout:' + data);
  });
})
.listen(client_port, hostname)
.on('error', (err) => {;
  console.log('Client error ' + err)
});
