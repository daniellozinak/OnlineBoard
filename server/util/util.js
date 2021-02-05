module.exports = {
    is_in_room: function(clients,socket_id)
    {

        console.log("current client: " + socket_id);
        clients.forEach(client => {
            console.log("Client: id " + client.id);
            console.log("Client: room " + client.room);
            if(client.id === socket_id && client.room !== null){return true;}
        });

        return false;
    }
}