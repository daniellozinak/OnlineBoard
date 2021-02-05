var app =   require('express')();
var http =  require('http').createServer(app);
var io =    require('socket.io')(http);
require('./socket/socket')(io);

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, ()=>{
    console.log("server started on " + server_port);
})

// var cors = require('cors');
// var board_router = require("./routes/board");

// app.use("/board",board_router);
// app.use(cors());



//move to another folder

// current_content = [];
// current_pointer = 0;

// function filter_empty_array(array)
// {
//   if(!Array.isArray(array)) {return null;}

//   var filtered = array.filter(n => n);

//   console.log(filtered); 
//   return filtered;
// }

// function move_content(data)
// {
//   if(typeof data !== 'object') {return;}
//   if(!data.hasOwnProperty('key') || !data.hasOwnProperty('points')){return;}
  
//   for(var i in current_content)
//   {
//     if(current_content[i].key === data.key)
//     {
//       current_content[i].points = data.points;
//     }
//   }
// }

// var i = 0;
// rooms=[];
// users=[];

// io.on('connection', (socket)=>{
//     i++;
//     socket.nickname = "client_" + i;
//     let new_user = models.create_client(socket.id,null);
//     users = [...users,new_user];


//     // users.forEach(element => {
//     //   console.log(element);
//     // });

//     // socket.emit('canvas-data-initial',{content: current_content,pointer: current_pointer});

//     // socket.on('canvas-data', (data)=>{
//     //     socket.to(new_room).emit('canvas-data',data);
//     // })

//     // socket.on('canvas-data-delete',(data)=>{
//     //   delete current_content[data];
//     //   current_pointer--;
//     //   socket.broadcast.emit('canvas-data-delete',data);
//     // })

//     // socket.on('canvas-data-move',(data)=>{
//     //   move_content(data);
//     //   socket.broadcast.emit('canvas-data-move',data);
//     // })

//     // socket.on('canvas-data-filter',(data)=>{
//     //     socket.broadcast.emit('canvas-data-filter',data);
//     //     current_content = filter_empty_array(current_content);
//     // })

//     socket.on('new-room',() =>{
//       try{
//         let crypto = require('crypto');
//         let new_room = crypto.randomBytes(20).toString('hex');
//         rooms = [...rooms,new_room];
//         socket.join(new_room);
//         console.log("line 90");

//         users.forEach(element => {
//           if(element.id === socket.id){ element.room = new_room}
//         });

//         console.log(socket.id);
//         console.log(users);

//         // var roster = io.sockets.adapter.rooms[new_room];
//         // console.log(roster);

//         socket.to(new_room).emit("user joined test room: ",socket.id);
//         socket.emit('created-room',new_room);
//       }
//       catch(e){
//         console.log('[error]','join room :',e);
//         socket.emit('error','couldnt perform requested action');
//       }
//       //let crypto = require('crypto');
//       //let new_room = crypto.randomBytes(20).toString('hex');
//     })
// })