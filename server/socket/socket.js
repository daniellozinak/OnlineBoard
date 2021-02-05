var rooms = [];
var client_model = require('../model/client');
const socket_container = require('../model/socket_container');
var socket_model = require('../model/socket_container');
var util = require('../util/util');

var container = socket_model.socket_container;

module.exports = (io) =>{
    io.on('connection',function(socket){
        socket.on('new-room',() =>{
            if(container.isInContainer(socket,container.sockets))
            {
                console.log(socket.id + " is already in room");
                socket.emit('already-in-room',null);
            }
            
            container.addSocket(socket);

            let crypto = require('crypto');
            let new_room = crypto.randomBytes(20).toString('hex');
            rooms = [...rooms,new_room];

            // console.log(socket.id);
            socket.join(new_room);
    
            // // var roster = io.sockets.adapter.rooms[new_room];
            // // console.log(roster);
    
            socket.to(new_room).emit("user joined test room: ",socket.id);
            socket.emit('created-room',new_room);
            console.log(socket.id);
        })

        socket.on('leave-room',()=>{

        })
    })
}