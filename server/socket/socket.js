var rooms = [];
var socket_model = require('../model/socket_container');
var util = require('../util/util');
var room_model = require('../model/room');

var container = socket_model.socket_container;

module.exports = (io) =>{
    io.on('connection',function(socket){
        socket.on('new-room',(data) =>{
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
            // let new_room = crypto.randomBytes(20).toString('hex');
            let new_room = room_model.create_room(crypto.randomBytes(20).toString('hex'));

            new_room.content = data.content;
            new_room.pointer = data.pointer;
            

            //add room to room container
            rooms = [...rooms,new_room];

            //join the new room
            socket.join(new_room.id);

            //emit message back to client
            socket.emit('created-room',new_room.id);
        })

        socket.on('canvas-data', (data)=>{
            let client_room = util.find_room(rooms,io.sockets.adapter.rooms);
            if(client_room === null) 
            {
                console.log('user not in a room');
                return;
            }
            
            client_room.pointer ++;
            socket.to(client_room.id).emit('canvas-data',data);
        })

        socket.on('canvas-text-edit', (data) => {
            let client_room = util.find_room(rooms,io.sockets.adapter.rooms);
            if(client_room === null) 
            {
                console.log('user not in a room');
                return;
            }
            socket.to(client_room.id).emit('canvas-text-edit',data);
        })

        //'canvas-data-edit'
        socket.on('canvas-data-edit', (data) => {
            let client_room = util.find_room(rooms,io.sockets.adapter.rooms);
            if(client_room === null) 
            {
                console.log('user not in a room');
                return;
            }
            socket.to(client_room.id).emit('canvas-data-edit',data);
        })

        socket.on('join-room',(room_id)=>{
            room_id = room_id.replace('/draw/','');
            if(room_id === '' || room_id === '/draw') {return;}

            if(!util.is_room(rooms,room_id))
            {
                socket.emit('invalid-room',room_id);
                return;
            }

            if(container.isInContainer(socket,container.sockets))
            {
                console.log(socket.id + " is already in room");
                socket.emit('already-in-room',null);
                return;
            }

            container.addSocket(socket);

            socket.join(room_id);

            let room = util.find_room_by_id(rooms,room_id);
            room.connected ++;

            socket.emit('joined',{room_id: room.id,content: room.content, pointer: room.pointer});
            socket.to(room_id).emit('new-user',socket.id);
            console.log(socket.id + " joined " + room_id);
        })

        socket.on('leave-room',function(){
            let client_room = util.find_room(rooms,io.sockets.adapter.rooms);
            if(client_room === null) {return;}

            client_room.connected --;

            if(client_room.connected === 0)
            {
                util.remove_room(rooms,client_room);
            }
            else{
                console.log('someone left...');
                socket.to(client_room).emit('left',socket.id);
            }
        })

        socket.on('disconnect',function()
        {
            if(container.isInContainer(socket,container.sockets))
            {
                container.removeSocket(socket.id);
            }
            socket.disconnect();
            console.log('disconnect');
            console.log(container.sockets);
        })

        // content 
        socket.on('canvas-data-move',(data)=>{
            let client_room = util.find_room(rooms,io.sockets.adapter.rooms);
            if(client_room === null) 
            {
                console.log('user not in a room');
                return;
            }

            console.log("current room");
            console.log(client_room);

            util.move_content(client_room.content,data);
            socket.to(client_room.id).emit('canvas-data-move',data);
        })

        socket.on('canvas-data-delete',(data)=>{
            let client_room = util.find_room(rooms,io.sockets.adapter.rooms);
            if(client_room === null) 
            {
                console.log('user not in a room');
                return;
            }

            console.log("current room");
            console.log(client_room);

            delete client_room.content[data];
            client_room.pointer --;
            socket.to(client_room.id).emit('canvas-data-delete',data);
        })

        socket.on('canvas-data-filter',(data)=>{
            let client_room = util.find_room(rooms,io.sockets.adapter.rooms);
            if(client_room === null) 
            {
                console.log('user not in a room');
                return;
            }

            client_room.content = util.filter_content(client_room.content);
            socket.to(client_room.id).emit('canvas-data-filter',data);
        })
    })
}