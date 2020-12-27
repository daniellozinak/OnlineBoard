var app =   require('express')();
var http =  require('http').createServer(app);
var io =    require('socket.io')(http);

current_content = [];
current_pointer = 0;


function filter_empty_array(array)
{
  if(!Array.isArray(array)) {return null;}

  var filtered = array.filter(n => n);

  console.log(filtered); 
  return filtered;
}

io.on('connection', (socket)=>{
    console.log("new user online " + socket.id);

    socket.emit('canvas-data-initial',{content: current_content,pointer: current_pointer});

    socket.on('canvas-data', (data)=>{
        current_content.push(data);
        current_pointer +=1;
        socket.broadcast.emit('canvas-data',data);
    })

    socket.on('canvas-data-delete',(data)=>{
      delete current_content[data];
      current_pointer--;
      socket.broadcast.emit('canvas-data-delete',data);
    })

    socket.on('canvas-data-filter',(data)=>{
        socket.broadcast.emit('canvas-data-filter',data);
        current_content = filter_empty_array(current_content);
    })
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, ()=>{
    console.log("server started on " + server_port);
})
