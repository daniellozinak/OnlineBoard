var app =   require('express')();
var http =  require('http').createServer(app);
var io =    require('socket.io')(http);

current_content = [];
current_pointer = 0;

io.on('connection', (socket)=>{
    console.log("new user online " + socket.id);

    socket.emit('canvas-data-initial',{content: current_content,pointer: current_pointer});

    socket.on('canvas-data', (data)=>{
        current_content.push(data);
        current_pointer +=1;
        socket.broadcast.emit('canvas-data',data);
    })

    socket.on('canvas-data-delete',(data)=>{
      current_content.splice(data,1);
      current_pointer--;
      socket.broadcast.emit('canvas-data-delete',data);
    })

    socket.on('canvas-data-filter',(data)=>{
        socket.broadcast.emit('canvas-data-filter',data);
      })
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, ()=>{
    console.log("server started on " + server_port);
})
