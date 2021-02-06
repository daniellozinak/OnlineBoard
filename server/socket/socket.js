var rooms = [];
var client_model = require('../model/client');
const socket_container = require('../model/socket_container');
var socket_model = require('../model/socket_container');
var util = require('../util/util');

var container = socket_model.socket_container;

module.exports = (io) =>{
    io.on('connection',function(socket){
        socket.on('new-room',() =>{

            //check if socket already exists
            if(container.isInContainer(socket,container.sockets))
            {
                console.log(socket.id + " is already in room");
                socket.emit('already-in-room',null);
                return;
            }
            
            //add socket to container
            container.addSocket(socket);

            //generate new room
            let crypto = require('crypto');
            let new_room = crypto.randomBytes(20).toString('hex');

            //add room to room container
            rooms = [...rooms,new_room];

            //join the new room
            socket.join(new_room);
    
            //socket.to(new_room).emit("user joined test room: ",socket.id);

            //emit message back to client
            socket.emit('created-room',new_room);

            //log
            console.log('new room created: ' + new_room);
            console.log('room list');
            console.log(rooms);
        })

        socket.on('leave-room',()=>{

        })

        socket.on('join-room',(room)=>{
            room = room.replace('/draw/','');
            if(room === '' || room === '/draw') {return;}

            if(!util.is_room(rooms,room))
            {
                socket.emit('invalid-room',room);
                return;
            }

            if(container.isInContainer(socket,container.sockets))
            {
                console.log(socket.id + " is already in room");
                socket.emit('already-in-room',null);
                return;
            }

            container.addSocket(socket);

            socket.join(room);
            socket.emit('joined',room);
            socket.to(room).emit('new-user',socket.id);
            console.log(socket.id + " joined " + room);
        })
    })
}