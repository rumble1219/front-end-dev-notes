var net = require('net');

function getConnection(connName){
	//create a Socket object
	var client = net.connect({port: 8107, host: 'localhost'}, function() {
	  //handle connection

	  console.log(connName + ' connected: ');
	  console.log('   local = %s:%s', this.localAddress, this.localPort);
	  console.log('   remote = %s:%s', this.remoteAddress, this.remotePort);
	  this.setTimeout(500);
	  this.setEncoding('utf8');

	  //handle data coming back from the server
	  this.on('data', function(data) {
	  	console.log(connName + " From Server: " + data.toString());
	  	//process the data

	  	this.end();
	  });
	  this.on('end', function() {
		console.log(connName + ' Client disconnected');
	  });
	  this.on('error', function(err) {
	  	console.log('Socket Error: ', JSON.stringify(err));
	  });
	  this.on('timeout', function() {
	  	console.log('Socket Timed out');
	  });
	  this.on('close', function() {
	  	console.log('Socket Closed');
	  });
	});
	return client;
}

function writeData(socket, data) {
  var success = !socket.write(data);
  if (!success) {
  	// a closure is used to preserve the values of the socket and data variables once the function has ended.
  	(function(socket, data){
  	  /* If you are writting a lot of data to the server and the write fails, 
  	     you might also want to implement a drain event handler to begin writing again when the buffer is empty. */
  	  socket.once('drain', function(){
  	  	writeData(socket, data);
  	  });  	
  	})(socket, data);
  }
}

var Dwarves = getConnection("Dwarves");
var Elves = getConnection("Elves");
var Hobbits = getConnection("Hobbits");
writeData(Dwarves, "More Axes");
writeData(Elves, "More Arrows");
writeData(Hobbits, "More Pipe weed");