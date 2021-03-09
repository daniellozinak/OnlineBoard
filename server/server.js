var app =   require('express')();
var http =  require('http').createServer(app);
var io =    require('socket.io')(http);
require('./socket/socket')(io);

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, ()=>{
    console.log("server started on " + server_port);
})