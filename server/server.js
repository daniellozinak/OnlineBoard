var app =   require('express')();
var http =  require('http').createServer(app);
var io =    require('socket.io')(http);
var cors = require('cors');
var board_router = require("./routes/board");

app.use("/board",board_router);
app.use(cors());



//move to another folder

current_content = [];
current_pointer = 0;

function filter_empty_array(array)
{
  if(!Array.isArray(array)) {return null;}

  var filtered = array.filter(n => n);

  console.log(filtered); 
  return filtered;
}

function move_content(data)
{
  if(typeof data !== 'object') {return;}
  if(!data.hasOwnProperty('key') || !data.hasOwnProperty('points')){return;}
  
  for(var i in current_content)
  {
    if(current_content[i].key === data.key)
    {
      current_content[i].points = data.points;
    }
  }
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

    socket.on('canvas-data-move',(data)=>{
      move_content(data);
      socket.broadcast.emit('canvas-data-move',data);
    })

    socket.on('canvas-data-filter',(data)=>{
        socket.broadcast.emit('canvas-data-filter',data);
        current_content = filter_empty_array(current_content);
    })
})

//move to another folder

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, ()=>{
    console.log("server started on " + server_port);
})
