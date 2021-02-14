module.exports = {
    socket_container : {
        // A storage object to hold the sockets
        sockets: {},
      
        // Adds a socket to the storage object so it can be located by name
        addSocket: function(socket) {
          this.sockets[socket.id] = socket;
        },
      
        // Removes a socket from the storage object based on its name
        removeSocket: function(name) {
          if (this.sockets[name] !== undefined) {
            this.sockets[name] = null;
            delete this.sockets[name];
            console.log(name + ' deleted');
          }
        },
      
        // Returns a socket from the storage object based on its name
        // Throws an exception if the name is not valid
        getSocketByName: function(name) {
          if (this.sockets[name] !== undefined) {
            return this.sockets[name];
          } else {
            throw new Error("A socket with the name '"+name+"' does not exist");
          }
        },

        isInContainer: function(socket,container)
        {
            for(let key in container)
            {
                if(container[key].id === socket.id){
                    return true;
                }
            }
            return false;
        }
    }
}